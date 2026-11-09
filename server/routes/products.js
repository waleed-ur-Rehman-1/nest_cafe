const express = require('express');
const Product = require('../models/Product');
const { protect, allow } = require('../middleware/auth');

const router = express.Router();
const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

router.get('/', async (req, res, next) => {
  try {
    const { category, search, featured, bestseller } = req.query;
    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (bestseller === 'true') filter.isBestseller = true;
    if (search) filter.name = { $regex: search, $options: 'i' };
    res.json(await Product.find(filter).populate('category', 'name slug').sort('name'));
  } catch (err) { next(err); }
});

router.get('/admin/all', protect, allow('admin'), async (req, res, next) => {
  try { res.json(await Product.find().populate('category', 'name').sort('-createdAt')); } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) { next(err); }
});

router.post('/', protect, allow('admin'), async (req, res, next) => {
  try {
    const body = { ...req.body };
    body.slug = `${slugify(body.name)}-${Date.now().toString().slice(-5)}`;
    res.status(201).json(await Product.create(body));
  } catch (err) { next(err); }
});

router.put('/:id', protect, allow('admin'), async (req, res, next) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) { next(err); }
});

router.delete('/:id', protect, allow('admin'), async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;