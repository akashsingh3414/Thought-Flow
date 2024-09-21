import express from 'express';
import { User } from '../models/user.models.js';
import { generateAccessANDrefreshToken } from '../controllers/generate.controllers.js';

export const login = async (req, res) => {
    const { userName, emailID, password } = req.body;

    if (!userName || !emailID || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
        $or: [{ userName }, { emailID }]
    });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid Credentials" });
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
