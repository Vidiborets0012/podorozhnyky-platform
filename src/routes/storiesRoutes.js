import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  addSavedStoryController,
  createStoryController,
  deleteStoryController,
  getMyStoriesController,
  getSavedStoriesController,
  getStoriesController,
  removeSavedStoryController,
  updateStoryController,
} from '../controllers/storiesController.js';
import {
  createStorySchema,
  getStoriesQuerySchema,
  paginationQuerySchema,
  storyIdParamSchema,
  updateStorySchema,
} from '../validations/storyValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// PUBLIC

/**
 * СТВОРИТИ ПУБЛІЧНИЙ ендпоінт для
 * ОТРИМАННЯ історій + пагінація + фільтрація за категорією
 */
router.get('/', celebrate(getStoriesQuerySchema), getStoriesController);

//PRIVATE

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ОТРИМАННЯ власних історій користувача (автора) + пагінація
 */
router.get(
  '/my',
  authenticate,
  celebrate(paginationQuerySchema),
  getMyStoriesController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ОТРИМАННЯ збережених історій + пагінація
 */
router.get(
  '/saved',
  authenticate,
  celebrate(paginationQuerySchema),
  getSavedStoriesController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ДОДАВАННЯ статті до збережених статей користувача
 */
router.post(
  '/:storyId/save',
  authenticate,
  celebrate(storyIdParamSchema),
  addSavedStoryController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ВИДАЛЕННЯ статті зі збережених статей користувача
 */
router.delete(
  '/:storyId/save',
  authenticate,
  celebrate(storyIdParamSchema),
  removeSavedStoryController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * СТВОРЕННЯ історії
 */
router.post(
  '/',
  authenticate,
  celebrate(createStorySchema),
  createStoryController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * РЕДАГУВАННЯ історії
 */
router.patch(
  '/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  celebrate(updateStorySchema),
  updateStoryController,
);

/**
 * СТВОРИТИ ПРИВАТНИЙ ендпоінт для
 * ВИДАЛЕННЯ історії
 */
router.delete(
  '/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  deleteStoryController,
);

export default router;
