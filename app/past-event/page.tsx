import Link from "next/link";

/* ── SVG Icon Components ── */

function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={`w-3 h-3 ${className}`}>
      <path d="M6 0L12 6L6 12L0 6Z" />
    </svg>
  );
}

function AttendeesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
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
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 42C10 32.059 16.268 26 24 26C31.732 26 38 32.059 38 42" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 8L24 2L30 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PerformancesIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="36" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 18L32 22L20 26V18Z" fill="currentColor" />
      <path d="M14 38H34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 34V38" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PhotosIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="12" y="6" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="28" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 30L20 22L26 28L32 22L44 30" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M38 38L42 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 36L44 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Decorative Divider ── */

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-1">
      <div className="w-20 md:w-32 h-px bg-linear-to-r from-transparent to-(--maleficent-green)/50" />
      <Diamond className="text-(--maleficent-green) w-2 h-2" />
      <Diamond className="text-(--maleficent-green) w-2 h-2" />
      <div className="w-20 md:w-32 h-px bg-linear-to-l from-transparent to-(--maleficent-green)/50" />
    </div>
  );
}

/* ── Data ── */

interface Speaker {
  name: string;
  title: string;
  description: string;
}

const speakers: Speaker[] = [
  {
    name: "Dr. Sarah Mitchell",
    title: "The Science of Consciousness",
    description: "Neuroscientist exploring the mysteries of human awareness.",
  },
  {
    name: "James Rodriguez",
    title: "Innovation in Crisis",
    description: "Tech entrepreneur who built solutions during the pandemic.",
  },
  {
    name: "Maya Patel",
    title: "Art as Revolution",
    description: "Artist and activist using creativity to drive social change.",
  },
  {
    name: "Dr. Kevin Tanaka",
    title: "Sustainable Cities of Tomorrow",
    description: "Urban planner reimagining green metropolitan spaces.",
  },
  {
    name: "Lisa Chen",
    title: "The Future of Education",
    description: "EdTech pioneer transforming exciting learning experiences.",
  },
  {
    name: "Marcus Thompson",
    title: "Breaking Mental Barriers",
    description: "Performance coach helping people unlock their potential.",
  },
  {
    name: "Dr. Amira Hassan",
    title: "Health Tech Revolution",
    description: "Medical inventor advancing accessible healthcare.",
  },
  {
    name: "David Park",
    title: "The Power of Storytelling",
    description: "Filmmaker and author capturing human stories.",
  },
];

const highlights = [
  { icon: <AttendeesIcon className="w-8 h-8 md:w-10 md:h-10" />, value: "100", label: "Attendees" },
  { icon: <SpeakersIcon className="w-8 h-8 md:w-10 md:h-10" />, value: "8", label: "Speakers" },
  { icon: <PerformancesIcon className="w-8 h-8 md:w-10 md:h-10" />, value: "2", label: "Performances" },
  { icon: <PhotosIcon className="w-8 h-8 md:w-10 md:h-10" />, value: "100+", label: "Photos Captured" },
];

/* ── Speaker Card ── */

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <div className="group">
      {/* Photo placeholder */}
      <div className="relative aspect-3/4 rounded-lg overflow-hidden mb-3 bg-linear-to-b from-gray-800/50 to-gray-900/80 border border-gray-800/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 text-gray-700">
            <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 42C10 32 16 26 24 26C32 26 38 32 38 42" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {/* Name */}
      <h4
        className="text-xs md:text-sm font-bold uppercase tracking-wide text-(--maleficent-green) mb-0.5"
        style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
      >
        {speaker.name}
      </h4>
      {/* Title */}
      <p className="text-[0.65rem] md:text-xs text-gray-400 italic mb-1">{speaker.title}</p>
      {/* Description */}
      <p className="text-[0.6rem] md:text-xs text-gray-500 leading-relaxed">{speaker.description}</p>
    </div>
  );
}

/* ── Page Component ── */

