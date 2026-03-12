import Navbar from "./components/NavigationBar";

export default function Home() {
  return (
    <div className="bg-black text-white" style={{ minHeight: "300vh" }}>
      <Navbar />

      {/* Hero section */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-6xl font-bold tracking-tight mb-4">
          TEDx<span className="text-purple-500">UCSurabaya</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-xl">
          Scroll down to see the navbar animate from full-width to a centered pill.
        </p>
        <div className="mt-8 animate-bounce text-gray-500 text-sm">↓ Scroll</div>
      </section>

      {/* Filler sections */}
      <section className="flex items-center justify-center h-screen border-t border-white/10">
        <p className="text-3xl font-semibold text-gray-300">Section 2</p>
      </section>

      <section className="flex items-center justify-center h-screen border-t border-white/10">
        <p className="text-3xl font-semibold text-gray-300">Section 3</p>
      </section>
    </div>
  );
}
