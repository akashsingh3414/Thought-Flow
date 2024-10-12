import { Post } from '../models/posts.models.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const createPost = async (req, res, next) => {
  try {
    const { userId, content, title, category } = req.body;

    if (!userId || !title || !content || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g,'');

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const images = req.files ? req.files : [];

    const uploadedImages = [];
    for (const image of images) {
      const uploadedImage = await uploadOnCloudinary(image.path);
      uploadedImages.push(uploadedImage.url);
    }

    const newPost = await Post.create({
      userId,
      content,
      title,
      category,
      authorName: user.fullName,
      slug,
      images: uploadedImages.length > 0 ? uploadedImages : null,
    });

    if (!newPost) {
      return res.status(500).json({ message: 'Error creating post' });
    }

    return res.status(201).json({ message: 'Post Created Successfully', post: newPost });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 10, 100));
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const queryFilters = {};

    if (req.query.userId) {
      queryFilters.userId = req.query.userId;
    }
    if (req.query.category && req.query.category !== 'none') {
      queryFilters.category = req.query.category;
    }
    if (req.query.slug) {
      queryFilters.slug = req.query.slug;
    }
    if (req.query.postId) {
      queryFilters._id = req.query.postId;
    }
    if (req.query.searchTerm) {
      queryFilters.$or = [
        { title: { $regex: req.query.searchTerm, $options: 'i' } },
        { content: { $regex: req.query.searchTerm, $options: 'i' } },
      ];
    }

    const posts = await Post.find(queryFilters)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(queryFilters);

    return res.status(200).json({
      posts,
      totalPosts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { postOwnerId, content, title, category, postId } = req.body;
    const requestedByUser = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }

    if (requestedByUser.toString() !== postOwnerId) {
      return res.status(403).json({ message: 'Operation not allowed' });
    }

    const images = req.files ? req.files : [];
    const uploadedImages = [];

    for (const image of images) {
      try {
        const uploadedImage = await uploadOnCloudinary(image.path);
        uploadedImages.push(uploadedImage.url);
      } catch (error) {
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }

    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        content,
        title,
        category,
        slug,
        images: uploadedImages,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(500).json({ message: 'Error updating post' });
    }

    return res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const postOwnerId = req.params.postOwnerId;
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (!user.isAdmin && postOwnerId !== userId) {
    return res.status(403).json({ message: 'You are not allowed to delete this post' });
  }

  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) {
    return res.status(400).json({ message: 'Error occurred while deleting the post' });
  }

  return res.status(200).json({ message: 'Post deleted successfully' });
};
