'use client';

import { useEffect, useRef, useState } from 'react';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700', '900'] });

const speakers = [
  {
    name: 'Anindya Dhea',
    topic: 'Personal Growth',
    accent: 'green' as const,
    initial: 'A',
    image: '/images/speakers/Anindya.webp',
  },
  {
    name: 'Bernadette Cyan Gainara',
    topic: 'Social Media',
    accent: 'purple' as const,
    initial: 'B',
    image: '/images/speakers/Bernadette.webp',
  },
  {
    name: 'Robert Ronny',
    topic: 'Art & Entertainment',
    accent: 'green' as const,
    initial: 'R',
    image: '/images/speakers/robert.webp',
  },
  {
    name: 'Daniel Budianto',
    topic: 'Finance',
    accent: 'purple' as const,
    initial: 'D',
    image: '/images/speakers/Daniel.webp',
  },
  {
    name: 'Trisha Maylira',
    topic: 'Public Speaking',
    accent: 'green' as const,
    initial: 'T',
    image: '/images/speakers/trisha.webp',
  },
  {
    name: 'Robby Maulid',
    topic: 'Comedy',
    accent: 'purple' as const,
    initial: 'R',
    image: '/images/speakers/Robby.webp',
  },
  {
    name: 'Reza Erfit',
    topic: 'Artificial Intelligence',
    accent: 'green' as const,
    initial: 'R',
    image: '/images/speakers/reza.webp',
  },
  {
    name: 'Stefani Gabriela',
    topic: 'Mental Health',
    accent: 'purple' as const,
    initial: 'S',
    image: '/images/speakers/stefani.webp',
  },
];

// ─── Scroll-reveal hook ──────────────────────────────────────────────────────

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
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return ref;
}


function Diamond({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={`w-3 h-3 ${className}`} style={style}>
      <path d="M6 0L12 6L6 12L0 6Z" />
    </svg>
  );
}

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`w-2.5 h-2.5 ${className}`}>
      <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" />
    </svg>
  );
}

function OrnateCorner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={`w-8 h-8 md:w-10 md:h-10 ${className}`}>
      <path d="M2 2 L2 15 M2 2 L15 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2" cy="2" r="2" fill="currentColor" opacity="0.6" />
      <path d="M8 8 L8 12 M8 8 L12 8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <circle cx="20" cy="2" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="2" cy="20" r="1" fill="currentColor" opacity="0.3" />
      <path d="M5 2 Q8 5 5 8" stroke="currentColor" strokeWidth="0.6" opacity="0.25" fill="none" />
    </svg>
  );
}



