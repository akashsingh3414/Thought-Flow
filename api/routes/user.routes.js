import { Router } from 'express';
import { register } from '../controllers/registerUser.controllers.js';
import { google, login } from '../controllers/loginUser.controllers.js';
import { verifyjwt } from '../middlewares/auth.middlewares.js';
import { logout } from '../controllers/logoutUser.controllers.js';
import { getUser } from '../controllers/getUserDetails.controllers.js';
import { update } from '../controllers/updateUser.controllers.js';

const router = Router();

router.route('/test').get((req, res) => {
    res.json({ message: 'API is working' });
});

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(verifyjwt,logout);
router.route('/getUser').get(verifyjwt,getUser); 
router.route('/google').post(google);
router.route('/update').patch(verifyjwt, update);

export default router;