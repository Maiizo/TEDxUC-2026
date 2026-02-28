"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════
   SVG ICONS
   ══════════════════════════════════════════ */

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={`w-3 h-3 ${className}`}>
      <path d="M6 0L12 6L6 12L0 6Z" />
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`w-2.5 h-2.5 ${className}`}>
      <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" />
    </svg>
  );
}

function CrownIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M12 44L8 20L20 30L32 16L44 30L56 20L52 44H12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 44H52V48H12V44Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="32" cy="16" r="3" fill="currentColor" />
      <circle cx="8" cy="20" r="2.5" fill="currentColor" />
      <circle cx="56" cy="20" r="2.5" fill="currentColor" />
    </svg>
  );
}

function AttendeesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="16" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 36C6 28.268 10.268 24 16 24" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M42 36C42 28.268 37.732 24 32 24" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="18" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 40C12 31.163 17.373 26 24 26C30.627 26 36 31.163 36 40" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SpeakersIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 42C10 32.059 16.268 26 24 26C31.732 26 38 32.059 38 42" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 8L24 2L30 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PerformancesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="6" y="10" width="36" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 18L32 22L20 26V18Z" fill="currentColor" />
      <path d="M14 38H34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 34V38" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PhotosIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="4" y="10" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="6" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="28" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 30L20 22L26 28L32 22L44 30" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Thorn Vine decoration ── */
function ThornVine({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 800"
      fill="none"
      className={`${className} ${flip ? "scale-x-[-1]" : ""}`}
    >
      <path
        d="M60 0C60 0 40 80 50 160C60 240 30 280 40 360C50 440 20 500 30 580C40 660 20 720 30 800"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      <path d="M50 120L35 112L45 135" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <path d="M35 300L20 295L30 315" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <path d="M25 500L10 492L20 512" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
      <ellipse cx="45" cy="200" rx="14" ry="5" transform="rotate(-25 45 200)" fill="currentColor" opacity="0.05" />
      <ellipse cx="30" cy="420" rx="12" ry="4" transform="rotate(20 30 420)" fill="currentColor" opacity="0.04" />
      <ellipse cx="25" cy="650" rx="15" ry="5" transform="rotate(-15 25 650)" fill="currentColor" opacity="0.05" />
    </svg>
  );
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
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return ref;
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return { ref, count };
}

/* ══════════════════════════════════════════
   DATA
   ══════════════════════════════════════════ */

interface Speaker {
  name: string;
  title: string;
  description: string;
}

const speakers: Speaker[] = [
  { name: "Dr. Sarah Mitchell", title: "The Science of Consciousness", description: "Neuroscientist exploring the mysteries of human awareness." },
  { name: "James Rodriguez", title: "Innovation in Crisis", description: "Tech entrepreneur who built solutions during the pandemic." },
  { name: "Maya Patel", title: "Art as Revolution", description: "Artist and activist using creativity to drive social change." },
  { name: "Dr. Kevin Tanaka", title: "Sustainable Cities of Tomorrow", description: "Urban planner reimagining green metropolitan spaces." },
  { name: "Lisa Chen", title: "The Future of Education", description: "EdTech pioneer transforming exciting learning experiences." },
  { name: "Marcus Thompson", title: "Breaking Mental Barriers", description: "Performance coach helping people unlock their potential." },
  { name: "Dr. Amira Hassan", title: "Health Tech Revolution", description: "Medical inventor advancing accessible healthcare." },
  { name: "David Park", title: "The Power of Storytelling", description: "Filmmaker and author capturing human stories." },
];

const highlightData = [
  { icon: <AttendeesIcon className="w-9 h-9 md:w-11 md:h-11" />, value: 100, display: "100", label: "Attendees" },
  { icon: <SpeakersIcon className="w-9 h-9 md:w-11 md:h-11" />, value: 8, display: "8", label: "Speakers" },
  { icon: <PerformancesIcon className="w-9 h-9 md:w-11 md:h-11" />, value: 2, display: "2", label: "Performances" },
  { icon: <PhotosIcon className="w-9 h-9 md:w-11 md:h-11" />, value: 100, display: "100+", label: "Photos Captured" },
];

