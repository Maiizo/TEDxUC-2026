"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* ── SVG Icons ── */

function CrownIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M12 44L8 20L20 30L32 16L44 30L56 20L52 44H12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 44H52V48H12V44Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="32" cy="16" r="3" fill="currentColor" />
      <circle cx="8" cy="20" r="2.5" fill="currentColor" />
      <circle cx="56" cy="20" r="2.5" fill="currentColor" />
      <circle cx="20" cy="30" r="2" fill="currentColor" />
      <circle cx="44" cy="30" r="2" fill="currentColor" />
    </svg>
  );
}

function GlobeIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="24" cy="24" rx="10" ry="18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 24H42" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 14H38" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 34H38" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 6V42" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ConnectedIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="16" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="34" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="34" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 14H27" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 19V29" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 19V29" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 34H27" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 18L28 30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M28 18L20 30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function SmallCrownIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M10 34L7 16L16 24L24 12L32 24L41 16L38 34H10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 34H38V37H10V34Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="24" cy="12" r="2" fill="currentColor" />
      <circle cx="7" cy="16" r="1.5" fill="currentColor" />
      <circle cx="41" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={`w-3 h-3 ${className}`}>
      <path d="M6 0L12 6L6 12L0 6Z" />
    </svg>
  );
}

/* ── Thorn / Vine SVG decoration ── */

