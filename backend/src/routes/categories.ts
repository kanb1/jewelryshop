import express from 'express';
import Category from '../models/Category';

const router = express.Router();

// GET /api/categories - Retrieve all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories', details: err });
  }
});

// POST /api/categories - Add a new category
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category', details: err });
  }
});

// PUT
router.put('/:id', async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      res.status(200).json({
        success: true,
        message: `Category updated successfully to ${name}`,
        data: updatedCategory,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update the category', details: err });
    }
  });
  

export default router;
