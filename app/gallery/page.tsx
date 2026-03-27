'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

interface GalleryItem {
  src: string;
  title: string;
  date: string;
  span?: 'tall' | 'wide' | 'normal';
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: '/images/gallery/pe1_4.webp',
    title: 'Pre-Event 1: The First Gathering',
    date: 'April 10, 2026',
    span: 'tall',
  },
  {
    src: '/images/gallery/pe2_4.webp',
    title: 'Pre-Event 2: The Second Gathering',
    date: 'April 11, 2026',
    span: 'normal',
  },
  {
    src: '/images/gallery/pe3_1.webp',
    title: 'Pre-Event 3: The Third Gathering',
    date: 'April 13, 2026',
    span: 'normal',
  },
  {
    src: '/images/gallery/UCD05067.JPG',
    title: 'Main Event: TEDxUC 2026',
    date: 'May 10, 2026',
    span: 'wide',
  },
];

function GalleryCard({ item }: { item: GalleryItem }) {
  const [hovered, setHovered] = useState(false);

  const heightClass =
    item.span === 'tall'
      ? 'row-span-2 h-[480px] md:h-full'
      : item.span === 'wide'
        ? 'h-[260px]'
        : 'h-[230px]';

  return (
    <div
      className={`relative overflow-hidden rounded-xl group cursor-pointer ${heightClass} ${item.span === 'tall' ? 'md:row-span-2' : ''} ${item.span === 'wide' ? 'md:col-span-2' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Image
        src={item.src}
        alt={item.title}
        fill
        className={`object-cover transition-transform duration-700 ease-out ${hovered ? 'scale-110' : 'scale-100'
          }`}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Permanent subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Hover gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 ease-out ${hovered ? 'opacity-100' : 'opacity-0'
          }`}
      />

      {/* Top-left */}
      <div className={`absolute top-3 left-3 transition-all duration-500 ${hovered ? 'opacity-100' : 'opacity-60'}`}>
        <div className={`absolute top-0 left-0 w-5 h-[1.5px] transition-colors duration-500`} style={{ backgroundColor: hovered ? '#6d8a58' : '#546e40' }} />
        <div className={`absolute top-0 left-0 w-[1.5px] h-5 transition-colors duration-500`} style={{ backgroundColor: hovered ? '#6d8a58' : '#546e40' }} />
      </div>
      {/* Top-right */}
      <div className={`absolute top-3 right-3 transition-all duration-500 ${hovered ? 'opacity-100' : 'opacity-60'}`}>
        <div className={`absolute top-0 right-0 w-5 h-[1.5px] transition-colors duration-500`} style={{ backgroundColor: hovered ? '#6d8a58' : '#546e40' }} />
        <div className={`absolute top-0 right-0 w-[1.5px] h-5 transition-colors duration-500`} style={{ backgroundColor: hovered ? '#6d8a58' : '#546e40' }} />
      </div>
      {/* Bottom-left */}
      <div className={`absolute bottom-3 left-3 transition-all duration-500 ${hovered ? 'opacity-100' : 'opacity-60'}`}>
        <div className={`absolute bottom-0 left-0 w-5 h-[1.5px] transition-colors duration-500`} style={{ backgroundColor: hovered ? '#6d8a58' : '#546e40' }} />
        <div className={`absolute bottom-0 left-0 w-[1.5px] h-5 transition-colors duration-500`} style={{ backgroundColor: hovered ? '#6d8a58' : '#546e40' }} />
      </div>
      {/* Bottom-right */}
      <div className={`absolute bottom-3 right-3 transition-all duration-500 ${hovered ? 'opacity-100' : 'opacity-60'}`}>
        <div className={`absolute bottom-0 right-0 w-5 h-[1.5px] transition-colors duration-500`} style={{ backgroundColor: hovered ? '#6d8a58' : '#546e40' }} />
        <div className={`absolute bottom-0 right-0 w-[1.5px] h-5 transition-colors duration-500`} style={{ backgroundColor: hovered ? '#6d8a58' : '#546e40' }} />
      </div>

      {/* Text reveal */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ease-out ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
      >
        {/* Date badge */}
        <span className="inline-block text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8ab385] mb-2">
          {item.date}
        </span>
        {/* Title */}
        <h3
          className={`${cinzel.className} text-white text-base md:text-lg leading-tight`}
        >
          {item.title}
        </h3>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[5%] left-[-15%] w-[600px] h-[500px] bg-[#546e40]/5 rounded-full blur-[200px]" />
        <div className="absolute top-[50%] right-[-10%] w-[500px] h-[600px] bg-[#5d1d69]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-[#546e40]/4 rounded-full blur-[180px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-28 md:py-36">

        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#546e40]/60" />
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5 text-[#6d8a58]/60">
              <path d="M6 0L12 6L6 12L0 6Z" />
            </svg>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#546e40]/60" />
          </div>

          <h1
            className={`${cinzel.className} text-5xl sm:text-6xl md:text-7xl font-bold tracking-wide text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.08)]`}
          >
            The Grand Gallery
          </h1>
          <p className="text-gray-500 italic tracking-[0.3em] text-sm md:text-base uppercase mt-3">
            Chronicles of our kingdom&apos;s past
          </p>

          {/* Bottom decorative */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#546e40]/40 to-transparent" />
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-2 h-2 text-[#5d1d69]/50">
              <path d="M6 0L12 6L6 12L0 6Z" />
            </svg>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#5d1d69]/40 to-transparent" />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[230px]">
          {GALLERY_ITEMS.map((item) => (
            <GalleryCard key={item.src} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
