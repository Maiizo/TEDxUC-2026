"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileEventsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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

  const isEventsActive = pathname.startsWith('/event/');

  return (
    <nav
      className={`
        fixed left-0 right-0 z-50 flex justify-center
        transition-all duration-500 ease-in-out
        ${isScrolled ? 'top-3 px-3 md:top-6 md:px-6' : 'top-0 px-0'}
      `}
    >
      <div
        className={`
          flex items-center justify-between w-full px-4 sm:px-6 md:px-8
          bg-black/40 backdrop-blur-md border border-white/10
          transition-all duration-500 ease-in-out
          ${isScrolled
            ? 'max-w-6xl rounded-2xl md:rounded-full py-3 bg-black/70 border-white/20'
            : 'max-w-full rounded-none py-4 md:py-5 bg-black/20 border-transparent'
          }
        `}
      >

        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="TEDxUC Home">
          <Image
            src="/images/logo_new.webp"
            alt="TEDxUC"
            width={180}
            height={48}
            className="h-8 w-auto md:h-10"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/about-ted" className={linkClass('/about-ted')}>About</Link>

          {/* Events dropdown */}
          <div className={`group relative flex items-center cursor-pointer transition-colors ${isEventsActive ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}>
            <span>Events</span>
            <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />

            {/* Invisible bridge + animated dropdown */}
            <div className="absolute top-full left-0 w-44 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-out">
              <div className="bg-black/80 backdrop-blur-lg rounded-xl border border-white/10 p-2">
                <Link href="/event/event1" className={subLinkClass('/event/event1')}>Pre Event 1</Link>
                <Link href="/event/event2" className={subLinkClass('/event/event2')}>Pre Event 2</Link>
                <Link href="/event/event3" className={subLinkClass('/event/event3')}>Pre Event 3</Link>
                <Link href="/event/mainevent" className={subLinkClass('/event/mainevent')}>Main Event</Link>
              </div>
            </div>
          </div>

          <Link href="/past-tedx" className={linkClass('/past-tedx')}>Past Event</Link>
          <Link href="/schedule" className={linkClass('/schedule')}>Speaker & Schedule</Link>
          <Link href="/gallery" className={linkClass('/gallery')}>Gallery</Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-white p-2"
          type="button"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          md:hidden fixed inset-0 top-0 z-[-1] bg-black/95 backdrop-blur-xl pt-20 pb-6 overflow-y-auto
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
            href="/about-ted"
            className={`hover:text-red-500 transition-colors ${pathname === '/about-ted' ? 'text-red-500' : ''}`}
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
              {['/event/event1', '/event/event2', '/event/event3', '/event/mainevent'].map((href, i) => (
                <Link
                  key={href}
                  href={href}
                  className={`hover:text-red-500 transition-colors ${pathname === href ? 'text-red-500' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {href === '/event/mainevent' ? 'Main Event' : `Pre Event ${i + 1}`}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/past-tedx"
            className={`hover:text-red-500 transition-colors ${pathname === '/past-tedx' ? 'text-red-500' : ''}`}
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