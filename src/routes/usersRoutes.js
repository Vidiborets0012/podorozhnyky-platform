import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getUserByIdController,
  getUsersController,
  updateAvatarController,
} from '../controllers/usersController.js';
import { celebrate } from 'celebrate';
import {
  paginationQuerySchema,
  updateAvatarSchema,
  userIdParamSchema,
} from '../validations/userValidation.js';

const router = Router();

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

/**
 * ПРИВАТНИЙ ендпоінт для
 * ОТРИМАННЯ інформації про поточного користувача
 * GET /api/users/me
 */
router.get('/me', authenticate, (req, res) => {
  res.json(req.user);
});

/**
 * ПРИВАТНИЙ ендпоінт для
 * ОНОВЛЕННЯ аватару користувача
 * PATCH /api/users/me/avatar
 */
router.patch(
  '/me/avatar',
  authenticate,
  celebrate(updateAvatarSchema),
  updateAvatarController,
);

export default router;
