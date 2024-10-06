import { User } from '../models/user.models.js';
import { Post } from '../models/posts.models.js';
import { generateAccessANDrefreshToken } from '../controllers/generate.controllers.js';
import bcrypt from 'bcrypt';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const getUser = async (req, res) => {
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
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const register = async (req, res) => {
    const { userName, fullName, emailID, password } = req.body;

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
        maxAge: 24 * 60 * 60 * 1000
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
            secure: true,
        };
        if (user) {
            const { accessToken, refreshToken } = generateAccessANDrefreshToken(user._id);
            return res.cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .status(200)
                .json({ message: 'Logged in using Google', user });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 8);
            const newUser = await User.create({
                userName: userName.split(" ").join("").toLowerCase(),
                emailID,
                password: hashedPassword,
                profilePhoto: googlePhotoUrl,
                fullName: userName
            });
            const createdUser = await User.findById(newUser._id).select('-password -refreshToken');
            const { accessToken, refreshToken } = generateAccessANDrefreshToken(newUser._id);
            return res.status(200)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json({ message: 'Account created successfully', user: createdUser });
        }
    } catch (error) {
        next(error);
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
        secure: true
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
        console.error("Error occurred:", error);
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

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};