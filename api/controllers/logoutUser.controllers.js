import { User } from "../models/user.models.js";

export const logout = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.body._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);

    return res.status(200).json({
        message: "User logged out"
    });
};
