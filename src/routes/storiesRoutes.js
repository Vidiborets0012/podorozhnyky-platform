import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createStoryController,
  getStoriesController,
} from '../controllers/storiesController.js';
import {
  createStorySchema,
  getStoriesQuerySchema,
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

export default router;
