const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({ label: String, price: { type: Number, default: 0 } }, { _id: false });

const customizationSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['single', 'multi'], default: 'single' },
  required: { type: Boolean, default: false },
  options: [optionSchema]
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  customizations: [customizationSchema],
  preparationTime: { type: Number, default: 15 },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);