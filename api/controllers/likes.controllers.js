import { Post } from "../models/posts.models.js";
import { Like } from '../models/likes.models.js';
import { User } from "../models/user.models.js";

export const updateLike = async (req, res) => {
    const { postId } = req.body;

    try {
        console.log('User ID:', req.user._id);
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const existingLike = await Like.findOne({
            userId: req.user._id,
            postId
        });

        if (existingLike) {
            console.log('Existing like found, removing...');
            await Like.deleteOne({ userId: req.user._id, postId });
            return res.status(200).json({ message: 'Like removed successfully' });
        }

        console.log('No existing like found, adding...');
        await Like.create({
            postId,
            userId: req.user._id
        });
        return res.status(200).json({ message: 'Like added successfully' });

    } catch (error) {
        console.error('Error updating like:', error);
        return res.status(500).json({ message: 'Some error occurred while adding likes' });
    }
};



export const getLikes = async (req, res) => {
    const { postId } = req.query;
    try {
        if (!postId) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likes = await Like.find({ postId });
        let hasLiked;
        if(req.user && req.user?._id) {
            hasLiked = likes.some(like => like.userId.toString() === req.user?._id.toString());
        }

        return res.status(200).json({
            message: 'Likes fetched successfully',
            likeCount: likes.length,
            hasLiked
        });

    } catch (error) {
        console.error('Error fetching likes:', error);
        return res.status(500).json({ message: 'Some error occurred while fetching likes' });
    }
};
