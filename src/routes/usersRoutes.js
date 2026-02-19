import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/current', authenticate, (req, res) => {
  res.json(req.user);
});

export default router;
