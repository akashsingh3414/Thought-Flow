import bcrypt from 'bcrypt';
import { User } from "../models/user.models.js";

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({message:"Password is required"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({message:"Invalid Password"});
        }

        const deletedUser = await User.findByIdAndDelete(user._id);
        if (!deletedUser) {
            return res.status(500).json({message:"Could not delete user. Please try again"})
        }
        return res.status(200).json({message:"User deleted successfully"});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Some error occured while deleting the user. Please Try once again"});
    }
};
