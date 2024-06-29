// src/app/components/FeaturedCollections.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedCollections = ({ collectionAddresses }: { collectionAddresses: string[] }) => {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await Promise.all(
          collectionAddresses.map(async (address) => {
            const response = await axios.get(`http://localhost:4000/api/public/collections/address/${address}`);
            return response.data;
          })
        );
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching featured collections:', error);
      }
    };

    fetchCollections();
  }, [collectionAddresses]);

  return (
    <div className="bg-white dark:bg-black text-gray-800 dark:text-white p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Featured Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Card key={collection._id} className="p-4 border rounded bg-beige dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <Image src={collection.imageUrl} alt={collection.name} width={100} height={100} className="object-cover rounded-md" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{collection.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Designer:</strong> {collection.designerUsername}</p>
                <Link href={`/discover/collections/${collection._id}`} className="text-blue-500 hover:underline">
                  View Collection
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCollections;
