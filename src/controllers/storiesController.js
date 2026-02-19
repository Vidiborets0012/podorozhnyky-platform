import { Story } from '../models/story.js';

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
