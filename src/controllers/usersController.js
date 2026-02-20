// import { User } from '../models/user.js';
// import { Story } from '../models/story.js';
// import createHttpError from 'http-errors';

// export const addSavedStoryController = async (req, res) => {
//   const { storyId } = req.params;
//   const userId = req.user._id;

//   const story = await Story.findById(storyId);

//   // Перевіряємо, що історія існує
//   if (!story) {
//     throw createHttpError(404, 'Story not found');
//   }

//   // Додаємо до savedStories без дублікатів
//   const user = await User.findByIdAndUpdate(
//     userId,
//     { $addToSet: { savedStories: storyId } },
//     { new: true },
//   ).populate({
//     path: 'savedStories',
//     populate: [
//       { path: 'ownerId', select: 'name avatarUrl' },
//       { path: 'category', select: 'name' },
//     ],
//   });

//   // res.status(200).json({ data: user });
//   res.status(200).json({
//     data: user.savedStories,
//   });
// };

// export const removeSavedStoryController = async (req, res) => {
//   const { storyId } = req.params;
//   const userId = req.user._id;

//   const story = await Story.findById(storyId);

//   if (!story) {
//     throw createHttpError(404, 'Story not found');
//   }

//   const user = await User.findByIdAndUpdate(
//     userId,
//     { $pull: { savedStories: storyId } },
//     { new: true },
//   ).populate({
//     path: 'savedStories',
//     populate: [
//       { path: 'ownerId', select: 'name avatarUrl' },
//       { path: 'category', select: 'name' },
//     ],
//   });

//   res.status(200).json({
//     data: user.savedStories,
//   });
// };

// export const getSavedStoriesController = async (req, res) => {
//   const { page = 1, limit = 9 } = req.query;
//   const userId = req.user._id;

//   const user = await User.findById(userId);

//   const total = user.savedStories.length;

//   const skip = (Number(page) - 1) * Number(limit);

//   const stories = await Story.find({
//     _id: { $in: user.savedStories },
//   })
//     .populate('ownerId', 'name avatarUrl')
//     .populate('category', 'name')
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(Number(limit));

//   res.status(200).json({
//     data: stories,
//     pagination: {
//       page: Number(page),
//       limit: Number(limit),
//       total,
//       totalPages: Math.ceil(total / limit),
//     },
//   });
// };

// export const getMyStoriesController = async (req, res) => {
//   const { page = 1, limit = 9 } = req.query;
//   const userId = req.user._id;

//   const skip = (Number(page) - 1) * Number(limit);

//   const filter = { ownerId: userId };

//   const [stories, total] = await Promise.all([
//     Story.find(filter)
//       .populate('category', 'name')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit)),

//     Story.countDocuments(filter),
//   ]);

//   res.status(200).json({
//     data: stories,
//     pagination: {
//       page: Number(page),
//       limit: Number(limit),
//       total,
//       totalPages: Math.ceil(total / limit),
//     },
//   });
// };
