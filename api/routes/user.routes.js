import { Router } from 'express';

const router = Router();

router.route('/test').get((req,res) => {
    res.json({message: 'API is working'})
})

export default router;