function ThornVine({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 600"
      fill="none"
      className={`${className} ${flip ? "scale-x-[-1]" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 0C100 0 80 60 90 120C100 180 60 200 70 260C80 320 40 360 50 420C60 480 30 520 40 580V600"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
      {/* thorns */}
      <path d="M90 80L75 70L85 90" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <path d="M70 200L55 195L65 210" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M60 320L45 310L55 330" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <path d="M50 440L35 435L45 450" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      {/* leaves */}
      <ellipse cx="80" cy="150" rx="12" ry="5" transform="rotate(-30 80 150)" fill="currentColor" opacity="0.08" />
      <ellipse cx="65" cy="280" rx="10" ry="4" transform="rotate(20 65 280)" fill="currentColor" opacity="0.06" />
      <ellipse cx="50" cy="500" rx="14" ry="5" transform="rotate(-15 50 500)" fill="currentColor" opacity="0.07" />
    </svg>
  );
}

/* ── Intersection Observer hook for scroll animations ── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ── Card Component ── */

interface CardData {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  accent: "green" | "purple" | "mixed";
}

function AboutCard({
  card,
  offsetClass,
  delay,
}: {
  card: CardData;
  offsetClass: string;
  delay: string;
}) {
  const ref = useScrollReveal();

  const accentBorder =
    card.accent === "purple"
      ? "from-(--maleficent-purple) via-(--dark-purple)/40 to-(--maleficent-purple)/20"
      : card.accent === "mixed"
        ? "from-(--maleficent-green) via-(--maleficent-purple)/30 to-(--maleficent-green)/20"
        : "from-(--maleficent-green) via-(--dark-green)/40 to-(--maleficent-green)/20";

  const accentIcon =
    card.accent === "purple"
      ? "text-(--maleficent-purple)"
      : card.accent === "mixed"
        ? "text-(--acid-green)"
        : "text-(--maleficent-green)";

  const diamondColor =
    card.accent === "purple"
      ? "text-(--maleficent-purple)/60"
      : "text-(--maleficent-green)/60";

  const bulletColor =
    card.accent === "purple"
      ? "text-(--maleficent-purple)/70"
      : "text-(--maleficent-green)/70";

  const dividerColor =
    card.accent === "purple"
      ? "bg-(--maleficent-purple)/40"
      : card.accent === "mixed"
        ? "bg-(--acid-green)/40"
        : "bg-(--maleficent-green)/40";

  return (
    <div
      ref={ref}
      className={`relative group opacity-0 translate-y-10 transition-all duration-700 ease-out ${offsetClass}`}
      style={{ transitionDelay: delay }}
    >
      {/* Glow aura behind card */}
      <div
        className={`absolute -inset-4 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
          card.accent === "purple"
            ? "bg-(--maleficent-purple)/8"
            : card.accent === "mixed"
              ? "bg-(--acid-green)/6"
              : "bg-(--maleficent-green)/8"
        }`}
      />

      {/* Card border gradient */}
      <div
        className={`absolute -inset-px rounded-2xl bg-linear-to-b ${accentBorder} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Card body */}
      <div className="relative bg-linear-to-b from-[#0d1a0a]/90 to-(--deep-black) rounded-2xl p-6 md:p-8 flex flex-col backdrop-blur-sm">
        {/* Corner diamonds */}
        <Diamond className={`absolute top-3 left-3 ${diamondColor}`} />
        <Diamond className={`absolute top-3 right-3 ${diamondColor}`} />
        <Diamond className={`absolute bottom-3 left-3 ${diamondColor}`} />
        <Diamond className={`absolute bottom-3 right-3 ${diamondColor}`} />

        {/* Animated icon */}
        <div className={`flex justify-center mb-5 ${accentIcon} group-hover:scale-110 transition-transform duration-500`}>
          {card.icon}
        </div>

        {/* Title */}
        <h3
          className="text-xl md:text-2xl font-bold uppercase tracking-wider text-center mb-4 group-hover:tracking-[0.2em] transition-all duration-500"
          style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
        >
          {card.title}
        </h3>

        {/* Divider — grows on hover */}
        <div className={`w-12 group-hover:w-20 h-px ${dividerColor} mx-auto mb-4 transition-all duration-500`} />

        {/* Description */}
        <p className="text-sm text-gray-400 text-center leading-relaxed mb-6">
          {card.description}
        </p>

        {/* Bullet points */}
        <ul className="space-y-3 mt-auto">
          {card.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-xs md:text-sm text-gray-400/90"
            >
              <Diamond className={`w-2 h-2 min-w-2 mt-1 ${bulletColor}`} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Page Data ── */

const cards: CardData[] = [
  {
    icon: <GlobeIcon className="w-11 h-11 md:w-14 md:h-14" />,
    title: "TED",
    accent: "green",
    description:
      "A nonprofit organization devoted to spreading ideas, usually in the form of short, powerful talks.",
    bullets: [
      "Global organization founded in 1984",
      "Invitation-only conference",
      "World-renowned speakers",
      "Talks available on TED.com",
    ],
  },
  {
    icon: <ConnectedIcon className="w-11 h-11 md:w-14 md:h-14" />,
    title: "TEDx",
    accent: "purple",
    description:
      "A program of local, self-organized events that bring people together to share a TED-like experience.",
    bullets: [
      "Independently organized events",
      "Licensed by TED",
      "Local speakers and talent",
      "Held worldwide in communities",
    ],
  },
  {
    icon: <SmallCrownIcon className="w-11 h-11 md:w-14 md:h-14" />,
    title: "TEDxUC",
    accent: "mixed",
    description:
      "Our independently organized TEDx event in Surabaya, Indonesia.",
    bullets: [
      "Based in Universitas Ciputra",
      'Theme: "The Forsaken Crown"',
      "Local and international speakers",
      "Student-run organization",
    ],
  },
];

/* ── Page Component ── */

export default function AboutTedPage() {
  const headerRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-(--void-black) text-white overflow-x-hidden">
      {/* ── Global CSS for scroll-reveal ── */}
      <style jsx global>{`
        .animate-revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.08; }
        }
        @keyframes crawl {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-flicker {
          animation: flicker 3s ease-in-out infinite;
        }
      `}</style>

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[5%] w-125 h-125 bg-(--maleficent-green)/4 rounded-full blur-[160px]" />
        <div className="absolute top-[30%] right-[0%] w-100 h-150 bg-(--maleficent-purple)/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-[5%] left-[30%] w-125 h-100 bg-(--maleficent-green)/3 rounded-full blur-[200px]" />
        <div className="absolute top-[60%] left-[-5%] w-75 h-100 bg-(--maleficent-purple)/4 rounded-full blur-[150px]" />
      </div>

      {/* ── Thorn vines on sides (desktop only) ── */}
      <div className="hidden lg:block fixed top-0 left-0 w-24 h-full pointer-events-none text-(--maleficent-green)">
        <ThornVine className="w-full h-full" />
      </div>
      <div className="hidden lg:block fixed top-0 right-0 w-24 h-full pointer-events-none text-(--maleficent-purple)">
        <ThornVine className="w-full h-full" flip />
      </div>

      {/* ===== HEADER ===== */}
      <section className="relative pt-24 pb-8 md:pt-36 md:pb-12 px-6">
        <div
          ref={headerRef}
          className="max-w-6xl mx-auto opacity-0 translate-y-10 transition-all duration-1000 ease-out"
        >
          {/* Crown — floating */}
          <div className="flex justify-center mb-6 text-(--maleficent-green) animate-float">
            <CrownIcon className="w-16 h-16 md:w-24 md:h-24 drop-shadow-[0_0_20px_rgba(84,110,64,0.4)]" />
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 md:w-40 h-px bg-linear-to-r from-transparent via-(--maleficent-green)/30 to-(--maleficent-green)/60" />
            <Diamond className="text-(--maleficent-green) w-2.5 h-2.5" />
            <Diamond className="text-(--maleficent-purple) w-2 h-2" />
            <Diamond className="text-(--maleficent-green) w-2.5 h-2.5" />
            <div className="w-16 md:w-40 h-px bg-linear-to-l from-transparent via-(--maleficent-green)/30 to-(--maleficent-green)/60" />
          </div>

          {/* Title — left-leaning on desktop */}
          <div className="text-center md:text-left md:pl-8 lg:pl-16">
            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider leading-[1.05]"
              style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
            >
              <span className="text-white">About </span>
              <span className="text-(--maleficent-green) drop-shadow-[0_0_30px_rgba(84,110,64,0.5)]">
                TED
              </span>
            </h1>
          </div>

          {/* Subtitle — offset to the right */}
          <div className="text-center md:text-right md:pr-8 lg:pr-16 mt-3 md:mt-4">
            <p className="text-sm md:text-lg text-gray-500 italic tracking-widest">
              Understanding the Difference
            </p>
            <div className="flex items-center justify-center md:justify-end gap-2 mt-2">
              <div className="w-8 h-px bg-(--maleficent-purple)/40" />
              <Diamond className="text-(--maleficent-purple)/50 w-1.5 h-1.5" />
              <div className="w-20 h-px bg-(--maleficent-purple)/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARDS — staggered asymmetric layout ===== */}
      <section className="relative py-12 md:py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Desktop: 3 columns, staggered vertically. Mobile: stacked */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10 items-start">
            {/* Card 1 — TED: pushed up-left */}
            <AboutCard
              card={cards[0]}
              offsetClass="md:mt-0 md:-rotate-1"
              delay="0ms"
            />

            {/* Card 2 — TEDx: pushed down-center, slightly rotated */}
            <AboutCard
              card={cards[1]}
              offsetClass="md:mt-16 md:rotate-1"
              delay="200ms"
            />

            {/* Card 3 — TEDxUC: offset higher-right */}
            <AboutCard
              card={cards[2]}
              offsetClass="md:mt-6 md:-rotate-0.5"
              delay="400ms"
            />
          </div>
        </div>
      </section>

      {/* ===== CONNECTING NARRATIVE ===== */}
      <section className="relative py-10 md:py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16">
            {/* Left: decorative column */}
            <div className="hidden md:flex flex-col items-center gap-4 pt-4">
              <div className="w-px h-16 bg-linear-to-b from-transparent to-(--maleficent-green)/40" />
              <Diamond className="text-(--maleficent-green)/40 w-2 h-2 animate-pulse" />
              <div className="w-px h-24 bg-(--maleficent-green)/20" />
              <Diamond className="text-(--maleficent-purple)/40 w-2 h-2 animate-pulse [animation-delay:1s]" />
              <div className="w-px h-16 bg-linear-to-b from-(--maleficent-purple)/30 to-transparent" />
            </div>

            {/* Right: text content, not centered */}
            <div className="flex-1">
              <h2
                className="text-xl md:text-3xl font-bold uppercase tracking-wider mb-6 text-left"
                style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
              >
                From Global Stage to{" "}
                <span className="text-(--maleficent-green)">Local Roots</span>
              </h2>
              <div className="space-y-4 text-sm md:text-base text-gray-500 leading-relaxed max-w-3xl">
                <p>
                  TED began in 1984 as a conference where Technology, Entertainment, and Design
                  converged. Today it spans across the globe — and through TEDx, that spirit
                  reaches into communities everywhere.
                </p>
                <p>
                  TEDxUniversitasCiputraSurabaya carries that torch forward. Born from the halls
                  of UC, powered by students, and driven by the belief that{" "}
                  <span className="text-(--maleficent-purple) italic">
                    every idea deserves a stage
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM ===== */}
      <section className="relative py-12 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex-1 max-w-40 h-px bg-linear-to-r from-transparent to-(--maleficent-green)/30" />
            <CrownIcon className="w-8 h-8 md:w-10 md:h-10 text-(--maleficent-green)/30 animate-float" />
            <div className="flex-1 max-w-40 h-px bg-linear-to-l from-transparent to-(--maleficent-green)/30" />
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-(--acid-green) transition-colors duration-300 group"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
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
