// src/app/components/Navbar.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import Image from 'next/image';

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:4000/api/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setUsername(response.data.username);
      }).catch(() => {
        setUsername(null);
      });
    }
  }, []);

  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/assets/BujeyBrandLogo03.png" 
            alt="Bujey Brand Logo" 
            width={40} 
            height={40} 
            className="w-10 h-10"
          />
          <div className="text-white text-xl font-bold">Bujey</div>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/dashboard" className="text-white hidden sm:inline">
            Profile
          </Link>
          <Link href="/studio" className="text-white hidden sm:inline">
            Studio
          </Link>
          <Link href="/discover/collections" className="text-white hidden sm:inline">
            Discover
          </Link>
          <button
            onClick={toggleTheme}
            className="bg-gray-700 text-white px-2 py-1 rounded"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>
      <div className="container mx-auto flex justify-between items-center sm:hidden mt-2">
        <Link href="/dashboard" className="text-white">
          Profile
        </Link>
        <Link href="/studio" className="text-white">
          Studio
        </Link>
        <Link href="/discover/collections" className="text-white">
          Discover
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;