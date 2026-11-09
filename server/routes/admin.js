const express = require('express');
const bcrypt = require('bcryptjs');
const Order = require('../models/Order');
const User = require('../models/User');
const Promotion = require('../models/Promotion');
const { protect, allow } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/dashboard', allow('admin'), async (req, res, next) => {
  try {
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const [totalOrders, todaysOrders, revAgg, todayRevAgg, pending, preparing, completed, cancelled, customers, bestSellers] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, t: { $sum: '$totalAmount' } } }]),
      Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfDay } } }, { $group: { _id: null, t: { $sum: '$totalAmount' } } }]),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'preparing' }),
      Order.countDocuments({ orderStatus: { $in: ['delivered', 'collected'] } }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.name', qty: { $sum: '$items.quantity' } } },
        { $sort: { qty: -1 } }, { $limit: 5 }
      ])
    ]);
    res.json({
      totalOrders, todaysOrders,
      totalRevenue: revAgg[0]?.t || 0,
      todayRevenue: todayRevAgg[0]?.t || 0,
      pending, preparing, completed, cancelled, customers,
      bestSellers: bestSellers.map((b) => ({ name: b._id, qty: b.qty }))
    });
  } catch (err) { next(err); }
});

router.get('/orders', allow('admin', 'kitchen', 'delivery', 'pickup'), async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.orderStatus = req.query.status;
    if (req.query.type) filter.orderType = req.query.type;
    if (req.user.role === 'delivery') filter.assignedTo = req.user._id;
    res.json(await Order.find(filter).populate('customer', 'name email phone').sort('-createdAt').limit(300));
  } catch (err) { next(err); }
});

router.patch('/orders/:id/status', allow('admin', 'kitchen', 'delivery', 'pickup'), async (req, res, next) => {
  try {
    const allowed = ['accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'collected', 'rejected', 'cancelled'];
    const { status } = req.body;
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderType === 'delivery' && status === 'delivered' && order.orderStatus !== 'dispatched') {
      return res.status(400).json({ message: 'Order must be dispatched before it can be delivered' });
    }
    order.orderStatus = status;
    if (['delivered', 'collected'].includes(status) && ['cod', 'pickup_cash'].includes(order.paymentMethod)) {
      order.paymentStatus = 'paid';
    }
    order.statusHistory.push({ status });
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
});

router.patch('/orders/:id/assign', allow('admin'), async (req, res, next) => {
  try {
    const o = await Order.findByIdAndUpdate(req.params.id, { assignedTo: req.body.staffId }, { new: true });
    if (!o) return res.status(404).json({ message: 'Order not found' });
    res.json(o);
  } catch (err) { next(err); }
});

router.patch('/orders/:id/location', allow('admin', 'delivery'), async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') return res.status(400).json({ message: 'lat/lng required' });
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'Order not found' });
    o.riderLocation = { lat, lng, updatedAt: new Date() };
    await o.save();
    res.json({ riderLocation: o.riderLocation });
  } catch (err) { next(err); }
});

router.get('/customers', allow('admin'), async (req, res, next) => {
  try { res.json(await User.find({ role: 'customer' }).select('-password').sort('-createdAt')); } catch (err) { next(err); }
});

router.patch('/customers/:id/toggle', allow('admin'), async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    u.isActive = !u.isActive;
    await u.save();
    res.json({ _id: u._id, isActive: u.isActive });
  } catch (err) { next(err); }
});

router.get('/staff', allow('admin'), async (req, res, next) => {
  try { res.json(await User.find({ role: { $ne: 'customer' } }).select('-password')); } catch (err) { next(err); }
});

router.post('/staff', allow('admin'), async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, phone, password: hash, role });
    res.status(201).json({ _id: u._id, name: u.name, email: u.email, role: u.role });
  } catch (err) { next(err); }
});

router.get('/promotions', allow('admin'), async (req, res, next) => {
  try { res.json(await Promotion.find().sort('-createdAt')); } catch (err) { next(err); }
});

router.post('/promotions', allow('admin'), async (req, res, next) => {
  try {
    const p = await Promotion.create({ ...req.body, code: String(req.body.code || '').toUpperCase() });
    res.status(201).json(p);
  } catch (err) { next(err); }
});

router.delete('/promotions/:id', allow('admin'), async (req, res, next) => {
  try { await Promotion.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (err) { next(err); }
});

module.exports = router;