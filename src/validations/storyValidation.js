import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from '../utils/objectIdValidator.js';

export const getStoriesQuerySchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(9),
    category: Joi.string().custom(objectIdValidator).optional(),
  }),
};

export const storyIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    storyId: Joi.string().custom(objectIdValidator).required(),
  }),
};
