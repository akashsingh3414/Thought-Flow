import { User } from "../models/user.models.js"
import bcrypt from 'bcrypt'
import { ApiError } from "../utils/ApiError.js"
import { generateAccessANDrefreshToken } from "./generate.controllers.js"

export const update = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        console.log(req)
        if (!user) {
            console.log('user does not exist')
            return res.status(404).json({ message: 'User not found' })
        }

        const password = req.body.oldPassword

        if(!password) {
            return res.status(400).json({message:"Password is required"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            throw new ApiError(400, 'Invalid Old Password', )
        }

        const newPassword = req.body.newPassword
        let newHashedPassword;
        if(newPassword) {
            newHashedPassword = bcrypt.hashSync(newPassword, 8)
        } else {
            newHashedPassword = user.password
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            user._id, 
            {
                userName: req.body.userName,
                fullName: req.body.fullName,
                password: newHashedPassword,
                emailID: req.body.emailID
            },
            { new: true }
        ).select('-password -refreshToken')

        const { accessToken, refreshToken } = await generateAccessANDrefreshToken(updatedUser._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        req.user = updatedUser;

        return res
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .status(200)
            .json({ user: updatedUser, message: 'User details updated successfully' })

    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message })
    }
}
