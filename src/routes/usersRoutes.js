import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
// import { celebrate } from 'celebrate';
// import {
//   addSavedStoryController,
//   getMyStoriesController,
//   getSavedStoriesController,
//   removeSavedStoryController,
// } from '../controllers/usersController.js';
// import {
//   paginationQuerySchema,
//   storyIdParamSchema,
// } from '../validations/storyValidation.js';

const router = Router();

router.get('/me', authenticate, (req, res) => {
  res.json(req.user);
});

// POST /api/users/me/saved-stories/:storyId
// router.post(
//   '/me/saved-stories/:storyId',
//   authenticate,
//   celebrate(storyIdParamSchema),
//   addSavedStoryController,
// );

//DELETE /api/users/me/saved-stories/:storyId
// router.delete(
//   '/me/saved-stories/:storyId',
//   authenticate,
//   celebrate(storyIdParamSchema),
//   removeSavedStoryController,
// );

//GET /api/users/me/saved-stories + пагінація
// router.get(
//   '/me/saved-stories',
//   authenticate,
//   celebrate(paginationQuerySchema),
//   getSavedStoriesController,
// );

// Приватний ендпоінт для отримання власних історій автора + пагінація
// GET /api/users/me/stories;
// router.get(
//   '/me/stories',
//   authenticate,
//   celebrate(paginationQuerySchema),
//   getMyStoriesController,
// );

export default router;
