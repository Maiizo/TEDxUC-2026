"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

/* ══════════════════════════════════════════
   DATA
   ══════════════════════════════════════════ */

const galleryImages = [
  { src: "/images/bg-hero.png", alt: "TEDx event - auditorium" },
  { src: "/images/gallery-2.jpg", alt: "TEDx event - stage performance" },
  { src: "/images/gallery-3.jpg", alt: "TEDx event - crowd" },
  { src: "/images/gallery-4.jpg", alt: "TEDx event - speaker" },
  { src: "/images/gallery-5.jpg", alt: "TEDx event - night crowd" },
  { src: "/images/gallery-6.jpg", alt: "TEDx event - behind the scenes" },
];

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

function useParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = rect.top * 0.15;
      el.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return ref;
}

function useMouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const glow = glowRef.current;
    if (!el || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      glow.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      glow.style.opacity = "0";
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return { ref, glowRef };
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

/* ── Floating particles ── */
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-1">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-particle"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 30}%`,
            background: i % 2 === 0
              ? "rgba(84, 110, 64, 0.3)"
              : "rgba(93, 29, 105, 0.3)",
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   HERO TEXT ANIMATION
   ══════════════════════════════════════════ */

function AnimatedHeroText() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
      {/* Floating crown above title */}
      <div
        className={`flex justify-center mb-4 md:mb-6 transition-all duration-1000 ease-out ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}
      >
        <CrownIcon className="w-10 h-10 md:w-14 md:h-14 text-(--maleficent-green) animate-float drop-shadow-[0_0_30px_rgba(84,110,64,0.5)]" />
      </div>

      {/* Title lines staggered */}
      <h1
        className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-none tracking-wider"
        style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
      >
        <span
          className={`inline-block transition-all duration-1000 delay-200 ease-out ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="hero-text-shimmer">The Forsaken</span>
        </span>
        <br />
        <span
          className={`inline-block transition-all duration-1000 delay-500 ease-out ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-(--maleficent-green) drop-shadow-[0_0_40px_rgba(84,110,64,0.5)]">
            Crown
          </span>
        </span>
      </h1>

      {/* Divider */}
      <div
        className={`flex items-center justify-center gap-3 mt-5 md:mt-7 transition-all duration-1000 delay-700 ease-out ${
          revealed ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        }`}
      >
        <div className="w-12 md:w-20 h-px bg-linear-to-r from-transparent to-(--maleficent-green)/50" />
        <Diamond className="text-(--maleficent-green)/60 w-2 h-2 animate-pulse" />
        <Diamond className="text-(--maleficent-purple)/50 w-1.5 h-1.5 animate-pulse [animation-delay:0.5s]" />
        <div className="w-12 md:w-20 h-px bg-linear-to-l from-transparent to-(--maleficent-purple)/50" />
      </div>

      {/* Subtitle */}
      <p
        className={`mt-4 md:mt-6 text-sm md:text-lg text-gray-300/70 italic tracking-widest transition-all duration-1000 delay-900 ease-out ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        Reclaim the lost power of ideas.
      </p>

      {/* Scroll indicator */}
      <div
        className={`mt-10 md:mt-14 transition-all duration-1000 delay-1200 ease-out ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce [animation-duration:2s]">
          <span className="text-[0.6rem] text-gray-600 uppercase tracking-[0.3em]">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-gray-600">
            <rect x="3" y="1" width="10" height="16" rx="5" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="7" r="1.5" fill="currentColor" className="animate-pulse" />
            <path d="M8 20L5 17M8 20L11 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   TEDx INFO CARD WITH MOUSE GLOW
   ══════════════════════════════════════════ */

function TedxInfoSection() {
  const titleRef = useScrollReveal();
  const p1Ref = useScrollReveal(100);
  const p2Ref = useScrollReveal(200);
  const { ref: cardRef, glowRef } = useMouseGlow();

  return (
    <section className="relative py-20 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Left decorative column */}
          <div className="hidden md:flex flex-col items-center gap-4 pt-4 min-w-8">
            <div className="w-px h-10 bg-linear-to-b from-transparent to-(--maleficent-green)/40" />
            <Diamond className="text-(--maleficent-green)/40 w-2 h-2 animate-pulse" />
            <div className="w-px h-16 bg-(--maleficent-green)/20" />
            <Diamond className="text-(--maleficent-purple)/40 w-2 h-2 animate-pulse [animation-delay:1s]" />
            <div className="w-px h-10 bg-linear-to-b from-(--maleficent-purple)/25 to-transparent" />
          </div>

          {/* Title area */}
          <div className="md:w-2/5">
            <div ref={titleRef} className="opacity-0 translate-y-8 transition-all duration-700 ease-out">
              {/* Decorative Icon */}
              <div className="flex justify-start mb-5">
                <svg
                  width="40" height="40" viewBox="0 0 40 40" fill="none"
                  className="text-(--maleficent-green) w-8 h-8 md:w-10 md:h-10 animate-float"
                >
                  <path
                    d="M20 4C20 4 24 10 24 16C24 18 26 20 28 20C30 20 32 18 36 14M20 4C20 4 16 10 16 16C16 18 14 20 12 20C10 20 8 18 4 14M20 4V36M12 20C12 20 8 24 8 28M28 20C28 20 32 24 32 28M20 16C20 16 16 18 14 22M20 16C20 16 24 18 26 22"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  />
                  <circle cx="20" cy="16" r="2" fill="currentColor" />
                  <circle cx="12" cy="20" r="1.5" fill="currentColor" />
                  <circle cx="28" cy="20" r="1.5" fill="currentColor" />
                </svg>
              </div>

              <h2
                className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase tracking-wider leading-tight"
                style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
              >
                What is{" "}
                <span className="text-(--maleficent-green)">TEDx</span>
                <span className="text-(--maleficent-purple)">?</span>
              </h2>

              <div className="flex items-center gap-2 mt-4">
                <div className="w-12 h-px bg-(--maleficent-green)/40" />
                <Diamond className="text-(--maleficent-green)/50 w-1.5 h-1.5" />
                <div className="w-6 h-px bg-(--maleficent-purple)/30" />
              </div>
            </div>
          </div>

          {/* Content card with mouse-glow */}
          <div className="md:w-3/5">
            <div
              ref={cardRef}
              className="relative rounded-2xl border border-(--maleficent-green)/15 bg-linear-to-br from-[#0d1a0a]/40 via-(--deep-black) to-[#0f0a14]/20 p-7 md:p-10 overflow-hidden group"
            >
              {/* Mouse-following glow */}
              <div
                ref={glowRef}
                className="absolute w-64 h-64 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500 bg-linear-to-br from-(--maleficent-green)/8 to-(--maleficent-purple)/5 blur-3xl"
              />

              {/* Corner diamonds */}
              <Diamond className="absolute -top-1.5 -left-1.5 text-(--maleficent-green)/30" />
              <Diamond className="absolute -top-1.5 -right-1.5 text-(--maleficent-purple)/30" />
              <Diamond className="absolute -bottom-1.5 -right-1.5 text-(--maleficent-green)/30" />

              <div className="relative">
                <div ref={p1Ref} className="opacity-0 translate-y-6 transition-all duration-700 ease-out">
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-5">
                    In the spirit of{" "}
                    <span className="text-(--acid-green) font-medium not-italic">ideas worth spreading</span>,
                    TEDx is a program of local, self-organized events that bring people together
                    to share a TED-like experience. At a TEDx event, TED Talks video and live
                    speakers combine to spark deep discussion and connection.
                  </p>
                </div>

                <div ref={p2Ref} className="opacity-0 translate-y-6 transition-all duration-700 ease-out">
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    These local, self-organized events are branded TEDx, where{" "}
                    <span className="text-(--maleficent-purple) italic">x = independently organized TED event</span>.
                    The TED Conference provides general guidance for the TEDx program,
                    but individual TEDx events are self-organized.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   GALLERY WITH HOVER EFFECTS
   ══════════════════════════════════════════ */

function GallerySection() {
  const titleRef = useScrollReveal();

  return (
    <section className="relative py-16 md:py-28">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/chronicles-bg.jpg"
          alt="Dark forest background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-b from-(--void-black) via-[#0a1a08]/60 to-(--void-black)" />
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Section Title */}
        <div
          ref={titleRef}
          className="text-center md:text-left mb-10 md:mb-14 opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase tracking-wider mb-3"
            style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
          >
            Chronicles of the{" "}
            <span className="text-(--maleficent-purple)">Past</span>
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
            <div className="w-14 h-px bg-(--maleficent-purple)/40" />
            <Diamond className="text-(--maleficent-purple)/50 w-1.5 h-1.5" />
            <div className="w-8 h-px bg-(--maleficent-green)/30" />
          </div>
          <p className="text-xs md:text-sm text-gray-500 italic mt-3 tracking-wide">
            Glimpses from last year&apos;s gathering
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {galleryImages.map((img, index) => {
            const accent = index % 3 === 0 ? "maleficent-green" : index % 3 === 1 ? "maleficent-purple" : "acid-green";
            return (
              <GalleryImage key={index} img={img} index={index} accent={accent} />
            );
          })}
        </div>

        {/* See Full Gallery */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-(--acid-green) transition-all duration-400 group"
          >
            <span className="group-hover:tracking-wider transition-all duration-300">See Full Gallery</span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="mt-0.5 group-hover:translate-x-1 transition-transform duration-300"
            >
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function GalleryImage({ img, index, accent }: { img: { src: string; alt: string }; index: number; accent: string }) {
  const ref = useScrollReveal(index * 80);

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-6 transition-all duration-700 ease-out"
    >
      <div
        className={`relative aspect-4/3 rounded-xl overflow-hidden group border border-transparent hover:border-(--${accent})/25 transition-all duration-500`}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        {/* Dark overlay that lifts on hover */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500" />

        {/* Corner accent on hover */}
        <div className={`absolute -bottom-3 -right-3 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-(--${accent})/20`} />

        {/* Subtle number indicator */}
        <div className="absolute bottom-2 right-3 text-[0.55rem] text-white/0 group-hover:text-white/30 transition-all duration-500 font-mono">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CTA — CLAIM YOUR THRONE
   ══════════════════════════════════════════ */

function CtaSection() {
  const titleRef = useScrollReveal();
  const btnRef = useScrollReveal(300);
  const [hovered, setHovered] = useState(false);

  return (
    <section className="relative py-24 md:py-40 px-6 overflow-hidden">
      {/* Dramatic glow backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-(--maleficent-green)/5 rounded-full blur-[180px]" />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full blur-[150px] transition-all duration-1000 ${hovered ? "bg-(--maleficent-green)/12 scale-125" : "bg-(--maleficent-purple)/5 scale-100"}`} />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Crown */}
        <div
          ref={titleRef}
          className="opacity-0 translate-y-8 transition-all duration-800 ease-out"
        >
          <CrownIcon className="w-14 h-14 md:w-20 md:h-20 mx-auto mb-6 text-(--maleficent-green)/50 animate-float drop-shadow-[0_0_30px_rgba(84,110,64,0.3)]" />

          <h2
            className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider leading-tight"
            style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
          >
            Claim Your
            <br />
            <span className="text-(--maleficent-green) drop-shadow-[0_0_30px_rgba(84,110,64,0.4)]">
              Throne
            </span>
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-10 h-px bg-linear-to-r from-transparent to-(--maleficent-green)/40" />
            <Diamond className="text-(--maleficent-green)/40 w-1.5 h-1.5" />
            <Sparkle className="text-(--maleficent-purple)/40 w-2 h-2" />
            <div className="w-10 h-px bg-linear-to-l from-transparent to-(--maleficent-purple)/40" />
          </div>

          <p className="mt-5 md:mt-6 text-sm md:text-base text-gray-400/80 leading-relaxed max-w-lg mx-auto">
            Join us in{" "}
            <span className="text-(--maleficent-purple) italic">The Forsaken Crown</span>.
            Register now to secure your place in this year&apos;s gathering of ideas.
          </p>
        </div>

        {/* CTA Button */}
        <div
          ref={btnRef}
          className="mt-9 md:mt-12 opacity-0 translate-y-6 transition-all duration-700 ease-out"
        >
          <Link
            href="/event"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative inline-block group"
          >
            {/* Glow ring behind button */}
            <div className="absolute -inset-3 rounded-full bg-(--maleficent-green)/0 group-hover:bg-(--maleficent-green)/15 blur-xl transition-all duration-700" />

            <span className="relative inline-flex items-center gap-3 px-10 py-4 md:px-14 md:py-5 bg-linear-to-r from-(--dark-green) to-(--maleficent-green) text-white text-sm md:text-base font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-500 group-hover:tracking-[0.25em] group-hover:shadow-[0_0_40px_rgba(84,110,64,0.5)]">
              Register Now
              <svg
                width="18" height="18" viewBox="0 0 18 18" fill="none"
                className="group-hover:translate-x-1 transition-transform duration-300"
              >
                <path d="M7 13L11 9L7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════ */

export default function Home() {
  return (
    <div className="min-h-screen bg-(--void-black) text-white overflow-x-hidden">
      {/* ── Global styles ── */}
      <style jsx global>{`
        .revealed {
          opacity: 1 !important;
          transform: translateY(0) rotate(0) !important;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes particle {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translate(var(--dx, 30px), var(--dy, -120px)) scale(0); opacity: 0; }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-particle {
          --dx: 20px;
          --dy: -100px;
          animation: particle 8s ease-in-out infinite;
        }
        .animate-particle:nth-child(odd) { --dx: -25px; --dy: -80px; }
        .animate-particle:nth-child(3n) { --dx: 15px; --dy: -130px; }
        .hero-text-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.9) 0%,
            rgba(255,255,255,1) 40%,
            rgba(109,138,88,0.9) 50%,
            rgba(255,255,255,1) 60%,
            rgba(255,255,255,0.9) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[5%] left-[-5%] w-125 h-100 bg-(--maleficent-green)/3 rounded-full blur-[200px]" />
        <div className="absolute top-[30%] right-[-8%] w-100 h-125 bg-(--maleficent-purple)/4 rounded-full blur-[220px]" />
        <div className="absolute top-[60%] left-[5%] w-100 h-80 bg-(--maleficent-purple)/3 rounded-full blur-[180px]" />
        <div className="absolute bottom-[5%] right-[5%] w-125 h-100 bg-(--maleficent-green)/4 rounded-full blur-[200px]" />
      </div>

      {/* ── Vine decorations (desktop) ── */}
      <div className="hidden lg:block fixed top-0 left-0 w-16 h-full pointer-events-none z-1 text-(--maleficent-green)">
        <ThornVine className="w-full h-full" />
      </div>
      <div className="hidden lg:block fixed top-0 right-0 w-16 h-full pointer-events-none z-1 text-(--maleficent-purple)">
        <ThornVine className="w-full h-full" flip />
      </div>

      {/* ── Floating particles ── */}
      <FloatingParticles />

      {/* ── Floating sparkles ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-1">
        <Sparkle className="absolute top-[10%] left-[15%] text-(--maleficent-green)/15 animate-pulse" />
        <Sparkle className="absolute top-[25%] right-[10%] text-(--maleficent-purple)/20 animate-pulse [animation-delay:1.5s]" />
        <Sparkle className="absolute top-[50%] left-[8%] text-(--maleficent-green)/12 animate-pulse [animation-delay:0.8s]" />
        <Sparkle className="absolute top-[70%] right-[18%] text-(--maleficent-purple)/18 animate-pulse [animation-delay:2.2s]" />
        <Sparkle className="absolute top-[85%] left-[30%] text-(--acid-green)/15 animate-pulse [animation-delay:3s]" />
      </div>

      {/* ═══════════════════════════════════
          HERO
          ═══════════════════════════════════ */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-hero.png"
            alt="The Forsaken Crown - Dark castle background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-(--void-black)" />
          <div className="absolute inset-0 bg-linear-to-t from-(--void-black) via-transparent to-transparent" />
          {/* Green/purple tint overlays */}
          <div className="absolute inset-0 bg-linear-to-br from-(--maleficent-green)/5 via-transparent to-(--maleficent-purple)/5" />
        </div>

        <AnimatedHeroText />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-(--void-black) to-transparent z-10" />
      </section>

      {/* ═══════════════════════════════════
          WHAT IS TEDx
          ═══════════════════════════════════ */}
      <TedxInfoSection />

      {/* ═══════════════════════════════════
          CHRONICLES GALLERY
          ═══════════════════════════════════ */}
      <GallerySection />

      {/* ═══════════════════════════════════
          CLAIM YOUR THRONE CTA
          ═══════════════════════════════════ */}
      <CtaSection />
    </div>
  );
}
