import { Router } from 'express';
import { verifyjwt } from '../middlewares/auth.middlewares.js';
import { getUser, register, google, login, logout, updateUser, updateProfilePhoto, deleteUser, getUsers } from '../controllers/user.controllers.js';
import { uploadSingle } from '../middlewares/multer.middlewares.js';

const userRouter = Router();

userRouter.route('/test').get((req, res) => {
    res.json({ message: 'API is working' });
});

userRouter.route('/register').post(register);
userRouter.route('/signin').post(login);
userRouter.route('/logout').post(verifyjwt, logout);
userRouter.route('/getUser').get(getUser);
userRouter.route('/getUsers').get(verifyjwt, getUsers); 
userRouter.route('/google').post(google);
userRouter.route('/update').patch(verifyjwt, updateUser);
userRouter.route('/delete').delete(verifyjwt, deleteUser);
userRouter.route('/updateProfilePhoto').patch(verifyjwt, uploadSingle, updateProfilePhoto);

export default userRouter;
