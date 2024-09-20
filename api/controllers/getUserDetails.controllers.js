import { User } from "../models/user.models.js"

export const getUser = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -refreshToken')

    if(!user) {
        return res.status(400).json({message: "No user logged in"})
    }
    return res.status(200).json({
        message: "Details fetched successfully",
        user: user
    })
}