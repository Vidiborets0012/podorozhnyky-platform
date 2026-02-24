import createHttpError from 'http-errors';
import { Story } from '../models/story.js';
import { Category } from '../models/category.js';
import { User } from '../models/user.js';
import { isValidObjectId } from 'mongoose';

/**
 *  ПУБЛІЧНИЙ ендпоінт для
 * ОТРИМАННЯ історій + пагінація + фільтрація за категорією
 */
export const getStoriesController = async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};

  if (category) {
    filter.category = category;
  }
  //Тут ми створюємо динамічний об'єкт пошуку. Якщо категорія вказана в URL, ми додаємо її в умови пошуку для бази даних. Якщо ні — filter залишиться порожнім {} і база поверне всі історії.

  const [stories, total] = await Promise.all([
    Story.find(filter)
      .populate('category', 'name')
      .populate('ownerId', 'name avatarUrl')
      .sort({ createdAt: -1 }) //// Нові зверху
      .skip(skip)
      .limit(Number(limit)),
    Story.countDocuments(filter), //// Рахуємо скільки всього таких записів у БД
  ]);

  let savedIds = [];

  if (req.user?.savedStories) {
    savedIds = req.user.savedStories.map((id) => id.toString());
  }

  const storiesWithFlag = stories.map((story) => ({
    ...story.toObject(),
    isSaved: savedIds.includes(story._id.toString()),
  }));

  res.json({
    data: storiesWithFlag,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

//PRIVATE

/**
 * ПРИВАТНИЙ ендпоінт для
 * ОТРИМАННЯ власних історій користувача (автора) + пагінація
 */
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

/**
 * ПРИВАТНИЙ ендпоінт для
 * ОТРИМАННЯ збережених історій + пагінація
 */
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

/**
 * ПРИВАТНИЙ ендпоінт для
 * ДОДАВАННЯ статті до збережених статей користувача
 */
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
    {
      _id: userId,
      savedStories: { $ne: storyId }, // перевірка що ще не збережено
    },
    { $addToSet: { savedStories: storyId } },
    { new: true },
  );

  // якщо user !== null → реально додали
  if (user) {
    await Story.findByIdAndUpdate(storyId, {
      $inc: { favoriteCount: 1 },
    });
  }

  const updatedUser = await User.findById(userId).populate({
    path: 'savedStories',
    populate: [
      { path: 'ownerId', select: 'name avatarUrl' },
      { path: 'category', select: 'name' },
    ],
  });

  // res.status(200).json({ data: user });
  // res.status(200).json({
  //   data: user.savedStories,
  // });
  res.status(200).json({
    data: updatedUser.savedStories,
  });
};

/**
 * ПРИВАТНИЙ ендпоінт для
 * ВИДАЛЕННЯ статті зі збережених статей користувача
 */
export const removeSavedStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  const story = await Story.findById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  const user = await User.findByIdAndUpdate(
    {
      _id: userId,
      savedStories: storyId, // тільки якщо існує
    },
    { $pull: { savedStories: storyId } },
    { new: true },
  );

  if (user) {
    await Story.findByIdAndUpdate(storyId, {
      $inc: { favoriteCount: -1 },
    });
  }

  const updatedUser = await User.findById(userId).populate({
    path: 'savedStories',
    populate: [
      { path: 'ownerId', select: 'name avatarUrl' },
      { path: 'category', select: 'name' },
    ],
  });

  // res.status(200).json({
  //   data: user.savedStories,
  // });
  res.status(200).json({
    data: updatedUser.savedStories,
  });
};

/**
 * ПРИВАТНИЙ ендпоінт для
 * СТВОРЕННЯ історії
 */
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

/**
 * ПРИВАТНИЙ ендпоінт для
 * РЕДАГУВАННЯ історії
 */
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

/**
 * ПРИВАТНИЙ ендпоінт для
 * ВИДАЛЕННЯ історії
 */
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

//GET /api/stories/:storyId
export const getStoryByIdController = async (req, res) => {
  const { storyId } = req.params;

  if (!isValidObjectId(storyId)) {
    throw createHttpError(400, 'Invalid story id');
  }
  const story = await Story.findById(storyId)
    .populate('category', 'name') //Замість просто ID категорії підставляємо об'єкт з її назвою
    .populate('ownerId', 'name avatarUrl'); //"Оживляємо" автора — отримуємо його ім'я та фото

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  let isSaved = false; //за замовчуванням вважаємо, що не збережена

  // if (req.user) {
  //   const user = await User.findById(req.user._id).select('savedStories');
  //   isSaved = user.savedStories.some((id) => id.toString() === storyId);
  // }

  //Якщо користувач авторизований і у нього є масив збережених історій
  if (req.user?.savedStories) {
    isSaved = req.user.savedStories
      .map((id) => id.toString())
      .includes(storyId); //Перетворюємо всі ID з масиву (які в Mongo є об'єктами) у рядки та перевіряємо, чи є серед них ID поточної історії
  }

  const popularStories = await Story.find({
    _id: { $ne: storyId }, //Оператор "Not Equal". Шукаємо інші історії, крім тієї, яку ми зараз відкрили
  })
    .populate('category', 'name')
    .populate('ownerId', 'name avatarUrl')
    .sort({ favoriteCount: -1 }) //Сортуємо за популярністю (від найбільшої кількості лайків до найменшої)
    .limit(3); // База бере перші 3 документи з цієї черги, а решту (навіть якщо їх там ще 1000) просто ігнорує.

  res.status(200).json({
    data: story,
    isSaved,
    popularStories,
  });
};
