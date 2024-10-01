import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath || typeof localFilePath !== 'string') {
            return res.status(400)
            .json({message: 'Invalid File Path Provided'})
        }

        if (!fs.existsSync(localFilePath)) {
            return res.status(400)
            .json({message: 'File Does not exist'})        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        return { url: response.secure_url };

    } catch (error) {
        return res.status(400)
            .json({message: 'Something went wrong while uploading on Cloudinary' + error.message})
    } finally {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
}

export { uploadOnCloudinary };
