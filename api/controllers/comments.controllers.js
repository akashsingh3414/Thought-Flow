import { Comment } from "../models/comments.models";
import { User } from "../models/user.models";
import { Post } from "../models/posts.models";

export const createComment = async (req, res) => {
    const {comment, postId} = req.body;

    const user = await User.findById(req.user._id);

    if(!user) {
        return res.status(404)
        .json({message: 'User not found or not logged in'})
    }

    const post = await Post.findById(postId);

    if(!post) {
        return res.status(404)
        .json({message: 'Post not found'})
    }

    if(!comment || comment.trim().length === 0) {
        return res.status(403)
        .json({message: 'Empty comment can not be added'})
    }

    const addComment = await Comment.create(
        {
            userId: req.user._id,
            postId,
            commentMessage: comment
        }
    )

    if(!addComment) {
        return res.status(500)
        .json({message: 'Some error occured while adding comment'})
    }

    return res.status(200)
    .json({message: 'Comment added successfully', comment: addComment})
}

export const getComment = async (req, res) => {
    const { postId } = req.query;
    try {
        const post = await Post.findById(postId)
        if(!post) {
            return res.status(404)
            .json({message: 'Post not found'});
        }
        const comments = await Comment.find({
            postId
        })

        return res.status(200)
        .json({comments})
        
    } catch (error) {
        return res.status(500)
        .json({message: 'Some error occured while fetching comments', error: error})
    }
}

export const updateComment = async (req, res) => {
    const { postId } = req.query;
    const { comment, commentId } = req.body;
    try {
        const post = await Post.findById(postId)
        if(!post) {
            return res.status(404)
            .json({message: 'Post not found'});
        }

        const existingComment = await Comment.findById(commentId)

        if(!existingComment) {
            return res.status(404)
            .json({message: 'Comment not found'})
        }

        const updateComment = await Comment.findByIdAndUpdate(
            commentId,
            {commentMessage: comment},
            {new: true}
        )

        return res.status(200)
        .json({message: 'Comment updated successfully', updateComment})
        
    } catch (error) {
        return res.status(500)
        .json({message: 'Some error occured while updating comments', error: error})
    }
}

export const deleteComment = async (req, res) => {
    const { postId } = req.query;
    const { commentId } = req.body;
    try {
        const post = await Post.findById(postId)
        if(!post) {
            return res.status(404)
            .json({message: 'Post not found'});
        }

        const existingComment = await Comment.findById(commentId)

        if(!existingComment) {
            return res.status(404)
            .json({message: 'Comment not found'})
        }

        await Comment.findByIdAndDelete(
            commentId,
        )

        return res.status(200)
        .json({message: 'Comment deleted successfully'})
        
    } catch (error) {
        return res.status(500)
        .json({message: 'Some error occured while deleting comments', error: error})
    }
}