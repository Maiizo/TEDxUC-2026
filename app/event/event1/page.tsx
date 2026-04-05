"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import RegistrationForm from "@/reusable-components/ui/RegistrationForm";

/* ══════════════════════════════════════════
   HOOKS
   ══════════════════════════════════════════ */

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

/* ══════════════════════════════════════════
   SVG DECORATIONS
   ══════════════════════════════════════════ */

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={`w-3 h-3 ${className}`}>
      <path d="M6 0L12 6L6 12L0 6Z" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   ICON COMPONENTS
   ══════════════════════════════════════════ */

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

/* ══════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════ */

export default function Event1Page() {
  const cardRef = useScrollReveal(100);
  const btnRef = useScrollReveal(500);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* ── Global styles ── */}
      <style jsx global>{`
        .revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}</style>

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[400px] bg-[#546e40]/6 rounded-full blur-[180px]" />
        <div className="absolute top-[40%] right-[-8%] w-[400px] h-[500px] bg-[#5d1d69]/6 rounded-full blur-[200px]" />
        <div className="absolute bottom-[5%] left-[20%] w-[400px] h-[300px] bg-[#546e40]/4 rounded-full blur-[160px]" />
      </div>

      {/* ── Background image ── */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/palace.jpg"
          alt="Background"
          fill
          className="object-cover object-center opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-(--void-black)/0" />
      </div>

      {/* ── Corner diamond decorations ── */}
      <div className="fixed top-[12%] left-6 z-10 text-[#546e40]/50">
        <Diamond className="w-4 h-4" />
      </div>
      <div className="fixed top-[12%] right-6 z-10 text-[#5d1d69]/50">
        <Diamond className="w-4 h-4" />
      </div>
      <div className="fixed bottom-[12%] left-6 z-10 text-[#5d1d69]/50">
        <Diamond className="w-4 h-4" />
      </div>
      <div className="fixed bottom-[12%] right-6 z-10 text-[#546e40]/50">
        <Diamond className="w-4 h-4" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-24 md:py-32">

        {/* Title */}
        <h1
          className="text-5xl sm:text-6xl md:text-8xl font-bold text-center mb-3 tracking-wider drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
        >
          Pre Event 1
        </h1>

        {/* Subtitle / theme */}
        <p className="text-gray-300 italic text-lg md:text-xl tracking-[0.3em] mb-12 text-center uppercase drop-shadow-[0_0_15px_rgba(84,110,64,0.8)]">
          Public Speaking
        </p>

        {/* Main Info Card */}
        <div
          ref={cardRef}
          className="opacity-0 translate-y-8 transition-all duration-700 ease-out w-full max-w-2xl"
        >
          <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md p-7 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {/* Card corner diamonds */}
            <div className="absolute -top-2 -left-2 text-[#546e40]/60">
              <Diamond className="w-3.5 h-3.5" />
            </div>
            <div className="absolute -top-2 -right-2 text-[#5d1d69]/60">
              <Diamond className="w-3.5 h-3.5" />
            </div>
            <div className="absolute -bottom-2 -left-2 text-[#5d1d69]/60">
              <Diamond className="w-3.5 h-3.5" />
            </div>
            <div className="absolute -bottom-2 -right-2 text-[#546e40]/60">
              <Diamond className="w-3.5 h-3.5" />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-5 mb-7">
              {/* Date */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#546e40]/20 border border-[#546e40]/30 flex items-center justify-center text-[#6d8a58]">
                  <CalendarIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">10 Maret 2026</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#546e40]/20 border border-[#546e40]/30 flex items-center justify-center text-[#6d8a58]">
                  <ClockIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">16.00-19.30</p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#546e40]/20 border border-[#546e40]/30 flex items-center justify-center text-[#6d8a58]">
                  <MapPinIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Venue</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">Theater 713</p>
                </div>
              </div>

              {/* Capacity */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#546e40]/20 border border-[#546e40]/30 flex items-center justify-center text-[#6d8a58]">
                  <UsersIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">50 orang</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#546e40]/50 to-transparent" />
              <Diamond className="text-[#6d8a58]/50 w-2.5 h-2.5" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#546e40]/50 to-transparent" />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div
          ref={btnRef}
          className="mt-12 opacity-0 translate-y-6 transition-all duration-700 ease-out"
        >
          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="relative inline-block group"
          >
            <div className="absolute -inset-2 rounded-full bg-[#546e40]/0 group-hover:bg-[#546e40]/30 blur-[20px] transition-all duration-700" />
            <span className="relative inline-flex items-center gap-3 px-12 py-5 border border-[#7ea66a] bg-linear-to-r from-[#4d6a3d] via-[#5d7e4b] to-[#6d8f59] text-white text-sm md:text-base font-semibold tracking-[0.2em] uppercase rounded-full transition-all duration-500 shadow-[0_8px_30px_rgba(84,110,64,0.35)] group-hover:from-[#5a7c48] group-hover:via-[#6a9056] group-hover:to-[#7ca866] group-hover:border-[#9ec489] group-hover:shadow-[0_0_50px_rgba(132,179,112,0.6)] group-hover:-translate-y-0.5">
              Reserve Your Place
            </span>
          </button>
        </div>
      </div>

      {isRegisterOpen && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsRegisterOpen(false);
          }}
        >
          <RegistrationForm eventKey="pre-event-1" onClose={() => setIsRegisterOpen(false)} />
        </div>
      )}
    </div>
  );
}
