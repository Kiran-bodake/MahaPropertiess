import { Building2, TrendingUp, Landmark, MapPinned } from "lucide-react";

const stats = [
  {
    icon: Building2,
    title: "2500+",
    subtitle: "Verified Properties",
  },
  {
    icon: MapPinned,
    title: "40+",
    subtitle: "Growing Localities",
  },
  {
    icon: Landmark,
    title: "Major",
    subtitle: "Infrastructure Projects",
  },
  {
    icon: TrendingUp,
    title: "High",
    subtitle: "Future Appreciation",
  },
];

export default function TrustStrip() {
  return (
    <section className="relative z-20 -mt-20 px-4 py-8">
      <div className="mx-auto max-w-7xl rounded-[40px] border border-white/40 bg-white/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl bg-gradient-to-br from-white via-white to-gray-50 p-6 text-center border border-gray-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon className="mx-auto h-11 w-11 text-green-600" />

                <h3 className="mt-4 text-2xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-sm font-medium text-gray-600">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
