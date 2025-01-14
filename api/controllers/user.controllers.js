import { User } from '../models/user.models.js';
import { Post } from '../models/posts.models.js';
import { Like } from '../models/likes.models.js';
import { generateAccessANDrefreshToken } from '../controllers/generate.controllers.js';
import bcrypt from 'bcrypt';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const getUser = async (req, res, next) => {
    try {
      const { userName, userId } = req.query;
      const query = {};
      if (userName) query.userName = userName;
      if (userId) query._id = userId;
  
      const user = await User.findOne(query).select('-password -refreshToken');
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: 'User found', user });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
};

export const getUsers = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(403)
        .json({message: 'Only admin can have access to all users'})
    }
    try {
        const startIndex = Math.max(0, parseInt(req.query.startIndex) || 0);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const queryFilters = {
            ...(req.query.userId && { _id: req.query.userId }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.userName && { userName: req.query.userName }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        };

        const users = await User.find(queryFilters)
            .select('-password -refreshToken')
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalUsers = await User.countDocuments(queryFilters);

        return res.status(200).json({ users, totalUsers });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const register = async (req, res) => {
    const { userName, fullName, emailID, password } = req.body;

    if (userName.search(' ') >= 0) {
        return res.status(400).json({ message: 'Username cannot contain spaces' });
    }
    
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (!userName || !fullName || !emailID || !password || [userName, fullName, emailID, password].some(field => String(field).trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
        $or: [{ userName }, { emailID }]
    }).select('-password -refreshToken');

    if (existingUser) {
        return res.status(400).json({ message: "User already exists", user: existingUser });
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        emailID,
        fullName,
        password
    });

    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    if (!userCreated) {
        return res.status(500).json({ message: "Server error while creating user" });
    }

    return res.status(201).json({ message: "User Registered Successfully", user: userCreated });
};

export const login = async (req, res) => {
    const { userName, emailID, password } = req.body;
    
    if (!userName || !emailID || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({
        $or: [{ userName }, { emailID }]
    });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid Password" });
    }

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    if (!loggedInUser) {
        return res.status(500).json({ message: "Error while logging in" });
    }

    const { accessToken, refreshToken } = await generateAccessANDrefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true,
    };

    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', refreshToken, options);

    return res.status(200).json({
        message: "User Logged In Successfully",
        user: loggedInUser
    });
};

export const google = async (req, res) => {
    const { userName, emailID, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ emailID }).select('-password -refreshToken');
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        let accessToken, refreshToken;

        if (user) {
            // User exists
            ({ accessToken, refreshToken } = await generateAccessANDrefreshToken(user._id));
            return res
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .status(200)
                .json({ message: 'Logged in using Google', user });
        } else {
            // Create new user
            const generatedPassword = Math.random().toString(36).slice(-16); // Example for generating a password
            const hashedPassword = bcrypt.hashSync(generatedPassword, 8);
            const newUser = await User.create({
                userName: userName.split(" ").join("").toLowerCase(),
                emailID,
                password: hashedPassword,
                profilePhoto: googlePhotoUrl,
                fullName: userName
            });
            ({ accessToken, refreshToken } = await generateAccessANDrefreshToken(newUser._id));
            return res
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .status(200)
                .json({ message: 'Account created successfully', user: newUser });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const logout = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.body._id,
        { $set: { refreshToken: null } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);

    return res.status(200).json({ message: "User logged out" });
};

export const updateProfilePhoto = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userProfilePhoto = req.file?.path;
        if (!userProfilePhoto) {
            return res.status(400).json({ success: false, message: 'Profile photo is required' });
        }

        const userProfile = await uploadOnCloudinary(userProfilePhoto);
        if (!userProfile || !userProfile.url) {
            return res.status(500).json({ success: false, message: 'Failed to upload profile photo' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { profilePhoto: userProfile.url } },
            { new: true }
        ).select('-password -refreshToken');

        return res.status(200).json({
            success: true,
            message: 'Profile photo updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.query.userId || req.user._id.toString();
        const loggedInUser = await User.findById(req.user._id);

        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!loggedInUser.isAdmin && userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "Operation not allowed" });
        }

        const checkUserName = await User.findOne({userName: req.body.userName})
        if(checkUserName && checkUserName.userName !== req.body.userName) {
            return res.status(403).json({message: 'Username already taken'});
        }

        const updates = {
            userName: req.body.userName,
            fullName: req.body.fullName,
            emailID: req.body.emailID,
            bio: req.body.bio,
            isAdmin: req.body.admin,
        };

        if (!loggedInUser.isAdmin) {
            const password = req.body.oldPassword;
            if (!password) {
                return res.status(400).json({ message: "Old Password is required" });
            }

            const passwordMatch = await bcrypt.compare(password, loggedInUser.password);
            if (!passwordMatch) {
                return res.status(400).json({ message: "Old Password is incorrect" });
            }

            const newPassword = req.body.newPassword;
            if (newPassword) {
                updates.password = bcrypt.hashSync(newPassword, 8);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true })
            .select('-password -refreshToken');

        return res.status(200).json({ user: updatedUser, message: 'User details updated successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Uh Oh! Sorry, Username already taken. Please try something else' });
        }
        return res.status(error.statusCode || 500).json({ message: error.message || 'An unexpected error occurred' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.query.userId || req.user._id.toString();
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isAdmin && userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "Operation not allowed" });
        }

        await User.findByIdAndDelete(userId);
        await Post.deleteMany({ userId });
        await Comment.deleteMany({ userId });
        await Like.deleteMany({ userId });

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};