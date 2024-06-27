// src/app/discover/products/[productId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './product.css';  // Import the custom CSS file
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="slick-next" onClick={onClick}>
      <ArrowBigRight />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="slick-prev" onClick={onClick}>
      <ArrowBigLeft />
    </div>
  );
};

interface Product {
  _id: string;
  name: string;
  productAddress: string;
  description: string;
  price: number;
  imageUrl1: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
  collectionAddress: string;
}

const ProductPage: React.FC = () => {
  const { productId } = useParams() as { productId: string };
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      axios.get(`http://localhost:4000/api/products/${productId}`)
        .then(response => {
          setProduct(response.data);
        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-4">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[500px] w-[500px] rounded-xl dark:bg-gray-800" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] dark:bg-gray-800" />
            <Skeleton className="h-4 w-[200px] dark:bg-gray-800" />
            <Skeleton className="h-4 w-[300px] dark:bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  const trimmedCollectionAddress = `${product.collectionAddress.slice(0, 6)}...${product.collectionAddress.slice(-4)}`;
  const imageUrls = [product.imageUrl1, product.imageUrl2, product.imageUrl3, product.imageUrl4, product.imageUrl5].filter(url => url);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4">
      <Card className="flex flex-col md:flex-row p-8 border rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:border-gray-700 w-full max-w-5xl">
        <div className="w-full md:w-1/2 pr-8">
          <Slider {...settings}>
            {imageUrls.map((url, index) => (
              <div key={index}>
                <Image 
                  src={url as string} 
                  alt={product.name} 
                  width={500} 
                  height={500} 
                  className="object-cover rounded-lg transform transition-transform hover:scale-105"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="w-full md:w-1/2 pl-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">{product.name}</h1>
          <p className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-400">${product.price}</p>
          <p className="text-md mb-4 text-gray-800 dark:text-gray-200">{product.description}</p>
          <p className="text-md text-gray-800 dark:text-gray-200">
            <strong>Collection Address:</strong> 
            <Link href={`https://solscan.io/address/${product.collectionAddress}`} target="_blank" className="text-blue-500 hover:underline ml-2">
              {trimmedCollectionAddress}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;
