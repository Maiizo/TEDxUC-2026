"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return ref;
}

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={`w-3 h-3 ${className}`}>
      <path d="M6 0L12 6L6 12L0 6Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
    </svg>
  );
}

function ScrollIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export default function Event2Page() {
  const cardRef = useScrollReveal(100);
  const aboutRef = useScrollReveal(300);
  const btnRef = useScrollReveal(500);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <style jsx global>{`
        .revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[400px] bg-[#546e40]/6 rounded-full blur-[180px]" />
        <div className="absolute top-[40%] right-[-8%] w-[400px] h-[500px] bg-[#5d1d69]/6 rounded-full blur-[200px]" />
        <div className="absolute bottom-[5%] left-[20%] w-[400px] h-[300px] bg-[#546e40]/4 rounded-full blur-[160px]" />
      </div>

      {/* Background image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/bg-castle.webp"
          alt="Background"
          fill
          className="object-cover object-center opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/60 to-[#050505]/95" />
      </div>

      {/* Corner diamonds */}
      <div className="fixed top-[12%] left-6 z-10 text-[#546e40]/50"><Diamond className="w-4 h-4" /></div>
      <div className="fixed top-[12%] right-6 z-10 text-[#5d1d69]/50"><Diamond className="w-4 h-4" /></div>
      <div className="fixed bottom-[12%] left-6 z-10 text-[#5d1d69]/50"><Diamond className="w-4 h-4" /></div>
      <div className="fixed bottom-[12%] right-6 z-10 text-[#546e40]/50"><Diamond className="w-4 h-4" /></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-24 md:py-32">

        {/* Title */}
        <h1
          className="text-5xl sm:text-6xl md:text-8xl font-bold text-center mb-3 tracking-wider drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
        >
          Pre Event 2
        </h1>

        <p className="text-gray-300 italic text-lg md:text-xl tracking-[0.3em] mb-12 text-center uppercase drop-shadow-[0_0_15px_rgba(84,110,64,0.8)]">
          tema
        </p>

        {/* Main Info Card */}
        <div
          ref={cardRef}
          className="opacity-0 translate-y-8 transition-all duration-700 ease-out w-full max-w-2xl"
        >
          <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md p-7 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {/* Card corner diamonds */}
            <div className="absolute -top-2 -left-2 text-[#546e40]/60"><Diamond className="w-3.5 h-3.5" /></div>
            <div className="absolute -top-2 -right-2 text-[#5d1d69]/60"><Diamond className="w-3.5 h-3.5" /></div>
            <div className="absolute -bottom-2 -left-2 text-[#5d1d69]/60"><Diamond className="w-3.5 h-3.5" /></div>
            <div className="absolute -bottom-2 -right-2 text-[#546e40]/60"><Diamond className="w-3.5 h-3.5" /></div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-5 mb-7">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#546e40]/20 border border-[#546e40]/30 flex items-center justify-center text-[#6d8a58]">
                  <CalendarIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">April 11, 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#546e40]/20 border border-[#546e40]/30 flex items-center justify-center text-[#6d8a58]">
                  <ClockIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">13:00 – 16:00 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#546e40]/20 border border-[#546e40]/30 flex items-center justify-center text-[#6d8a58]">
                  <MapPinIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Venue</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">Castle Hall B, UC Surabaya</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#546e40]/20 border border-[#546e40]/30 flex items-center justify-center text-[#6d8a58]">
                  <UsersIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">120 Attendees</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#546e40]/50 to-transparent" />
              <Diamond className="text-[#6d8a58]/50 w-2.5 h-2.5" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#546e40]/50 to-transparent" />
            </div>

            {/* About section */}
            <div
              ref={aboutRef}
              className="opacity-0 translate-y-6 transition-all duration-700 ease-out"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="text-[#6d8a58]"><ScrollIcon /></div>
                <h2
                  className="text-lg font-bold uppercase tracking-widest text-gray-100"
                  style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
                >
                  About This Gathering
                </h2>
              </div>
              <div className="space-y-4 pl-1">
                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel lorem nec nulla dignissim
                  tincidunt vel at justo. Sed euismod libero non metus sodales, a tincidunt sapien iaculis.
                </p>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light">
                  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                  Vivamus pellentesque nisi eget leo tincidunt, at commodo nunc dapibus.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div
          ref={btnRef}
          className="mt-12 opacity-0 translate-y-6 transition-all duration-700 ease-out"
        >
          <Link href="/register" className="relative inline-block group">
            <div className="absolute -inset-2 rounded-full bg-[#546e40]/0 group-hover:bg-[#546e40]/30 blur-[20px] transition-all duration-700" />
            <span className="relative inline-flex items-center gap-3 px-12 py-5 border border-[#546e40]/60 bg-[#546e40]/10 hover:bg-[#546e40]/20 text-white text-sm md:text-base font-medium tracking-[0.2em] uppercase rounded-full transition-all duration-500 group-hover:border-[#546e40] group-hover:shadow-[0_0_40px_rgba(84,110,64,0.4)]">
              Reserve Your Place
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