function SpeakerCard({
  speaker,
  index,
}: {
  speaker: (typeof speakers)[0];
  index: number;
}) {
  const ref = useScrollReveal(index * 80);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isGreen = speaker.accent === 'green';
  const accentColor = isGreen ? '#546e40' : '#5d1d69';
  const accentLight = isGreen ? '#6d8a58' : '#8b35a0';
  const accentBg = isGreen ? 'rgba(84, 110, 64, 0.06)' : 'rgba(93, 29, 105, 0.06)';
  const glowColor = isGreen ? 'rgba(84, 110, 64, 0.25)' : 'rgba(93, 29, 105, 0.25)';

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
    >
      <div
        className="relative group cursor-default h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transition: 'transform 0.4s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div
          className="absolute -inset-1 rounded-2xl blur-xl transition-all duration-700"
          style={{
            background: hovered ? glowColor : 'transparent',
            opacity: hovered ? 1 : 0,
          }}
        />

        <div
          className="relative rounded-2xl overflow-hidden h-full flex flex-col"
          style={{
            background: `linear-gradient(145deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%)`,
            border: `1px solid ${hovered ? accentColor + '55' : '#1a1a1a'}`,
            boxShadow: hovered
              ? `0 0 0 1px ${accentColor}22, inset 0 1px 0 ${accentLight}15`
              : `inset 0 1px 0 rgba(255,255,255,0.03)`,
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          <div
            className="h-px w-full transition-all duration-500"
            style={{
              background: hovered
                ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
                : `linear-gradient(90deg, transparent, ${accentColor}33, transparent)`,
            }}
          />

          <div className="absolute top-3 left-3 z-20 transition-all duration-400" style={{ color: accentColor, opacity: hovered ? 0.8 : 0.3 }}>
            <OrnateCorner />
          </div>
          <div className="absolute top-3 right-3 z-20 rotate-90 transition-all duration-400" style={{ color: accentColor, opacity: hovered ? 0.8 : 0.3 }}>
            <OrnateCorner />
          </div>
          <div className="absolute bottom-3 left-3 z-20 -rotate-90 transition-all duration-400" style={{ color: accentColor, opacity: hovered ? 0.8 : 0.3 }}>
            <OrnateCorner />
          </div>
          <div className="absolute bottom-3 right-3 z-20 rotate-180 transition-all duration-400" style={{ color: accentColor, opacity: hovered ? 0.8 : 0.3 }}>
            <OrnateCorner />
          </div>

          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-700"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${accentBg} 0%, transparent 70%)`,
              opacity: hovered ? 1 : 0,
            }}
          />

          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '3 / 4', flexShrink: 0 }}
          >
            {speaker.image && !imgError ? (
              <>
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  onError={() => setImgError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                    transition: 'transform 0.6s ease',
                    transform: hovered ? 'scale(1.04)' : 'scale(1)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 45%, #0a0a0a 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to bottom, ${accentColor}20, transparent 60%)`,
                    opacity: hovered ? 1 : 0.5,
                    transition: 'opacity 0.5s ease',
                  }}
                />
              </>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `radial-gradient(circle at 40% 30%, ${accentLight}12, ${accentColor}06)`,
                  borderBottom: `1px solid ${accentColor}20`,
                }}
              >
                <span
                  className={cinzel.className}
                  style={{
                    fontSize: 'clamp(4rem, 8vw, 6rem)',
                    fontWeight: 900,
                    color: accentLight,
                    opacity: 0.25,
                    letterSpacing: '-0.02em',
                    userSelect: 'none',
                  }}
                >
                  {speaker.initial}
                </span>
              </div>
            )}

          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-5 py-5 flex-1">

            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 transition-all duration-300"
              style={{
                background: hovered ? `${accentColor}20` : `${accentColor}10`,
                border: `1px solid ${accentColor}${hovered ? '50' : '25'}`,
              }}
            >
              <Diamond
                className="w-1.5 h-1.5"
                style={{ color: accentLight } as React.CSSProperties}
              />
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-semibold"
                style={{ color: accentLight }}
              >
                {speaker.topic}
              </span>
            </div>

            <h3
              className={`${cinzel.className} text-white text-lg md:text-xl font-bold leading-tight mb-3 transition-all duration-300`}
              style={{
                textShadow: hovered ? `0 0 20px ${accentColor}40` : 'none',
              }}
            >
              {speaker.name}
            </h3>

            <div className="flex items-center gap-2 mb-3 w-full justify-center">
              <div
                className="h-px flex-1 max-w-[40px] transition-all duration-500"
                style={{ background: `linear-gradient(to right, transparent, ${accentColor}${hovered ? '60' : '30'})` }}
              />
              <Diamond className="w-1.5 h-1.5" style={{ color: `${accentColor}${hovered ? 'aa' : '50'}` }} />
              <div
                className="h-px flex-1 max-w-[40px] transition-all duration-500"
                style={{ background: `linear-gradient(to left, transparent, ${accentColor}${hovered ? '60' : '30'})` }}
              />
            </div>

            
          </div>

          <div
            className="h-px w-full transition-all duration-500"
            style={{
              background: hovered
                ? `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
                : `linear-gradient(90deg, transparent, ${accentColor}22, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}


export default function SchedulePage() {
  const titleRef = useScrollReveal(0);
  const subtitleRef = useScrollReveal(150);
  const gridRef = useScrollReveal(300);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <style>{`
        .revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[5%] left-[-10%] w-[700px] h-[600px] bg-[#546e40]/5 rounded-full blur-[220px]" />
        <div className="absolute top-[40%] right-[-15%] w-[600px] h-[700px] bg-[#5d1d69]/5 rounded-full blur-[220px]" />
        <div className="absolute bottom-[5%] left-[20%] w-[500px] h-[400px] bg-[#546e40]/4 rounded-full blur-[180px]" />
        <div className="absolute top-[70%] right-[10%] w-[400px] h-[400px] bg-[#5d1d69]/4 rounded-full blur-[180px]" />
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-1">
        <Sparkle className="absolute top-[8%] left-[12%] text-[#546e40]/20 animate-pulse" />
        <Sparkle className="absolute top-[20%] right-[8%] text-[#5d1d69]/25 animate-pulse [animation-delay:1.5s]" />
        <Sparkle className="absolute top-[45%] left-[5%] text-[#546e40]/15 animate-pulse [animation-delay:0.8s]" />
        <Sparkle className="absolute top-[65%] right-[15%] text-[#5d1d69]/20 animate-pulse [animation-delay:2.2s]" />
        <Sparkle className="absolute top-[82%] left-[28%] text-[#6d8a58]/18 animate-pulse [animation-delay:3s]" />
        <Sparkle className="absolute top-[15%] left-[48%] text-[#5d1d69]/12 animate-pulse [animation-delay:4s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40">

        <div className="text-center mb-16 md:mb-24">
          <div ref={titleRef} className="opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#546e40]/60" />
              <div className="flex items-center gap-2">
                <Diamond className="w-2 h-2 text-[#546e40]/50" />
                <Diamond className="w-1.5 h-1.5 text-[#5d1d69]/40 [animation-delay:0.5s]" />
              </div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#5d1d69]/60" />
            </div>

            <p className="text-[11px] tracking-[0.5em] uppercase text-[#6d8a58] font-semibold mb-4">
              TEDx Universitas Ciputra 2026
            </p>
            <h1
              className={`${cinzel.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-4`}
              style={{ textShadow: '0 0 60px rgba(255,255,255,0.06)' }}
            >
              The Hall of
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #6d8a58 0%, #8ab385 50%, #546e40 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(84,110,64,0.4))',
                }}
              >
                Speakers
              </span>
            </h1>
          </div>

          <div ref={subtitleRef} className="opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <p className="text-gray-500 italic tracking-[0.3em] text-sm md:text-base uppercase mt-4">
              Voices that challenge, inspire, and ignite
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-28 bg-gradient-to-r from-transparent via-[#546e40]/40 to-transparent" />
              <Diamond className="w-2 h-2 text-[#5d1d69]/50" />
              <div className="h-px w-28 bg-gradient-to-l from-transparent via-[#5d1d69]/40 to-transparent" />
            </div>
          </div>
        </div>

        <div ref={gridRef} className="opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {speakers.map((speaker, index) => (
              <SpeakerCard key={speaker.name} speaker={speaker} index={index} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center mt-20 md:mt-28 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#546e40]/40" />
            <div className="flex items-center gap-2">
              <Diamond className="w-1.5 h-1.5 text-[#546e40]/40 animate-pulse" />
              <Diamond className="w-2.5 h-2.5 text-[#5d1d69]/50 animate-pulse [animation-delay:0.5s]" />
              <Diamond className="w-1.5 h-1.5 text-[#546e40]/40 animate-pulse [animation-delay:1s]" />
            </div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#5d1d69]/40" />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#333] text-center">
            Main Event · May 10, 2026 · Universitas Ciputra Surabaya
          </p>
        </div>
      </div>
    </div>
  );
}
