const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  image: String,
  quantity: { type: Number, default: 1 },
  unitPrice: Number,
  selectedOptions: [{ name: String, label: String, price: Number }],
  specialInstructions: String,
  subtotal: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String,
  customerPhone: String,
  orderType: { type: String, enum: ['delivery', 'pickup'], required: true },
  items: [orderItemSchema],
  deliveryAddress: { line: String, area: String, city: String, instructions: String },
  pickupTime: String,
  subtotal: Number,
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: Number,
  couponCode: { type: String, default: '' },
  paymentMethod: { type: String, enum: ['cod', 'pickup_cash', 'easypaisa', 'jazzcash', 'card'], required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'failed', 'refunded'], default: 'unpaid' },
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'collected', 'rejected', 'cancelled', 'payment_failed'],
    default: 'pending'
  },
  statusHistory: [{ status: String, at: { type: Date, default: Date.now } }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transactionId: { type: String, default: '' },
  riderLocation: { lat: Number, lng: Number, updatedAt: Date },
  customerLocation: { lat: Number, lng: Number },
  restaurantLocation: { lat: { type: Number, default: 33.6436 }, lng: { type: Number, default: 73.0176 } }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);