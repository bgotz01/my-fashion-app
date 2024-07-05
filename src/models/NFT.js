import mongoose from 'mongoose';

const NFTSchema = new mongoose.Schema({
  tokenAddress: { type: String, required: true },
  walletAddress: { type: String, required: true },
  designerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const NFT = mongoose.model('NFT', NFTSchema);

export default NFT;
