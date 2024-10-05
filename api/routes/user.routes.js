import { Router } from 'express';
import { verifyjwt } from '../middlewares/auth.middlewares.js';
import { getUser, register, google, login, logout, updateUser, updateProfilePhoto, deleteUser } from '../controllers/user.controllers.js';
import { uploadSingle } from '../middlewares/multer.middlewares.js';

const userRouter = Router();

userRouter.route('/test').get((req, res) => {
    res.json({ message: 'API is working' });
});

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').post(verifyjwt, logout);
userRouter.route('/getUser').get(verifyjwt, getUser); 
userRouter.route('/google').post(google);
userRouter.route('/update').patch(verifyjwt, updateUser);
userRouter.route('/delete').delete(verifyjwt, deleteUser);
userRouter.route('/updateProfilePhoto').patch(verifyjwt, uploadSingle, updateProfilePhoto);

export default userRouter;
