'use client';

import Image from 'next/image';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

function Diamond({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={`w-3 h-3 ${className}`}>
      <path d="M6 0L12 6L6 12L0 6Z" />
    </svg>
  );
}

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background image */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/images/hallway.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-17"
          priority
        />
        <div className="absolute inset-0 bg-(--void-black)/0" />
      </div>

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[500px] bg-[#546e40]/6 rounded-full blur-[200px]" />
        <div className="absolute top-[50%] right-[-10%] w-[500px] h-[600px] bg-[#5d1d69]/6 rounded-full blur-[200px]" />
        <div className="absolute bottom-[5%] left-[25%] w-[400px] h-[300px] bg-[#546e40]/4 rounded-full blur-[160px]" />
      </div>

      {/* Corner diamonds */}
      <div className="fixed top-[12%] left-6 z-10 text-[#546e40]/40"><Diamond className="w-4 h-4" /></div>
      <div className="fixed top-[12%] right-6 z-10 text-[#5d1d69]/40"><Diamond className="w-4 h-4" /></div>
      <div className="fixed bottom-[12%] left-6 z-10 text-[#5d1d69]/40"><Diamond className="w-4 h-4" /></div>
      <div className="fixed bottom-[12%] right-6 z-10 text-[#546e40]/40"><Diamond className="w-4 h-4" /></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-8">

        {/* Top decorative line */}
        <div className="flex items-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#546e40]/50" />
          <Diamond className="text-[#6d8a58]/50 w-2.5 h-2.5" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#546e40]/50" />
        </div>

        {/* Label */}
        <p className="text-[11px] tracking-[0.4em] uppercase text-[#6d8a58] font-semibold">
          Speakers &amp; Schedule
        </p>

        {/* Main heading */}
        <h1
          className={`${cinzel.className} text-6xl sm:text-7xl md:text-8xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.06)]`}
        >
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 italic text-sm md:text-base tracking-[0.25em] uppercase max-w-md">
          The scrolls are being prepared.<br />Our speakers will soon be revealed.
        </p>

        {/* Bottom decorative line */}
        <div className="flex items-center gap-4 pt-2">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#5d1d69]/40 to-transparent" />
          <Diamond className="text-[#5d1d69]/40 w-2 h-2" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent via-[#546e40]/40 to-transparent" />
        </div>

        {/* Event date hint */}
        <div className="mt-4 px-8 py-4 border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-sm">
          <p className="text-gray-600 text-xs tracking-[0.3em] uppercase mb-1">Main Event</p>
          <p className="text-gray-300 text-sm font-medium tracking-wide">April 1, 2026</p>
        </div>
      </div>
    </div>
  );
}
