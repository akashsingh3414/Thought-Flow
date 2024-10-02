import { Post } from '../models/posts.models.js';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.aggregate([
            { $sample: { size: 15 } }
        ]);

        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found." });
        }

        return res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Server error while fetching posts.' });
    }
};
