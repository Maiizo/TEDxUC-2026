import Image from "next/image";

export default function EventPage() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/images/palace.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-(--void-black)/0" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <h1 className="text-4xl font-bold">Event</h1>
      </div>
    </main>
  );
}
