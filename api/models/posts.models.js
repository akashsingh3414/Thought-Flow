import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        minLength: 20,
    },
    title: {
        type: String,
        required: true,
        unique: true,
        maxLength: 200,
    },
    images: {
        type: [String],
    },
    category: {
        type: String,
        default: 'uncategorized',
        lowercase: true,
    }
},{timestamps: true})

export const Post = mongoose.model('Post', postSchema)