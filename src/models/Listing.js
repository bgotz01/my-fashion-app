// src/models/Listing.js
import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  tokenMint: { type: String, required: true },
  price: { type: Number, required: true },
  listedAt: { type: Date, default: Date.now },
});

const Listing = mongoose.model('Listing', ListingSchema);

export default Listing;
