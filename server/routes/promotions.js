const express = require('express');
const Promotion = require('../models/Promotion');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await Promotion.find({ isActive: true }).select('code description type value minOrder expiresAt'));
  } catch (err) { next(err); }
});

router.post('/validate', protect, async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const promo = await Promotion.findOne({ code: (code || '').toUpperCase(), isActive: true });
    if (!promo) return res.status(404).json({ message: 'Coupon not found' });
    if (promo.expiresAt && promo.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' });
    if (subtotal < (promo.minOrder || 0)) return res.status(400).json({ message: `Minimum order Rs. ${promo.minOrder} required` });
    let discount = 0;
    if (promo.type === 'percent') discount = Math.min((subtotal * promo.value) / 100, promo.maxDiscount || Infinity);
    else if (promo.type === 'fixed') discount = Math.min(promo.value, subtotal);
    else if (promo.type === 'free_delivery') discount = 150;
    res.json({ code: promo.code, type: promo.type, discount });
  } catch (err) { next(err); }
});

module.exports = router;