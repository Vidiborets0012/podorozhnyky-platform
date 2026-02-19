import { Story } from '../models/story.js';

export const getStoriesController = async (req, res) => {
  const { page = 1, perPage = 10, category } = req.query;

  const limit = Number(perPage);
  const skip = (Number(page) - 1) * limit;

  const filter = {};

  if (category) {
    filter.category = category;
  }

  const [stories, total] = await Promise.all([
    Story.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Story.countDocuments(filter),
  ]);

  res.json({
    data: stories,
    pagination: {
      page: Number(page),
      perPage: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};
