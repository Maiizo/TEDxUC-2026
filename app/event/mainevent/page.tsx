"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import RegistrationForm from "@/reusable-components/ui/RegistrationForm";
import PaymentForm from "@/reusable-components/ui/PaymentForm";

interface PaymentTarget {
  registrationId: string;
  registrationNumber: string;
  amount: number;
}

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

function ScrollIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════ */

export default function MainEventPage() {
  const cardRef = useScrollReveal(100);
  const aboutRef = useScrollReveal(300);
  const btnRef = useScrollReveal(500);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(null);

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

      {/* ── Ambient glows (using a more intense mix of purple and green for the main event) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[500px] bg-[#5d1d69]/8 rounded-full blur-[200px]" />
        <div className="absolute top-[40%] right-[-8%] w-[500px] h-[600px] bg-[#546e40]/7 rounded-full blur-[220px]" />
        <div className="absolute bottom-[5%] left-[20%] w-[500px] h-[400px] bg-[#971212]/5 rounded-full blur-[180px]" /> {/* Added a subtle crimson glow for dramatic effect */}
      </div>

      {/* ── Background image ── */}
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

      {/* ── Corner diamond decorations ── */}
      <div className="fixed top-[12%] left-6 z-10 text-[#5d1d69]/50">
        <Diamond className="w-5 h-5" />
      </div>
      <div className="fixed top-[12%] right-6 z-10 text-[#546e40]/50">
        <Diamond className="w-5 h-5" />
      </div>
      <div className="fixed bottom-[12%] left-6 z-10 text-[#546e40]/50">
        <Diamond className="w-5 h-5" />
      </div>
      <div className="fixed bottom-[12%] right-6 z-10 text-[#5d1d69]/50">
        <Diamond className="w-5 h-5" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-24 md:py-32">

        {/* Title */}
        <h1
          className="text-5xl sm:text-6xl md:text-8xl font-bold text-center mb-3 tracking-wider drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
        >
          Main Event
        </h1>

        {/* Subtitle / theme */}
        <p className="text-gray-300 italic text-lg md:text-xl tracking-[0.3em] mb-12 text-center uppercase drop-shadow-[0_0_15px_rgba(93,29,105,0.8)]">
          The Forsaken Crown
        </p>

        {/* Main Info Card */}
        <div
          ref={cardRef}
          className="opacity-0 translate-y-8 transition-all duration-700 ease-out w-full max-w-2xl"
        >
          <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md p-7 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {/* Card corner diamonds */}
            <div className="absolute -top-2 -left-2 text-[#5d1d69]/70">
              <Diamond className="w-4 h-4" />
            </div>
            <div className="absolute -top-2 -right-2 text-[#546e40]/70">
              <Diamond className="w-4 h-4" />
            </div>
            <div className="absolute -bottom-2 -left-2 text-[#546e40]/70">
              <Diamond className="w-4 h-4" />
            </div>
            <div className="absolute -bottom-2 -right-2 text-[#5d1d69]/70">
              <Diamond className="w-4 h-4" />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Date */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#5d1d69]/20 border border-[#5d1d69]/30 flex items-center justify-center text-[#9b63a6]">
                  <CalendarIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">Mei 10, 2026</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#5d1d69]/20 border border-[#5d1d69]/30 flex items-center justify-center text-[#9b63a6]">
                  <ClockIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">10:00 – 18:00 WIB</p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#5d1d69]/20 border border-[#5d1d69]/30 flex items-center justify-center text-[#9b63a6]">
                  <MapPinIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Venue</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">Grand Castle Theater</p>
                </div>
              </div>

              {/* Capacity */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#5d1d69]/20 border border-[#5d1d69]/30 flex items-center justify-center text-[#9b63a6]">
                  <UsersIcon />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-base text-gray-100 font-medium tracking-wide">1,500 Attendees</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5d1d69]/50 to-transparent" />
              <Diamond className="text-[#9b63a6]/50 w-2.5 h-2.5" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#546e40]/50 to-transparent" />
            </div>

            {/* About section */}
            <div
              ref={aboutRef}
              className="opacity-0 translate-y-6 transition-all duration-700 ease-out"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="text-[#9b63a6]">
                  <ScrollIcon />
                </div>
                <h2
                  className="text-lg font-bold uppercase tracking-widest text-gray-100"
                  style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
                >
                  The Grand Summit
                </h2>
              </div>
              <div className="space-y-4 pl-1">
                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light">
                  Join us for the culmination of our journey. The Main Event brings together world-class thought leaders, innovators, and storytellers under one magnificent roof to explore the profound implications of "The Forsaken Crown."
                </p>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light">
                  Prepare for a day of immersive experiences, thought-provoking talks, and transformative ideas that will challenge your perspective and ignite your imagination. This is where the scattered pieces of our pre-events unite into a complete masterpiece.
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
          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="relative inline-block group"
          >
            <div className="absolute -inset-2 rounded-full bg-[#5d1d69]/0 group-hover:bg-[#5d1d69]/30 blur-[20px] transition-all duration-700" />
            <span className="relative inline-flex items-center gap-3 px-12 py-5 border border-[#8f4ca0] bg-linear-to-r from-[#5d1d69] via-[#7a2e8a] to-[#9d46b1] text-white text-sm md:text-base font-semibold tracking-[0.2em] uppercase rounded-full transition-all duration-500 shadow-[0_8px_30px_rgba(93,29,105,0.35)] group-hover:from-[#6c2579] group-hover:via-[#8a3aa0] group-hover:to-[#b259c4] group-hover:border-[#b978cb] group-hover:shadow-[0_0_50px_rgba(176,89,196,0.55)] group-hover:-translate-y-0.5">
              Secure Your Throne
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
          <RegistrationForm
            eventKey="main-event"
            onClose={() => setIsRegisterOpen(false)}
            onRegistrationSuccess={(data) => {
              setIsRegisterOpen(false);
              setPaymentTarget({
                registrationId: data.id,
                registrationNumber: data.registrationNumber,
                amount: data.paymentAmount,
              });
            }}
          />
        </div>
      )}

      {paymentTarget && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPaymentTarget(null);
          }}
        >
          <PaymentForm
            registrationId={paymentTarget.registrationId}
            registrationNumber={paymentTarget.registrationNumber}
            amount={paymentTarget.amount}
            onClose={() => setPaymentTarget(null)}
            onSuccess={() => setPaymentTarget(null)}
          />
        </div>
      )}
    </div>
  );
}
