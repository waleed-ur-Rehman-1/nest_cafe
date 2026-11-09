const express = require('express');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Simulated gateway: returns a fake transaction reference.
router.post('/initialize', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });
    if (order.paymentStatus === 'paid') return res.status(400).json({ message: 'Already paid' });
    const transactionId = 'TXN' + Date.now();
    await Payment.create({ order: order._id, customer: req.user._id, transactionId, method: order.paymentMethod, amount: order.totalAmount, status: 'pending' });
    res.json({ transactionId, amount: order.totalAmount, gateway: order.paymentMethod });
  } catch (err) { next(err); }
});

// Simulated verification: client passes success: true/false.
router.post('/verify', protect, async (req, res, next) => {
  try {
    const { orderId, transactionId, success } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });
    if (order.paymentStatus === 'paid') return res.status(400).json({ message: 'Already paid' });

    if (success) {
      order.paymentStatus = 'paid';
      order.transactionId = transactionId || 'TXN' + Date.now();
      await Payment.findOneAndUpdate({ order: order._id }, { status: 'paid', transactionId: order.transactionId });
    } else {
      order.paymentStatus = 'failed';
      order.orderStatus = 'payment_failed';
      order.statusHistory.push({ status: 'payment_failed' });
      await Payment.findOneAndUpdate({ order: order._id }, { status: 'failed' });
    }
    await order.save();
    res.json(order);
  } catch (err) { next(err); }
});

module.exports = router;