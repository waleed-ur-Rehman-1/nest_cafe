const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');
const { protect } = require('../middleware/auth');

const router = express.Router();

const genOrderNumber = () =>
  'NC' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);

const DELIVERY_FEE = 150;

router.post('/', protect, async (req, res, next) => {
  try {
    const { items, orderType, deliveryAddress, pickupTime, paymentMethod, couponCode, customerName, customerPhone, customerLocation } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    if (!['delivery', 'pickup'].includes(orderType)) return res.status(400).json({ message: 'Invalid order type' });
    if (!['cod', 'pickup_cash', 'easypaisa', 'jazzcash', 'card'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    let subtotal = 0;
    const builtItems = [];
    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p || !p.isAvailable) return res.status(400).json({ message: `Product unavailable: ${it.name || 'unknown'}` });
      let unit = p.discountPrice > 0 ? p.discountPrice : p.price;
      const selected = [];
      for (const opt of (it.selectedOptions || [])) {
        const group = (p.customizations || []).find((g) => g.name === opt.name);
        const found = group && group.options.find((o) => o.label === opt.label);
        if (found) {
          unit += found.price || 0;
          selected.push({ name: group.name, label: found.label, price: found.price || 0 });
        }
      }
      const qty = Math.max(1, Number(it.quantity) || 1);
      subtotal += unit * qty;
      builtItems.push({
        product: p._id, name: p.name, image: p.image, quantity: qty, unitPrice: unit,
        selectedOptions: selected, specialInstructions: it.specialInstructions || '', subtotal: unit * qty
      });
    }

    let deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
    let discount = 0;
    let appliedCode = '';

    if (couponCode) {
      const promo = await Promotion.findOne({ code: String(couponCode).toUpperCase(), isActive: true });
      if (!promo) return res.status(400).json({ message: 'Invalid coupon' });
      if (promo.expiresAt && promo.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' });
      if (subtotal < (promo.minOrder || 0)) return res.status(400).json({ message: `Minimum order Rs. ${promo.minOrder} required` });
      if (promo.type === 'percent') discount = Math.min((subtotal * promo.value) / 100, promo.maxDiscount || Infinity);
      else if (promo.type === 'fixed') discount = Math.min(promo.value, subtotal);
      else if (promo.type === 'free_delivery') deliveryFee = 0;
      appliedCode = promo.code;
    }

    const tax = 0;
    const totalAmount = Math.max(0, subtotal - discount + deliveryFee + tax);

    const finalCustomerLocation = customerLocation && customerLocation.lat
      ? { lat: Number(customerLocation.lat), lng: Number(customerLocation.lng) }
      : { lat: 33.6500 + (Math.random() - 0.5) * 0.02, lng: 73.0300 + (Math.random() - 0.5) * 0.02 };

    const order = await Order.create({
      orderNumber: genOrderNumber(),
      customer: req.user._id,
      customerName: customerName || req.user.name,
      customerPhone: customerPhone || req.user.phone,
      orderType,
      items: builtItems,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      pickupTime: orderType === 'pickup' ? pickupTime : undefined,
      subtotal, discount, deliveryFee, tax, totalAmount,
      couponCode: appliedCode,
      paymentMethod,
      paymentStatus: ['cod', 'pickup_cash'].includes(paymentMethod) ? 'unpaid' : 'pending',
      orderStatus: 'pending',
      statusHistory: [{ status: 'pending' }],
      customerLocation: orderType === 'delivery' ? finalCustomerLocation : undefined
    });

    res.status(201).json(order);
  } catch (err) { next(err); }
});

router.get('/my-orders', protect, async (req, res, next) => {
  try { res.json(await Order.find({ customer: req.user._id }).sort('-createdAt')); } catch (err) { next(err); }
});

router.get('/track/:orderNumber', async (req, res, next) => {
  try {
    const o = await Order.findOne({ orderNumber: req.params.orderNumber })
      .select('orderNumber orderStatus statusHistory totalAmount createdAt orderType riderLocation customerLocation restaurantLocation deliveryAddress');
    if (!o) return res.status(404).json({ message: 'Order not found' });
    res.json(o);
  } catch (err) { next(err); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'Order not found' });
    const owner = o.customer && o.customer.toString() === req.user._id.toString();
    if (!owner && !['admin', 'kitchen', 'delivery', 'pickup'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    res.json(o);
  } catch (err) { next(err); }
});

router.post('/:id/cancel', protect, async (req, res, next) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'Order not found' });
    if (o.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    if (!['pending', 'accepted'].includes(o.orderStatus)) {
      return res.status(400).json({ message: 'Order cannot be cancelled now' });
    }
    o.orderStatus = 'cancelled';
    o.statusHistory.push({ status: 'cancelled' });
    await o.save();
    res.json(o);
  } catch (err) { next(err); }
});

module.exports = router;