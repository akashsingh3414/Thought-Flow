import jwt from 'jsonwebtoken';
import { User } from "../models/user.models.js";

export const generateAccessANDrefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { status: 404, message: "User not found" };
        }

        // Generate access token
        const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        // Generate refresh token
        const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        return { status: 500, message: 'Error generating tokens' };
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({ message: "Unauthorized request" });
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({ message: "Refresh token is expired or invalid" });
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessANDrefreshToken(user._id);

        if (!accessToken || !newRefreshToken) {
            return res.status(500).json({ message: "Error generating tokens" });
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, { ...options, maxAge: 86400000 }) // Access token valid for 7 hours
            .cookie("refreshToken", newRefreshToken, { ...options, maxAge: 864000000 }) // Refresh token valid for 7 days
            .json({ message: "Access token refreshed", accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};
