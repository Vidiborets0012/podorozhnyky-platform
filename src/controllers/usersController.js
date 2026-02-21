import { User } from '../models/user.js';
// import { Story } from '../models/story.js';
// import createHttpError from 'http-errors';

/**

 * ОТРИМАННЯ даних про користувачів (авторів) + пагінація
 */
export const getUsersController = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const filter = { articlesAmount: { $gt: 0 } }; // тільки автори

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('name avatarUrl articlesAmount')
      .sort({ articlesAmount: -1 }) //сортування авторів по кількості статей
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json({
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};
