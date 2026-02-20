import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createStoryController,
  getStoriesController,
  updateStoryController,
} from '../controllers/storiesController.js';
import {
  createStorySchema,
  getStoriesQuerySchema,
  storyIdParamSchema,
  updateStorySchema,
} from '../validations/storyValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', celebrate(getStoriesQuerySchema), getStoriesController);

router.post(
  '/',
  authenticate,
  celebrate(createStorySchema),
  createStoryController,
);

router.patch(
  '/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  celebrate(updateStorySchema),
  updateStoryController,
);

export default router;
