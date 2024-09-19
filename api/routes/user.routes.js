import { Router } from 'express';
import { register } from '../controllers/registerUser.controllers.js';
const router = Router();

router.route('/test').get((req, res) => {
    res.json({ message: 'API is working' });
});

router.route('/register').post(register);

export default router;