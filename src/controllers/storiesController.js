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
