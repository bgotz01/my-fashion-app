import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productAddress: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
  collectionAddress: { type: String, required: true },
  imageUrl1: { type: String, required: true },
  imageUrl2: { type: String },
  imageUrl3: { type: String },
  imageUrl4: { type: String },
  imageUrl5: { type: String },
  jsonUrl: { type: String }
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
