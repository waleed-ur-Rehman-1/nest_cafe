const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: String,
  line: String,
  area: String,
  city: String,
  phone: String,
  instructions: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin', 'kitchen', 'delivery', 'pickup'], default: 'customer' },
  addresses: [addressSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);