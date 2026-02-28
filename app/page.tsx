import Image from "next/image";
import Link from "next/link";

const galleryImages = [
  { src: "/images/bg-hero.png", alt: "TEDx event - auditorium" },
  { src: "/images/gallery-2.jpg", alt: "TEDx event - stage performance" },
  { src: "/images/gallery-3.jpg", alt: "TEDx event - crowd" },
  { src: "/images/gallery-4.jpg", alt: "TEDx event - speaker" },
  { src: "/images/gallery-5.jpg", alt: "TEDx event - night crowd" },
  { src: "/images/gallery-6.jpg", alt: "TEDx event - behind the scenes" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[85vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-hero.png"
            alt="The Forsaken Crown - Dark castle background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-[1.05] tracking-wide"
            style={{ fontFamily: "var(--font-allrounder), serif" }}
          >
            The Forsaken
            <br />
            Crown
          </h1>
          <p className="mt-4 md:mt-6 text-sm md:text-base text-gray-300/80 italic max-w-md mx-auto">
            Reclaim the lost power of ideas.
          </p>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
      </section>

      {/* ===== WHAT IS TEDx SECTION ===== */}
      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative Icon */}
          <div className="flex justify-center mb-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="text-[#546e40] w-8 h-8 md:w-10 md:h-10"
            >
              <path
                d="M20 4C20 4 24 10 24 16C24 18 26 20 28 20C30 20 32 18 36 14M20 4C20 4 16 10 16 16C16 18 14 20 12 20C10 20 8 18 4 14M20 4V36M12 20C12 20 8 24 8 28M28 20C28 20 32 24 32 28M20 16C20 16 16 18 14 22M20 16C20 16 24 18 26 22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="20" cy="16" r="2" fill="currentColor" />
              <circle cx="12" cy="20" r="1.5" fill="currentColor" />
              <circle cx="28" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide mb-6 md:mb-8"
            style={{ fontFamily: "var(--font-allrounder), serif" }}
          >
            What is TEDx?
          </h2>

          <div className="space-y-5 text-sm md:text-base text-gray-400 leading-relaxed">
            <p>
              In the spirit of ideas worth spreading, TEDx is a program of
              local, self-organized events that bring people together to share a
              TED-like experience. At a TEDx event, TED Talks video and live
              speakers combine to spark deep discussion and connection.
            </p>
            <p>
              These local, self-organized events are branded TEDx, where x =
              independently organized TED event. The TED Conference provides
              general guidance for the TEDx program, but individual TEDx events
              are self-organized.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CHRONICLES OF THE PAST (Gallery) SECTION ===== */}
      <section className="relative py-16 md:py-24">
        {/* Background with dark green/forest gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/chronicles-bg.jpg"
            alt="Dark forest background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a1a08]/80 to-[#050505]" />
        </div>

        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-8 md:mb-12">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide mb-3"
              style={{ fontFamily: "var(--font-allrounder), serif" }}
            >
              Chronicles of the Past
            </h2>
            <p className="text-sm text-gray-400/70">
              Glimpses from last year&apos;s gathering
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="relative aspect-[4/3] rounded-lg overflow-hidden group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>

          {/* See Full Gallery Link */}
          <div className="text-center mt-8">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#39FF14] transition-colors duration-300"
            >
              See Full Gallery
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-0.5"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CLAIM YOUR THRONE (CTA) SECTION ===== */}
      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide mb-4 md:mb-5"
            style={{ fontFamily: "var(--font-allrounder), serif" }}
          >
            Claim Your
            <br />
            Throne
          </h2>

          <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8 md:mb-10 max-w-md mx-auto">
            Join us in The Forsaken Crown. Register now to secure your place in
            this year&apos;s gathering of ideas.
          </p>

          <Link
            href="/event"
            className="inline-block px-8 py-3 md:px-10 md:py-3.5 bg-[#546e40] hover:bg-[#6d8a58] text-white text-sm md:text-base font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(84,110,64,0.4)]"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}