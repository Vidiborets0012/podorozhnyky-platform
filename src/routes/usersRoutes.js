import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { celebrate } from 'celebrate';
import { addSavedStoryController } from '../controllers/usersController.js';
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

export default router;