/* ══════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════ */

function HighlightCard({ item, index }: { item: typeof highlightData[0]; index: number }) {
  const isPlus = item.display.includes("+");
  const { ref, count } = useCountUp(item.value, 1200);
  const accents = [
    "text-(--maleficent-green)",
    "text-(--maleficent-purple)",
    "text-(--maleficent-green)",
    "text-(--acid-green)",
  ];
  const borderAccents = [
    "border-(--maleficent-green)/25 hover:border-(--maleficent-green)/50",
    "border-(--maleficent-purple)/25 hover:border-(--maleficent-purple)/50",
    "border-(--maleficent-green)/25 hover:border-(--maleficent-green)/50",
    "border-(--acid-green)/25 hover:border-(--acid-green)/50",
  ];

  return (
    <div
      ref={ref}
      className={`relative rounded-xl border bg-linear-to-b from-[#0d1a0a]/50 to-(--deep-black) p-5 md:p-7 text-center group transition-all duration-500 hover:scale-105 ${borderAccents[index]}`}
    >
      {/* Glow on hover */}
      <div className={`absolute -inset-3 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
        index === 1 ? "bg-(--maleficent-purple)/6" : index === 3 ? "bg-(--acid-green)/6" : "bg-(--maleficent-green)/6"
      }`} />

      <div className="relative">
        <div className={`flex justify-center mb-3 ${accents[index]} opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`}>
          {item.icon}
        </div>
        <p
          className="text-3xl md:text-4xl font-bold mb-1"
          style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
        >
          {count}{isPlus ? "+" : ""}
        </p>
        <p className="text-[0.65rem] md:text-xs text-gray-500 uppercase tracking-widest">
          {item.label}
        </p>
      </div>
    </div>
  );
}

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const ref = useScrollReveal(index * 100);
  const isEven = index % 2 === 0;
  const accent = isEven ? "maleficent-green" : "maleficent-purple";

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-8 transition-all duration-700 ease-out group"
    >
      {/* Photo placeholder with themed overlay */}
      <div className={`relative aspect-3/4 rounded-xl overflow-hidden mb-3 border border-gray-800/40 group-hover:border-(--${accent})/40 transition-colors duration-500`}>
        {/* Gradient fill */}
        <div className={`absolute inset-0 bg-linear-to-b ${
          isEven
            ? "from-[#0d1a0a]/80 to-(--deep-black)"
            : "from-[#1a0d1f]/80 to-(--deep-black)"
        }`} />

        {/* Silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14 text-gray-700/60 group-hover:text-gray-600/80 transition-colors duration-500">
            <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 42C10 32 16 26 24 26C32 26 38 32 38 42" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Corner glow on hover */}
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-(--${accent})/15`} />
      </div>

      {/* Name */}
      <h4
        className={`text-xs md:text-sm font-bold uppercase tracking-wide mb-0.5 text-(--${accent}) group-hover:tracking-wider transition-all duration-500`}
        style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
      >
        {speaker.name}
      </h4>
      <p className="text-[0.65rem] md:text-xs text-gray-400 italic mb-1">{speaker.title}</p>
      <p className="text-[0.6rem] md:text-xs text-gray-500/80 leading-relaxed">{speaker.description}</p>
    </div>
  );
}

/* ══════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════ */

export default function PastEventPage() {
  const heroRef = useScrollReveal();
  const aboutRef = useScrollReveal(100);
  const themeRef = useScrollReveal(100);
  const galleryTitleRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-(--void-black) text-white overflow-x-hidden">
      {/* ── Global animations ── */}
      <style jsx global>{`
        .revealed {
          opacity: 1 !important;
          transform: translateY(0) rotate(0) !important;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(84, 110, 64, 0.2); }
          50% { border-color: rgba(84, 110, 64, 0.45); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .animate-pulse-border { animation: pulse-border 3s ease-in-out infinite; }
      `}</style>

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[3%] left-[2%] w-125 h-100 bg-(--maleficent-green)/4 rounded-full blur-[180px]" />
        <div className="absolute top-[25%] right-[-3%] w-100 h-125 bg-(--maleficent-purple)/5 rounded-full blur-[200px]" />
        <div className="absolute top-[55%] left-[-5%] w-100 h-100 bg-(--maleficent-purple)/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-[5%] right-[10%] w-125 h-100 bg-(--maleficent-green)/3 rounded-full blur-[200px]" />
      </div>

      {/* ── Vine decorations (desktop) ── */}
      <div className="hidden lg:block fixed top-0 left-0 w-20 h-full pointer-events-none text-(--maleficent-green)">
        <ThornVine className="w-full h-full" />
      </div>
      <div className="hidden lg:block fixed top-0 right-0 w-20 h-full pointer-events-none text-(--maleficent-purple)">
        <ThornVine className="w-full h-full" flip />
      </div>

      {/* ── Floating sparkles ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Sparkle className="absolute top-[8%] left-[12%] text-(--maleficent-green)/20 animate-pulse" />
        <Sparkle className="absolute top-[22%] right-[8%] text-(--maleficent-purple)/25 animate-pulse [animation-delay:1.5s]" />
        <Sparkle className="absolute top-[45%] left-[6%] text-(--maleficent-green)/15 animate-pulse [animation-delay:0.8s]" />
        <Sparkle className="absolute top-[65%] right-[15%] text-(--maleficent-purple)/20 animate-pulse [animation-delay:2.2s]" />
        <Sparkle className="absolute top-[80%] left-[25%] text-(--maleficent-green)/18 animate-pulse [animation-delay:3s]" />
      </div>

      {/* ═══════════════════════════════════
          HEADER
          ═══════════════════════════════════ */}
      <section className="relative pt-24 pb-10 md:pt-36 md:pb-16 px-6 md:px-12 lg:px-20">
        <div
          ref={heroRef}
          className="max-w-7xl mx-auto opacity-0 translate-y-10 transition-all duration-1000 ease-out"
        >
          {/* Crown */}
          <div className="flex justify-center mb-5 text-(--maleficent-green) animate-float">
            <CrownIcon className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_25px_rgba(84,110,64,0.4)]" />
          </div>

          {/* Title — centered */}
          <div className="text-center">
            <h1
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider leading-[1.05]"
              style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
            >
              <span className="text-white/90">TEDxUC </span>
              <span className="text-(--maleficent-green) drop-shadow-[0_0_30px_rgba(84,110,64,0.4)]">
                Surabaya
              </span>
              <br />
              <span className="text-(--maleficent-purple)/80 text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                2025
              </span>
            </h1>
          </div>

          {/* Subtitle + meta */}
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-sm md:text-lg text-gray-400 italic tracking-widest mb-4">
              The Awakening
            </p>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="w-8 h-px bg-(--maleficent-purple)/40" />
              <Diamond className="text-(--maleficent-purple)/40 w-1.5 h-1.5" />
              <div className="w-24 h-px bg-linear-to-l from-(--maleficent-green)/40 to-transparent" />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 6H14" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5 1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M11 1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                March 20, 2025
              </span>
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <path d="M8 1C4.686 1 2 3.686 2 7C2 11.5 8 15 8 15C8 15 14 11.5 14 7C14 3.686 11.314 1 8 1Z" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                Grand Auditorium, UC Surabaya
              </span>
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 14C2 11.238 3.79 9 6 9" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="11" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M14 14C14 11.791 12.657 10 11 10" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                500+ Attendees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          ABOUT THE EVENT — asymmetric layout
          ═══════════════════════════════════ */}
      <section className="relative py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Left decorative column */}
            <div className="hidden md:flex flex-col items-center gap-3 pt-6 min-w-8">
              <div className="w-px h-12 bg-linear-to-b from-transparent to-(--maleficent-green)/40" />
              <Diamond className="text-(--maleficent-green)/40 w-2 h-2 animate-pulse" />
              <div className="w-px h-20 bg-(--maleficent-green)/20" />
              <Diamond className="text-(--maleficent-purple)/40 w-2 h-2 animate-pulse [animation-delay:1s]" />
              <div className="w-px h-12 bg-linear-to-b from-(--maleficent-purple)/25 to-transparent" />
            </div>

            {/* Content card */}
            <div
              ref={aboutRef}
              className="flex-1 opacity-0 translate-y-8 transition-all duration-800 ease-out"
            >
              <div className="relative rounded-2xl border border-(--maleficent-green)/25 bg-linear-to-br from-[#0d1a0a]/70 via-(--deep-black) to-[#0f0a14]/30 p-7 md:p-10 animate-pulse-border">
                {/* Corner diamonds */}
                <Diamond className="absolute -top-1.5 -left-1.5 text-(--maleficent-green)/40" />
                <Diamond className="absolute -top-1.5 -right-1.5 text-(--maleficent-purple)/40" />
                <Diamond className="absolute -bottom-1.5 -left-1.5 text-(--maleficent-purple)/40" />
                <Diamond className="absolute -bottom-1.5 -right-1.5 text-(--maleficent-green)/40" />

                <h2
                  className="text-xl md:text-3xl font-bold uppercase tracking-wider mb-5"
                  style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
                >
                  About The{" "}
                  <span className="text-(--maleficent-green)">Event</span>
                </h2>

                <div className="space-y-4 text-sm md:text-base text-gray-400 leading-relaxed">
                  <p>
                    TEDxUC Surabaya 2025 was a groundbreaking event that brought together
                    some of the most inspiring minds from diverse fields — science,
                    technology, arts, and social innovation.
                  </p>
                  <p>
                    The event featured thought-provoking talks, captivating performances,
                    and meaningful conversations that{" "}
                    <span className="text-(--maleficent-purple) italic">
                      challenged perspectives
                    </span>{" "}
                    and ignited new ideas among attendees.
                  </p>
                  <p>
                    Held at the Grand Auditorium of Universitas Ciputra Surabaya, the event
                    gathered over 500 attendees for an unforgettable day of inspiration and
                    connection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          EVENT HIGHLIGHTS — with count-up
          ═══════════════════════════════════ */}
      <section className="relative py-12 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center md:text-left mb-10 md:mb-14">
            <h2
              className="text-2xl md:text-4xl font-bold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
            >
              Event{" "}
              <span className="text-(--maleficent-green)">Highlights</span>
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
              <div className="w-16 h-px bg-(--maleficent-green)/40" />
              <Diamond className="text-(--maleficent-green)/50 w-1.5 h-1.5" />
              <div className="w-8 h-px bg-(--maleficent-purple)/30" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {highlightData.map((item, i) => (
              <HighlightCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          THEME — dramatic centered card
          ═══════════════════════════════════ */}
      <section className="relative py-12 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div
            ref={themeRef}
            className="opacity-0 translate-y-8 transition-all duration-800 ease-out"
          >
            <div className="relative rounded-2xl border border-(--maleficent-purple)/25 bg-linear-to-b from-[#12081a]/60 via-(--deep-black) to-[#0d1a0a]/30 p-8 md:p-12 text-center overflow-hidden">
              {/* Purple glow behind */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-(--maleficent-purple)/8 rounded-full blur-3xl" />

              <Diamond className="absolute -top-1.5 -left-1.5 text-(--maleficent-purple)/40" />
              <Diamond className="absolute -top-1.5 -right-1.5 text-(--maleficent-purple)/40" />
              <Diamond className="absolute -bottom-1.5 -left-1.5 text-(--maleficent-green)/40" />
              <Diamond className="absolute -bottom-1.5 -right-1.5 text-(--maleficent-green)/40" />

              <h2
                className="relative text-xl md:text-3xl font-bold uppercase tracking-[0.15em] mb-5"
                style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
              >
                <span className="text-(--maleficent-purple)">Theme:</span>
              </h2>
              <p className="relative text-sm md:text-lg text-gray-300/80 leading-relaxed italic max-w-2xl mx-auto">
                A journey into consciousness, innovation, and the power of transformative ideas
                that challenge the status quo and{" "}
                <span className="text-(--maleficent-green) not-italic font-medium">
                  awaken the potential
                </span>{" "}
                within each of us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          OUR SPEAKERS — staggered grid
          ═══════════════════════════════════ */}
      <section className="relative py-12 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Title — right aligned on desktop */}
          <div className="text-center md:text-right mb-10 md:mb-14 md:pr-4">
            <h2
              className="text-2xl md:text-4xl font-bold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
            >
              Our{" "}
              <span className="text-(--maleficent-purple)">Speakers</span>
            </h2>
            <div className="flex items-center justify-center md:justify-end gap-2 mt-3">
              <div className="w-8 h-px bg-(--maleficent-green)/30" />
              <Diamond className="text-(--maleficent-purple)/50 w-1.5 h-1.5" />
              <div className="w-16 h-px bg-(--maleficent-purple)/40" />
            </div>
          </div>

          {/* Top 4 — shifted left on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7 md:mr-12 lg:mr-20">
            {speakers.slice(0, 4).map((speaker, i) => (
              <SpeakerCard key={i} speaker={speaker} index={i} />
            ))}
          </div>
          {/* Bottom 4 — shifted right on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7 mt-6 md:mt-10 md:ml-12 lg:ml-20">
            {speakers.slice(4, 8).map((speaker, i) => (
              <SpeakerCard key={i + 4} speaker={speaker} index={i + 4} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          EVENT GALLERY — masonry-like
          ═══════════════════════════════════ */}
      <section className="relative py-12 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div
            ref={galleryTitleRef}
            className="text-center mb-10 md:mb-14 opacity-0 translate-y-6 transition-all duration-700"
          >
            <h2
              className="text-2xl md:text-4xl font-bold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
            >
              Event{" "}
              <span className="text-(--acid-green)">Gallery</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-12 h-px bg-(--maleficent-green)/40" />
              <Diamond className="text-(--acid-green)/50 w-1.5 h-1.5" />
              <Diamond className="text-(--maleficent-purple)/40 w-1.5 h-1.5" />
              <div className="w-12 h-px bg-(--maleficent-purple)/40" />
            </div>
          </div>

          {/* Uniform 4-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => {
              const accent = i % 3 === 0 ? "maleficent-green" : i % 3 === 1 ? "maleficent-purple" : "acid-green";

              return (
                <div
                  key={i}
                  className={`relative aspect-4/3 rounded-xl overflow-hidden border border-gray-800/30 group hover:border-(--${accent})/30 transition-all duration-500`}
                >
                  {/* Themed gradient background */}
                  <div className={`absolute inset-0 bg-linear-to-br ${
                    i % 3 === 0
                      ? "from-[#0d1a0a]/60 to-(--deep-black)"
                      : i % 3 === 1
                        ? "from-[#12081a]/50 to-(--deep-black)"
                        : "from-[#0a120a]/50 to-(--deep-black)"
                  }`} />

                  {/* Subtle image icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 text-gray-600">
                      <rect x="4" y="8" width="40" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="16" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 34L16 24L24 30L34 20L44 28" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Hover glow */}
                  <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-(--${accent})/15`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER / BACK
          ═══════════════════════════════════ */}
      <section className="relative py-12 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex-1 max-w-40 h-px bg-linear-to-r from-transparent via-(--maleficent-green)/20 to-(--maleficent-green)/40" />
            <CrownIcon className="w-8 h-8 md:w-10 md:h-10 text-(--maleficent-green)/30 animate-float" />
            <div className="flex-1 max-w-40 h-px bg-linear-to-l from-transparent via-(--maleficent-purple)/20 to-(--maleficent-purple)/40" />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-5 italic">
              Relive the moments that defined TEDxUC Surabaya 2025.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-(--acid-green) transition-colors duration-300 group"
            >
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="rotate-180 group-hover:-translate-x-1 transition-transform duration-300"
              >
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
