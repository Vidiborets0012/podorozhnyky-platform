import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from '../utils/objectIdValidator.js';

/**
 * Пагінація (для списку користувачів)
 */
export const paginationQuerySchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(9),
  }),
};

/**
 * Параметр userId (GET /users/:userId)
 */
export const userIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: Joi.string().custom(objectIdValidator).required(),
  }),
};

/**
 * Оновлення аватару
 */
export const updateAvatarSchema = {
  [Segments.BODY]: Joi.object({
    avatarUrl: Joi.string().uri().required(),
  }),
};

/**
 * Оновлення даних користувача
 */
export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32).optional(),

    description: Joi.string().max(500).optional(),
  }).min(1),
};
