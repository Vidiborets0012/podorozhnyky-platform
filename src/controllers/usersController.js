import { User } from '../models/user.js';
import { Story } from '../models/story.js';
import createHttpError from 'http-errors';

export const addSavedStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  const story = await Story.findById(storyId);

  // Перевіряємо, що історія існує
  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  // Додаємо до savedStories без дублікатів
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedStories: storyId } },
    { new: true },
  ).populate({
    path: 'savedStories',
    populate: [
      { path: 'ownerId', select: 'name avatarUrl' },
      { path: 'category', select: 'name' },
    ],
  });

  // res.status(200).json({ data: user });
  res.status(200).json({
    data: user.savedStories,
  });
};

export const removeSavedStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  const story = await Story.findById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedStories: storyId } },
    { new: true },
  ).populate({
    path: 'savedStories',
    populate: [
      { path: 'ownerId', select: 'name avatarUrl' },
      { path: 'category', select: 'name' },
    ],
  });

  res.status(200).json({
    data: user.savedStories,
  });
};
