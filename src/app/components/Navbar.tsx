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
    <nav className="px-10 py-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/assets/BujeyBrandLogo03.png" 
            alt="Bujey Brand Logo" 
            width={40} 
            height={40} 
            className="w-10 h-10"
          />
          <div className={` text-xl font-bold  text-${theme==="light" ? "black":"white"}`}>Bujey</div>
        </Link>
        <div className={`space-x-4 flex items-center text-${theme==="light" ? "black":"white"} `}>
          <Link href="/dashboard" className=" hidden sm:inline">
            Profile
          </Link>
          <Link href="/studio" className="hidden sm:inline">
            Studio
          </Link>
          <Link href="/discover/collections" className=" hidden sm:inline">
            Discover
          </Link>
          <button
            onClick={toggleTheme}
            className={`bg-${theme==="light"? "neutral-800":"gray-600"} text-${theme==="light" ? "white":"white"} px-2 py-1 rounded hover:bg-${theme==="light"? "neutral-600":"gray-700"}`}
            >
            Themes
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
