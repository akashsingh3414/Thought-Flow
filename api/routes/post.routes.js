import { Router } from 'express';
import { verifyjwt } from '../middlewares/auth.middlewares.js';
import { createPost, getPosts, deletePost, updatePost } from '../controllers/post.controllers.js';
import { uploadMany } from '../middlewares/multer.middlewares.js';

const postRouter = Router();

postRouter.post('/createPost', verifyjwt, uploadMany, createPost);
postRouter.get('/getPosts', getPosts);
postRouter.delete('/deletePost/:postId/:postOwnerId/:userId', verifyjwt, deletePost);
postRouter.patch('/updatePost', verifyjwt, uploadMany, updatePost);

export default postRouter;