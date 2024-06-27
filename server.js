//server.js

import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import connectMongo from './src/lib/db.js';
import User from './src/models/User.js';
import Collection from './src/models/Collection.js';
import Product from './src/models/Product.js';
import Sizes from './src/models/Sizes.js';

// Load environment variables from .env file
dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

// MongoDB connection
connectMongo();


// USERS 



// User registration route
server.post('/api/register', async (req, res) => {
  const { username, password, email, solanaWallet } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, password: hashedPassword, email, solanaWallet, role: 'designer' });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User login route
server.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret');
    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        solanaWallet: user.solanaWallet,
        _id: user._id
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch user info route
server.get('/api/userinfo', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      username: user.username,
      email: user.email,
      solanaWallet: user.solanaWallet,
      userId: user._id
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

// Update user info route
server.put('/api/userinfo', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { email, solanaWallet } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { email, solanaWallet },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      username: updatedUser.username,
      email: updatedUser.email,
      solanaWallet: updatedUser.solanaWallet,
      userId: updatedUser._id
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});






// COLLECTIONS

// Create collection route
server.post('/api/collections', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { name, collectionAddress, imageUrl, jsonUrl } = req.body;

    // Log the request body and decoded token for debugging
    console.log('Request Body:', req.body);
    console.log('Decoded Token:', decoded);

    if (!name || !collectionAddress || !imageUrl || !jsonUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const collection = new Collection({
      name,
      collectionAddress,
      imageUrl,
      jsonUrl,
      designerId: decoded.id,
      designerUsername: user.username,
      products: []
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(400).json({ message: error.message });
  }
});




// Edit collection route
server.put('/api/collections/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { id } = req.params;
    const { name, collectionAddress, imageUrl, jsonUrl } = req.body;

    if (!name || !collectionAddress || !imageUrl || !jsonUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const collection = await Collection.findById(id);
    if (!collection || !collection.designerId.equals(decoded.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    collection.name = name;
    collection.collectionAddress = collectionAddress;
    collection.imageUrl = imageUrl;
    collection.jsonUrl = jsonUrl;

    await collection.save();
    res.status(200).json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete collection route
server.delete('/api/collections/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { id } = req.params;

    console.log('Decoded Token:', decoded); // Add logging
    const collection = await Collection.findById(id);
    if (!collection) {
      console.log('Collection not found'); // Add logging
      return res.status(404).json({ message: 'Collection not found' });
    }
    if (!collection.designerId.equals(decoded.id)) {
      console.log('Access denied'); // Add logging
      return res.status(403).json({ message: 'Access denied' });
    }

    await Collection.deleteOne({ _id: id }); // Change this line
    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error); // Add logging
    res.status(400).json({ message: error.message });
  }
});


// Fetch collections route
server.get('/api/collections', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const collections = await Collection.find({ designerId: decoded.id });
    res.status(200).json(collections);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// PRODUCTS

// Fetch products in a collection
server.get('/api/collections/:collectionId/products', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { collectionId } = req.params;

    const collection = await Collection.findById(collectionId);
    if (!collection || !collection.designerId.equals(decoded.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const products = await Product.find({ collectionId });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Add product to collection route
server.post('/api/products', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { name, productAddress, description, price, collectionId, imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, jsonUrl } = req.body;

    if (!name || !productAddress || !price || !collectionId || !imageUrl1) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection || !collection.designerId.equals(decoded.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const product = new Product({
      name,
      productAddress,
      description,
      price,
      collectionId,
      collectionAddress: collection.collectionAddress, // Save collection address
      imageUrl1,
      imageUrl2,
      imageUrl3,
      imageUrl4,
      imageUrl5,
      jsonUrl
    });

    await product.save();

    collection.products.push(product._id);
    await collection.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Edit product route
server.put('/api/products/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { id } = req.params;
    const { name, tokenAddress, description, price, imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, jsonUrl } = req.body;

    const product = await Product.findById(id);
    const collection = await Collection.findById(product.collectionId);
    if (!product || !collection.designerId.equals(decoded.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    product.name = name || product.name;
    product.tokenAddress = tokenAddress || product.tokenAddress;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl1 = imageUrl1 || product.imageUrl1;
    product.imageUrl2 = imageUrl2 || product.imageUrl2;
    product.imageUrl3 = imageUrl3 || product.imageUrl3;
    product.imageUrl4 = imageUrl4 || product.imageUrl4;
    product.imageUrl5 = imageUrl5 || product.imageUrl5;
    product.jsonUrl = jsonUrl || product.jsonUrl;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product route
server.delete('/api/products/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { id } = req.params;

    console.log('Product ID:', id); // Add logging
    const product = await Product.findById(id);
    if (!product) {
      console.log('Product not found'); // Add logging
      return res.status(404).json({ message: 'Product not found' });
    }

    const collection = await Collection.findById(product.collectionId);
    if (!collection || !collection.designerId.equals(decoded.id)) {
      console.log('Access denied'); // Add logging
      return res.status(403).json({ message: 'Access denied' });
    }

    await Product.deleteOne({ _id: id }); // Change this line

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error); // Add logging
    res.status(400).json({ message: error.message });
  }
});

// Fetch product by ID route
server.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Public route to fetch products for a collection
server.get('/api/public/collections/:collectionId/products', async (req, res) => {
  try {
    const { collectionId } = req.params;
    const products = await Product.find({ collectionId });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// SIZES

// Fetch sizes for a product
server.get('/api/products/:productId/sizes', async (req, res) => {
  try {
    const { productId } = req.params;
    const sizes = await Sizes.find({ productId });
    res.status(200).json(sizes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a size to a product
server.post('/api/sizes', async (req, res) => {
  const { productId, size, quantity } = req.body;

  if (!productId || !size || !quantity) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const newSize = new Sizes({ productId, size, quantity });
    await newSize.save();
    res.status(201).json(newSize);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a size
server.delete('/api/sizes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Sizes.findByIdAndDelete(id);
    res.status(200).json({ message: 'Size deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});





// DESIGNERS

// Fetch all designers route
server.get('/api/designers', async (req, res) => {
  try {
    const designers = await User.find({ role: 'designer' }).select('username email solanaWallet');
    res.status(200).json(designers);
  } catch (error) {
    console.error('Error fetching designers:', error);
    res.status(400).json({ message: error.message });
  }
});

// Fetch collections by designer route
server.get('/api/collections/by-designer/:designerId', async (req, res) => {
  try {
    const { designerId } = req.params;
    const collections = await Collection.find({ designerId }).select('name collectionAddress imageUrl jsonUrl');
    res.status(200).json(collections);
  } catch (error) {
    console.error('Error fetching collections by designer:', error);
    res.status(400).json({ message: error.message });
  }
});



// RERGULAR USERS

// Fetch single collection for public users route
server.get('/api/public/collections/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Fetching collection with ID for public:', id); // Logging

    const collection = await Collection.findById(id);
    if (!collection) {
      console.log('Collection not found'); // Logging
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error); // Logging
    res.status(400).json({ message: error.message });
  }
});


// Custom route handling for Next.js pages
server.all('*', (req, res) => {
  res.status(404).send('Not found');
});

server.listen(4000, () => {
  console.log('> API server ready on http://localhost:4000');
});
