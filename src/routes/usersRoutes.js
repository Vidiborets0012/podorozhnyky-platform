import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getUserByIdController,
  getUsersController,
} from '../controllers/usersController.js';
import { celebrate } from 'celebrate';
import {
  paginationQuerySchema,
  userIdParamSchema,
} from '../validations/userValidation.js';

const router = Router();

router.get('/me', authenticate, (req, res) => {
  res.json(req.user);
});

/**
 * ПУБЛІЧНИЙ ендпоінт для
 * ОТРИМАННЯ даних про користувачів (авторів) + пагінація
 */
router.get('/', celebrate(paginationQuerySchema), getUsersController);

/**
 * ПУБЛІЧНИЙ ендпоінт для
 * ОТРИМАННЯ даних про користувача за ID + дані користувача + список статей
 * GET /api/users/:userId
 */
router.get('/:userId', celebrate(userIdParamSchema), getUserByIdController);

export default router;
