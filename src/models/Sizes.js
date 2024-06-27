// src/models/Sizes.js

import mongoose from 'mongoose';

const SizesSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const Sizes = mongoose.model('Sizes', SizesSchema);

export default Sizes;
