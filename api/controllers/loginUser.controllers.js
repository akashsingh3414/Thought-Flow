import { User } from '../models/user.models.js';
import { generateAccessANDrefreshToken } from '../controllers/generate.controllers.js';
import bcrypt from 'bcrypt'

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


export const google = async (req, res, next) => {
    const { userName, emailID, googlePhotoUrl } = req.body;
    try {
    const user = await User.findOne({emailID}).select('-password -refreshToken');
    if(user){
        const options = {
            httpOnly: true,
            secure: true,
        }
        res.user = user;
        const {accessToken, refreshToken} = generateAccessANDrefreshToken(user._id);
        return res.cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .status(200)
        .json({
            message: 'Logged in using Google',
            user: user
        })
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
        const createdUser = await User.findOne(newUser._id).select('-password -refreshToken');
        req.user = createdUser;
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, refreshToken} = generateAccessANDrefreshToken(newUser._id);
        return res.status(200)
        .cookie('accessToken',accessToken, options)
        .cookie('refreshToken',refreshToken, options)
        .json({
            message: 'Account created successfully',
            user: createdUser
        });
    }
    } catch (error) {
        next(error);
    }
}