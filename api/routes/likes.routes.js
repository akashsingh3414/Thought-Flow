import { Router } from 'express';
import { verifyjwt } from '../middlewares/auth.middlewares.js';
import { getLikes, updateLike } from '../controllers/likes.controllers.js';
const likesRouter = Router();

likesRouter.post('/updateLike', verifyjwt, updateLike);
likesRouter.get('/getLikes', getLikes);

export default likesRouter;