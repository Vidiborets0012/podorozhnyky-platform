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

router.get('/', celebrate(getStoriesQuerySchema), getStoriesController);

//PRIVATE

// мої історії
router.get(
  '/my',
  authenticate,
  celebrate(paginationQuerySchema),
  getMyStoriesController,
);

// збережені історії
router.get(
  '/saved',
  authenticate,
  celebrate(paginationQuerySchema),
  getSavedStoriesController,
);

// зберегти історію
router.post(
  '/:storyId/save',
  authenticate,
  celebrate(storyIdParamSchema),
  addSavedStoryController,
);

// видалити із збережених
router.delete(
  '/:storyId/save',
  authenticate,
  celebrate(storyIdParamSchema),
  removeSavedStoryController,
);

// створити історію
router.post(
  '/',
  authenticate,
  celebrate(createStorySchema),
  createStoryController,
);

// редагувати
router.patch(
  '/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  celebrate(updateStorySchema),
  updateStoryController,
);

// видалити
router.delete(
  '/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  deleteStoryController,
);

export default router;
