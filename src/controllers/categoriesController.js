import { Category } from '../models/category.js';

export const getCategoriesController = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.json({
    data: categories,
  });
};
