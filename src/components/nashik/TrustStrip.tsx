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
    <section className="relative z-20 -mt-10 px-4 md:-mt-16 md:px-8">
      <div className="mx-auto max-w-[1500px] rounded-[40px] border border-white/60 bg-white/92 p-3 shadow-[0_25px_80px_rgba(0,0,0,0.10)] backdrop-blur-2xl md:p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
group
flex
min-h-[170px]
flex-col
items-center
justify-center
rounded-[30px]
border
border-gray-100
bg-gradient-to-b
from-white
to-[#f8faf8]
p-7
text-center
transition-all
duration-300
hover:-translate-y-1
hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
"
              >
                <Icon className="h-10 w-10 text-green-600 transition-transform duration-300 group-hover:scale-110" />

                <h3 className="mt-5 text-4xl font-black tracking-[-0.03em] text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
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
