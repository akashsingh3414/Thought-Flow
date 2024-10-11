import { Router } from 'express';
import { verifyjwt } from '../middlewares/auth.middlewares.js';
import { createComment, getComment, updateComment, deleteComment } from '../controllers/comments.controllers.js';
const commentRouter = Router();

commentRouter.post('/createComment', verifyjwt, createComment);
commentRouter.get('/getComment', getComment);
commentRouter.delete('/deleteComment', verifyjwt, deleteComment);
commentRouter.patch('/updateComment', verifyjwt, updateComment);

export default commentRouter;