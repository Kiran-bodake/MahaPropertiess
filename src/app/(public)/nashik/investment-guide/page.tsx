import Link from "next/link";
import { ArrowRight, TrendingUp, Landmark, Building2 } from "lucide-react";

const guides = [
  {
    title: "Best Areas For Investment",
    desc: "Explore Nashik’s fastest appreciating investment corridors.",
    icon: TrendingUp,
  },

  {
    title: "Commercial Investment",
    desc: "Discover commercial opportunities near industrial hubs.",
    icon: Building2,
  },

  {
    title: "Future Appreciation Corridors",
    desc: "Areas benefiting from infrastructure and connectivity growth.",
    icon: Landmark,
  },
];

export default function InvestmentGuidePage() {
  return (
    <main className="bg-[#f8fafc]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07150d] via-[#102318] to-[#173924] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
            Investment Guide
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white md:text-6xl">
            Smart Real Estate Investment Opportunities In Nashik
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-9 text-white/80">
            Learn where investors are focusing, which corridors are growing, and
            how infrastructure is shaping future appreciation.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[36px] border border-gray-100 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                  <Icon className="h-7 w-7 text-green-600" />
                </div>

                <h2 className="mt-7 text-3xl font-black tracking-[-0.03em] text-gray-900">
                  {item.title}
                </h2>

                <p className="mt-5 leading-8 text-gray-600">{item.desc}</p>

                <Link
                  href="/properties"
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-green-600"
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
