import {User} from '../models/user.models.js'

export const register = async (req, res) => {
    const { userName, fullName, emailID, password } = req.body;
    
    if (!userName || !fullName || !emailID || !password || [userName, fullName, emailID, password].some((field) => String(field).trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
        $or: [{ userName }, { emailID }]
    }).select('-password -refreshToken')

    if(existingUser) {
        return res.status(400).json({message: "User Already exists", user: existingUser});
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

    return res.status(200).json({ message: "User Registered Successfully", user: userCreated});
};
