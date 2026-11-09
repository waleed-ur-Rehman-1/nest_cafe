const express = require('express');
const Category = require('../models/Category');
const { protect, allow } = require('../middleware/auth');

const router = express.Router();
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

router.get('/', async (req, res, next) => {
  try { res.json(await Category.find({ isActive: true }).sort('displayOrder')); } catch (err) { next(err); }
});

router.post('/', protect, allow('admin'), async (req, res, next) => {
  try {
    const { name, image, displayOrder } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    res.status(201).json(await Category.create({ name, slug: slugify(name), image, displayOrder }));
  } catch (err) { next(err); }
});

router.put('/:id', protect, allow('admin'), async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (err) { next(err); }
});

router.delete('/:id', protect, allow('admin'), async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;