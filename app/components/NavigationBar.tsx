"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed left-0 right-0 z-50 flex justify-center
        transition-all duration-500 ease-in-out
        ${isScrolled ? 'top-6 px-6' : 'top-0 px-0'}
      `}
    >
      <div
        className={`
          flex items-center justify-between w-full px-8
          bg-black/40 backdrop-blur-md border border-white/10
          transition-all duration-500 ease-in-out
          ${isScrolled
            ? 'max-w-6xl rounded-full py-3 bg-black/60 border-white/20'
            : 'max-w-full rounded-none py-5 bg-black/20 border-transparent'
          }
        `}
      >

        <div className="flex items-center text-xl font-bold tracking-tight">
          <span className="text-white">TEDx</span>
          <span className="text-red-600">UCSurabaya</span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-200">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>

          <div className="group relative flex items-center cursor-pointer hover:text-white transition-colors">
            <span>Events</span>
            <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform" />

            {/* Invisible bridge + animated dropdown */}
            <div className="absolute top-full left-0 w-44 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-out">
              <div className="bg-black/80 backdrop-blur-lg rounded-xl border border-white/10 p-2">
                <Link href="/events/pre1" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">Pre Events 1</Link>
                <Link href="/events/pre2" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">Pre Events 2</Link>
                <Link href="/events/pre3" className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors">Pre Events 3</Link>
              </div>
            </div>
          </div>

          <Link href="/schedule" className="hover:text-white transition-colors">Speaker & Schedule</Link>
          <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
        </div>
        <div className="md:hidden text-white">
          ☰
        </div>
      </div>
    </nav>
  );
};

export default Navbar; ``