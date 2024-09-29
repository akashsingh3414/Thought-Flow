import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';

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
