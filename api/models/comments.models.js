import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    commentMessage: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    }
},{timestamps: true})

export const Comment = mongoose.model('Comment', commentSchema)