// src/app/studio/products/[productId]/sizes/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Size {
  _id: string;
  productId: string;
  size: string;
  quantity: number;
}

const ManageSizesPage = () => {
  const { productId } = useParams() as { productId: string };
  const [sizes, setSizes] = useState<Size[]>([]);
  const [newSize, setNewSize] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${productId}/sizes`);
        setSizes(response.data);
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    };

    fetchSizes();
  }, [productId]);

  const handleAddSize = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSize || quantity <= 0) {
      setError('Size and quantity are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/sizes', {
        productId,
        size: newSize,
        quantity,
      });

      if (response.status === 201) {
        setSuccess('Size added successfully');
        setSizes([...sizes, response.data]);
        setNewSize('');
        setQuantity(0);
      } else {
        setError('Failed to add size');
      }
    } catch (err) {
      setError('Error adding size. Please try again.');
      console.error('Error adding size:', err);
    }
  };

  const handleDeleteSize = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/sizes/${id}`);
      if (response.status === 200) {
        setSizes(sizes.filter(size => size._id !== id));
      } else {
        setError('Failed to delete size');
      }
    } catch (err) {
      setError('Error deleting size. Please try again.');
      console.error('Error deleting size:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Sizes</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleAddSize} className="space-y-4">
          <div>
            <label htmlFor="newSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
            <Input 
              id="newSize"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Size"
              required
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
            <Input 
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Quantity"
              required
            />
          </div>
          <Button type="submit" className="w-full">Add Size</Button>
        </form>
      </div>
      <div className="w-full max-w-2xl space-y-4">
        {sizes.map((size: Size) => (
          <Card key={size._id} className="flex justify-between items-center p-4 border rounded">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Size: {size.size}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {size.quantity}</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteSize(size._id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageSizesPage;
