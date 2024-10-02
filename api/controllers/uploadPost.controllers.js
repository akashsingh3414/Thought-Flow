import { Post } from '../models/posts.models.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const uploadPost = async (req, res, next) => {
  const { userId, content, title, category } = req.body;

  if (!userId || !title || !content || !category) {
    return res.status(400).json({ message: 'All fields are important' });
  }

  const user = await User.findById(userId);

  if (!(user)) {
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
    images: uploadedImages.length > 0 ? uploadedImages : null,
  });

  if (!newPost) {
    return res.status(500).json({ message: 'Some error while uploading post' });
  }

  return res.status(201).json({ message: 'Post Created Successfully', post: newPost });
};
