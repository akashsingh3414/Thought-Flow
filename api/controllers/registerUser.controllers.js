import express from 'express';
import {User} from '../models/user.models.js'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    const { userName, fullName, emailID, password } = req.body;
    
    if (!userName || !fullName || !emailID || !password || [userName, fullName, emailID, password].some((field) => String(field).trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
        $or: [{ userName }, { emailID }]
    })

    if(existingUser) {
        return res.status(400).json({message: "User Already exists"});
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        emailID,
        fullName,
        password
    })

    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!userCreated) {
        return res.status(500).json({message: "server side error while creating user"});
    }

    return res.status(200).json({ message: "User Registered Successfully" });
};
