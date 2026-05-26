import Link from "next/link";
import { Building2, MapPinned, Factory, TrendingUp } from "lucide-react";

export default function NashikHero() {
  return (
    <section
      className="relative flex min-h-[78svh] md:min-h-[88svh] items-center overflow-hidden"
      style={{
        backgroundImage: "url('/nashik/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/58 to-black/28" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-32 pb-16 md:pt-40 md:pb-28 md:px-8 ">
        <div className="max-w-4xl space-y-7">
          <div className="mb-10 inline-flex rounded-full border border-white/20 bg-white/12 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl shadow-lg">
            Maharashtra's Emerging Investment Destination
          </div>

          <h1
            className="
    max-w-4xl
    text-4xl
    font-black
    leading-[1]
    tracking-[-0.04em]
    !text-white
    drop-shadow-[0_10px_40px_rgba(0,0,0,0.65)]
    md:text-6xl
    lg:text-[72px]
  "
          >
            Invest In Nashik's Fastest
            <br />
            Growing Corridors
          </h1>

          <p
            className="
    max-w-2xl
    text-base
    leading-8
    text-white/90
    drop-shadow-lg
    md:text-xl
  "
          >
            Discover premium land and property investment opportunities powered
            by infrastructure growth, industrial expansion, tourism, and future
            connectivity.
          </p>

          {/* <div className="mt-12 flex flex-wrap gap-5">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/40 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700"
            >
              Explore Properties
            </Link>

            <button className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/12 px-8 py-3.5 font-semibold text-white backdrop-blur-lg transition-all duration-300 hover:bg-white/20 hover:border-white/40">
              Get Free Consultation
            </button>
          </div> */}

          {/* <div className="mt-20 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Building2,
                text: "2500+ Verified Properties",
              },

              {
                icon: MapPinned,
                text: "40+ Investment Localities",
              },

              {
                icon: Factory,
                text: "Industrial Expansion Hub",
              },

              {
                icon: TrendingUp,
                text: "High Appreciation Corridors",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  className="rounded-[12px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-6 w-6 text-green-300" />
                  </div>

                  <p className="text-sm font-semibold leading-6 text-white">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div> */}
        </div>
      </div>
    </section>
  );
}