export default function PastEventPage() {
  return (
    <div className="min-h-screen bg-(--void-black) text-white overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -left-32 w-96 h-96 bg-(--maleficent-green)/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-32 w-96 h-96 bg-(--maleficent-purple)/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-1/4 w-96 h-96 bg-(--maleficent-green)/3 rounded-full blur-[150px]" />
      </div>

      {/* ===== HEADER ===== */}
      <section className="relative pt-20 pb-10 md:pt-28 md:pb-14 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1
            className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider mb-2 md:mb-3"
            style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
          >
            TEDxUC Surabaya 2025
          </h1>

          <SectionDivider />

          <p className="text-sm md:text-base text-gray-400 italic mt-2 mb-5 md:mb-6">
            The Awakening
          </p>

          {/* Meta info */}
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
      </section>

      {/* ===== ABOUT THE EVENT ===== */}
      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-xl border border-(--maleficent-green)/30 bg-linear-to-b from-[#0d1a0a]/60 to-(--deep-black) p-6 md:p-8">
            {/* Corner diamonds */}
            <Diamond className="absolute -top-1.5 -left-1.5 text-(--maleficent-green)/50" />
            <Diamond className="absolute -top-1.5 -right-1.5 text-(--maleficent-green)/50" />
            <Diamond className="absolute -bottom-1.5 -left-1.5 text-(--maleficent-green)/50" />
            <Diamond className="absolute -bottom-1.5 -right-1.5 text-(--maleficent-green)/50" />

            <h2
              className="text-xl md:text-2xl font-bold uppercase tracking-wider mb-4"
              style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
            >
              About The Event
            </h2>

            <div className="space-y-3 text-sm md:text-base text-gray-400 leading-relaxed">
              <p>
                TEDxUC Surabaya 2025 was a groundbreaking event that brought together
                some of the most inspiring minds from diverse fields including science,
                technology, arts, and social innovation.
              </p>
              <p>
                The event featured thought-provoking talks, captivating performances,
                and meaningful conversations that challenged perspectives and ignited
                new ideas among attendees.
              </p>
              <p>
                Held at the Grand Auditorium of Universitas Ciputra Surabaya, the event
                gathered over 500 attendees for an unforgettable day of inspiration and
                connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EVENT HIGHLIGHTS ===== */}
      <section className="relative py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-center mb-8 md:mb-10"
            style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
          >
            Event Highlights
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-(--maleficent-green)/25 bg-linear-to-b from-[#0d1a0a]/40 to-(--deep-black) p-5 md:p-6 text-center"
              >
                <div className="flex justify-center mb-3 text-(--maleficent-green)/70">
                  {item.icon}
                </div>
                <p
                  className="text-2xl md:text-3xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
                >
                  {item.value}
                </p>
                <p className="text-[0.65rem] md:text-xs text-gray-500 uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== THEME ===== */}
      <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-xl border border-(--maleficent-green)/30 bg-linear-to-b from-[#0d1a0a]/60 to-(--deep-black) p-6 md:p-8 text-center">
            <Diamond className="absolute -top-1.5 -left-1.5 text-(--maleficent-green)/50" />
            <Diamond className="absolute -top-1.5 -right-1.5 text-(--maleficent-green)/50" />
            <Diamond className="absolute -bottom-1.5 -left-1.5 text-(--maleficent-green)/50" />
            <Diamond className="absolute -bottom-1.5 -right-1.5 text-(--maleficent-green)/50" />

            <h2
              className="text-xl md:text-2xl font-bold uppercase tracking-wider mb-3"
              style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
            >
              Theme:
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed italic">
              A journey into consciousness, innovation, and the power of transformative ideas
              that challenge the status quo and awaken the potential within each of us.
            </p>
          </div>
        </div>
      </section>

      {/* ===== OUR SPEAKERS ===== */}
      <section className="relative py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-center mb-8 md:mb-10"
            style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
          >
            Our Speakers
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {speakers.map((speaker, i) => (
              <SpeakerCard key={i} speaker={speaker} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVENT GALLERY ===== */}
      <section className="relative py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-center mb-8 md:mb-10"
            style={{ fontFamily: "var(--font-allrounder), sans-serif" }}
          >
            Event Gallery
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="relative aspect-4/3 rounded-lg overflow-hidden bg-linear-to-br from-gray-800/30 to-gray-900/60 border border-gray-800/30 group hover:border-(--maleficent-green)/30 transition-colors duration-300"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8 text-gray-600">
                    <rect x="4" y="8" width="40" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="16" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 34L16 24L24 30L34 20L44 28" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM SECTION ===== */}
      <section className="relative py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <SectionDivider />
          <p className="mt-6 text-sm text-gray-500 mb-6">
            Relive the moments that defined TEDxUC Surabaya 2025.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-(--acid-green) transition-colors duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
