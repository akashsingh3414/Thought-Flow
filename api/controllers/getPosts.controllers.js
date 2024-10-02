import { Post } from '../models/posts.models.js';

export const getPosts = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.find({ userId });

        if (!posts) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        return res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Server error while fetching posts.' });
    }
};
