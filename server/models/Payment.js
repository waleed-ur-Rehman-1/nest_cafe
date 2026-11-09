const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transactionId: String,
  method: String,
  amount: Number,
  currency: { type: String, default: 'PKR' },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);