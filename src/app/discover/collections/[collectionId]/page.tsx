// src/app/discover/collections/[collectionId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Image from 'next/image';
import Skeleton from '@/components/Skeleton';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl1: string;
  imageUrl2?: string;
}

interface Collection {
  _id: string;
  name: string;
  collectionAddress: string;
  imageUrl: string;
  jsonUrl: string;
  designerId: string;
  designerUsername: string;
  products: string[];
}

const CollectionPage = () => {
  const { collectionId } = useParams() as { collectionId: string };
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (collectionId) {
      console.log('Fetching collection with ID:', collectionId); // Logging

      axios.get(`http://localhost:4000/api/public/collections/${collectionId}`)
        .then(response => {
          setCollection(response.data);
          return axios.get(`http://localhost:4000/api/public/collections/${collectionId}/products`);
        })
        .then(response => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching collection or products:', error);
          setLoading(false);
        });
    }
  }, [collectionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
        <Skeleton className="h-[300px] w-[250px] rounded-xl mb-4" />
        <div className="space-y-2 w-full max-w-2xl">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="flex flex-col items-center p-4 border rounded shadow-md">
                <Skeleton className="h-[250px] w-[250px] rounded-md" />
                <Skeleton className="h-4 w-32 mt-2" />
                <Skeleton className="h-4 w-20 mt-1" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
      <Card className="flex flex-col p-4 border rounded bg-white dark:bg-black dark:border-gray-700 mb-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Image src={collection.imageUrl} alt={collection.name} width={150} height={150} className="object-cover rounded-md" />
          <div className="flex flex-col ml-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{collection.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Collection Address:</strong> {collection.collectionAddress}
            </p>
          </div>
        </div>
        
        <p className="text-md text-gray-800 dark:text-gray-200">
          <strong>Designer Username:</strong>
          <Link href={`/discover/designer/${collection.designerUsername}`} className="text-inherit hover:underline ml-2">
            {collection.designerUsername}
          </Link>
        </p>
        <p className="text-md text-gray-800 dark:text-gray-200">
          <strong>Designer ID:</strong>
          <Link href={`/discover/designer/${collection.designerUsername}`} className="text-inherit hover:underline ml-2">
            {collection.designerId}
          </Link>
        </p>
      </Card>

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: Product) => (
            <Card key={product._id} className="relative p-0 border rounded shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <Link href={`/discover/products/${product._id}`}>
                <div className="relative">
                  <Image 
                    src={product.imageUrl1} 
                    alt={product.name} 
                    width={300} 
                    height={300} 
                    className="object-cover w-full h-full rounded-md transform transition-transform duration-300 ease-in-out hover:scale-105" 
                  />
                  {product.imageUrl2 && (
                    <Image 
                      src={product.imageUrl2} 
                      alt={product.name} 
                      width={300} 
                      height={300} 
                      className="object-cover w-full h-full rounded-md absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out" 
                    />
                  )}
                </div>
              </Link>
              <div className="flex justify-between rounded-lg items-center p-2 bg-beige dark:bg-gray-900">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">${product.price}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
