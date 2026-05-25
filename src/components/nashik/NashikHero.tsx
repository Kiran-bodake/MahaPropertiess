import Link from "next/link";

export default function NashikHero() {
  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{
        backgroundImage: "url('/nashik/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#041108]/90 via-[#041108]/65 to-[#041108]/25" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-32 md:px-8 md:py-40">
        <div className="max-w-3xl space-y-6">
          <div className="mb-8 inline-flex rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur-xl drop-shadow-lg">
            Maharashtra's Emerging Investment Destination
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
            Invest In Nashik's Fastest Growing Corridors
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-50 md:text-lg drop-shadow-lg">
            Discover premium land and property investment opportunities powered
            by infrastructure growth, industrial expansion, tourism, and future
            connectivity.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/40 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700"
            >
              Explore Properties
            </Link>

            <button className="inline-flex items-center justify-center rounded-xl border-1.5 border-white/30 bg-white/12 px-8 py-3.5 font-semibold text-white backdrop-blur-lg transition-all duration-300 hover:bg-white/20 hover:border-white/40">
              Get Free Consultation
            </button>
          </div>

          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🏢", text: "2500+ Verified Properties" },
              { icon: "📍", text: "40+ Localities" },
              { icon: "🏗️", text: "Industrial Expansion" },
              { icon: "📈", text: "High Appreciation Corridors" },
            ].map((item) => (
              <div
                key={item.text}
                className="rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.18)] border border-white/15 bg-white/10 p-4 backdrop-blur-xl transition duration-300 hover:bg-white/15"
              >
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-sm font-medium text-gray-100">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
