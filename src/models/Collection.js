// src/models/Collection.js
import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  collectionAddress: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  jsonUrl: { type: String, required: true },
  designerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  designerUsername: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
