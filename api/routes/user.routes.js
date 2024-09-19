import { Router } from 'express';
import { register } from '../controllers/registerUser.controllers.js';
import { login } from '../controllers/loginUser.controllers.js';
import { verifyjwt } from '../middlewares/auth.middlewares.js';
const router = Router();

router.route('/test').get((req, res) => {
    res.json({ message: 'API is working' });
});

router.route('/register').post(register);
router.route('/login').post(login);

export default router;