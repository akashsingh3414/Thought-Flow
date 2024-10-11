import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        index: true,
    },
    images: {
        type: [String],
    },
    category: {
        type: String,
        default: 'uncategorized',
        lowercase: true,
    },
    slug: {
        type: String,
        required: true,
        index: true,
    }
},{timestamps: true});

export const Post = mongoose.model('Post', postSchema);