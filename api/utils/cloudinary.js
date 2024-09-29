import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './ApiError.js';
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
            throw new ApiError(400, 'Invalid file path provided');
        }

        if (!fs.existsSync(localFilePath)) {
            throw new ApiError(400, 'File does not exist at the specified path');
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        return { url: response.secure_url };

    } catch (error) {

        throw new ApiError(500, 'Something went wrong while uploading to Cloudinary: ' + error.message);
    } finally {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
}

export { uploadOnCloudinary };
