import { Router } from 'express';
import { celebrate } from 'celebrate';

import { getStoriesController } from '../controllers/storiesController.js';
import { getStoriesQuerySchema } from '../validations/storyValidation.js';

const router = Router();

router.get('/', celebrate(getStoriesQuerySchema), getStoriesController);

export default router;
