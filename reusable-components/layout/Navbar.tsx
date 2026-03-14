"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileEventsOpen, setIsMobileEventsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Returns red if active, gray+red-hover if not
  const linkClass = (href: string) =>
    pathname === href
      ? 'text-red-500 transition-colors'
      : 'text-gray-300 hover:text-red-500 transition-colors';

  // For events sub-links: active if pathname starts with the href
  const subLinkClass = (href: string) =>
    pathname === href
      ? 'block px-4 py-2 rounded-lg text-red-500 bg-white/5 transition-colors'
      : 'block px-4 py-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-white/10 transition-colors';

  const isEventsActive = pathname.startsWith('/events');

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

        {/* Logo */}
        <div className="flex items-center text-xl font-bold tracking-tight">
          <span className="text-white">TEDx</span>
          <span className="text-red-600">UNIVERSITASCIPUTRA</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/about" className={linkClass('/about')}>About</Link>

          {/* Events dropdown */}
          <div className={`group relative flex items-center cursor-pointer transition-colors ${isEventsActive ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}>
            <span>Events</span>
            <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />

            {/* Invisible bridge + animated dropdown */}
            <div className="absolute top-full left-0 w-44 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-out">
              <div className="bg-black/80 backdrop-blur-lg rounded-xl border border-white/10 p-2">
                <Link href="/events/pre1" className={subLinkClass('/events/pre1')}>Pre Events 1</Link>
                <Link href="/events/pre2" className={subLinkClass('/events/pre2')}>Pre Events 2</Link>
                <Link href="/events/pre3" className={subLinkClass('/events/pre3')}>Pre Events 3</Link>
              </div>
            </div>
          </div>

          <Link href="/pastevent" className={linkClass('/pastevent')}>Past Event</Link>
          <Link href="/schedule" className={linkClass('/schedule')}>Speaker & Schedule</Link>
          <Link href="/gallery" className={linkClass('/gallery')}>Gallery</Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          md:hidden fixed inset-0 top-[72px] bg-black/95 backdrop-blur-xl
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col p-6 space-y-6 text-lg font-medium text-gray-300">
          <Link
            href="/"
            className={`hover:text-red-500 transition-colors ${pathname === '/' ? 'text-red-500' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`hover:text-red-500 transition-colors ${pathname === '/about' ? 'text-red-500' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>

          {/* Mobile Events accordion */}
          <div className="flex flex-col space-y-4">
            <div
              className={`flex items-center justify-between cursor-pointer hover:text-red-500 transition-colors ${isEventsActive ? 'text-red-500' : ''}`}
              onClick={() => setIsMobileEventsOpen(!isMobileEventsOpen)}
            >
              <span>Events</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isMobileEventsOpen ? 'rotate-180' : ''}`} />
            </div>

            <div className={`
              flex flex-col pl-4 space-y-4 text-base border-l border-white/10
              transition-all duration-300 overflow-hidden
              ${isMobileEventsOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
            `}>
              {['/events/pre1', '/events/pre2', '/events/pre3'].map((href, i) => (
                <Link
                  key={href}
                  href={href}
                  className={`hover:text-red-500 transition-colors ${pathname === href ? 'text-red-500' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pre Events {i + 1}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/pastevent"
            className={`hover:text-red-500 transition-colors ${pathname === '/pastevent' ? 'text-red-500' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Past Event
          </Link>
          <Link
            href="/schedule"
            className={`hover:text-red-500 transition-colors ${pathname === '/schedule' ? 'text-red-500' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Speaker & Schedule
          </Link>
          <Link
            href="/gallery"
            className={`hover:text-red-500 transition-colors ${pathname === '/gallery' ? 'text-red-500' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gallery
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;