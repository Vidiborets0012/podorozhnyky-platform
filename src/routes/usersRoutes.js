import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { celebrate } from 'celebrate';
import {
  addSavedStoryController,
  removeSavedStoryController,
} from '../controllers/usersController.js';
import { storyIdParamSchema } from '../validations/storyValidation.js';

const router = Router();

router.get('/me', authenticate, (req, res) => {
  res.json(req.user);
});

// POST /api/users/me/saved-stories/:storyId
router.post(
  '/me/saved-stories/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  addSavedStoryController,
);

//DELETE /api/users/me/saved-stories/:storyId
router.delete(
  '/me/saved-stories/:storyId',
  authenticate,
  celebrate(storyIdParamSchema),
  removeSavedStoryController,
);

export default router;
