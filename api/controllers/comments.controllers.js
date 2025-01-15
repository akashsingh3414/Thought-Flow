import { Comment } from "../models/comments.models.js";
import { User } from "../models/user.models.js";
import { Post } from "../models/posts.models.js";

export const createComment = async (req, res) => {
    const { comment, postId } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found or not logged in' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!comment || comment.trim().length === 0) {
            return res.status(403).json({ message: 'Empty comment cannot be added' });
        }

        const addComment = await Comment.create({
            userId: req.user._id,
            userName: req.user.userName,
            postId,
            commentMessage: comment
        });

        if (!addComment) {
            return res.status(500).json({ message: 'Some error occurred while adding comment' });
        }

        return res.status(200).json({ message: 'Comment added successfully', comment: addComment });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating comment', error });
    }
};

export const getComments = async (req, res) => {
    const { postId } = req.query;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comments = await Comment.find({ postId });
        return res.status(200).json({ comments });
    } catch (error) {
        return res.status(500).json({ message: 'Some error occurred while fetching comments', error });
    }
};

export const updateComment = async (req, res) => {
    const { postId } = req.query;
    const { newComment, commentId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (!newComment || newComment.trim().length === 0) {
            return res.status(404).json({ message: 'Cannot update with empty comment' });
        }

        const updateComment = await Comment.findByIdAndUpdate(
            commentId,
            { commentMessage: newComment },
            { new: true }
        );

        return res.status(200).json({ message: 'Comment updated successfully', comment: updateComment });
    } catch (error) {
        return res.status(500).json({ message: 'Some error occurred while updating comments', error });
    }
};

export const deleteComment = async (req, res) => {
    const { postId } = req.query;
    const { commentId } = req.query;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Some error occurred while deleting comments', error });
    }
};
