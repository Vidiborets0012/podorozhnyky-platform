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
