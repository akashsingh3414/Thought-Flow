import { Router } from 'express';
import { register } from '../controllers/registerUser.controllers.js';
import { google, login } from '../controllers/loginUser.controllers.js';
import { verifyjwt } from '../middlewares/auth.middlewares.js';
import { logout } from '../controllers/logoutUser.controllers.js';
import { getUser } from '../controllers/getUserDetails.controllers.js';
import { update } from '../controllers/updateUser.controllers.js';
import { deleteUser } from '../controllers/deleteUser.controllers.js';
import { uploadMany, uploadSingle } from '../middlewares/multer.middlewares.js';
import { updateProfilePhoto } from '../controllers/updateUserPhoto.controllers.js';
import { uploadPost } from '../controllers/uploadPost.controllers.js';
import { getPosts } from '../controllers/getPosts.controllers.js';

const router = Router();

router.route('/test').get((req, res) => {
    res.json({ message: 'API is working' });
});

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(verifyjwt, logout);
router.route('/getUser').get(verifyjwt, getUser); 
router.route('/google').post(google);
router.route('/update').patch(verifyjwt, update);
router.route('/updateProfilePhoto').patch(verifyjwt, uploadSingle, updateProfilePhoto);
router.route('/delete').delete(verifyjwt, deleteUser);
router.route('/posts').post(verifyjwt, uploadMany, uploadPost);
router.route('/getPosts/:userId').get(getPosts);

export default router;
