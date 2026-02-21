import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getUsersController } from '../controllers/usersController.js';
import { celebrate } from 'celebrate';
import { paginationQuerySchema } from '../validations/userValidation.js';

const router = Router();

router.get('/me', authenticate, (req, res) => {
  res.json(req.user);
});

/**
 * ПУБЛІЧНИЙ ендпоінт для
 * ОТРИМАННЯ даних про користувачів (авторів) + пагінація
 */
router.get('/', celebrate(paginationQuerySchema), getUsersController);

export default router;
