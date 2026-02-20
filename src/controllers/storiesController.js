import createHttpError from 'http-errors';
import { Story } from '../models/story.js';
import { Category } from '../models/category.js';
import { User } from '../models/user.js';

export const getStoriesController = async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};

  if (category) {
    filter.category = category;
  }

  const [stories, total] = await Promise.all([
    Story.find(filter)
      .populate('category', 'name')
      .populate('ownerId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Story.countDocuments(filter),
  ]);

  res.json({
    data: stories,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

//PRIVATE

// мої історії
export const getMyStoriesController = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const userId = req.user._id;

  const skip = (Number(page) - 1) * Number(limit);

  const filter = { ownerId: userId };

  const [stories, total] = await Promise.all([
    Story.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    Story.countDocuments(filter),
  ]);

  res.status(200).json({
    data: stories,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

// збережені історії
export const getSavedStoriesController = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const userId = req.user._id;

  const user = await User.findById(userId);

  const total = user.savedStories.length;

  const skip = (Number(page) - 1) * Number(limit);

  const stories = await Story.find({
    _id: { $in: user.savedStories },
  })
    .populate('ownerId', 'name avatarUrl')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    data: stories,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

// зберегти історію
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

// видалити із збережених
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

// створити історію
export const createStoryController = async (req, res) => {
  const { img, title, article, category, date } = req.body;
  const ownerId = req.user._id;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw createHttpError(404, 'Category not found');
  }

  const story = await Story.create({
    img,
    title,
    article,
    category,
    ownerId,
    date,
  });

  // Інкрементуємо кількість статей автора
  await User.findByIdAndUpdate(ownerId, {
    $inc: { articlesAmount: 1 },
  });

  const populatedStory = await Story.findById(story._id)
    .populate('category', 'name')
    .populate('ownerId', 'name avatarUrl');

  res.status(201).json({
    data: populatedStory,
  });
};

// редагувати
export const updateStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;
  const updateData = req.body;

  const story = await Story.findById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  // Перевірка власника
  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'You are not allowed to edit this story');
  }

  // Якщо оновлюється категорія — перевірити її
  if (updateData.category) {
    const categoryExists = await Category.findById(updateData.category);
    if (!categoryExists) {
      throw createHttpError(404, 'Category not found');
    }
  }

  const updatedStory = await Story.findByIdAndUpdate(storyId, updateData, {
    new: true,
  })
    .populate('category', 'name')
    .populate('ownerId', 'name avatarUrl');

  res.status(200).json({
    data: updatedStory,
  });
};

// видалити
export const deleteStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  const story = await Story.findById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  // Перевірка власника
  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'You are not allowed to delete this story');
  }

  // Видаляємо історію
  await Story.findByIdAndDelete(storyId);

  // Декремент кількості статей автора
  await User.findByIdAndUpdate(userId, {
    $inc: { articlesAmount: -1 },
  });

  // Видаляємо storyId зі savedStories всіх користувачів
  await User.updateMany(
    { savedStories: storyId },
    { $pull: { savedStories: storyId } },
  );

  res.status(204).send();
};
