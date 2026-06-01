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
    <section className="relative z-20 -mt-12 px-0 md:-mt-20">
      <div className="w-full rounded-[40px] border border-white/60 bg-white/92 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.10)] backdrop-blur-2xl md:p-6 lg:p-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
group
flex
min-h-[120px] md:min-h-[160px]
flex-col
items-center
justify-center
rounded-[30px]
border
border-gray-100
bg-gradient-to-b
from-white
to-[#f8faf8]
p-4 md:p-6 lg:p-8
text-center
transition-all
duration-300
hover:-translate-y-1
hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
"
              >
                <Icon className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-green-600 transition-transform duration-300 group-hover:scale-110" />

                <h3 className="mt-3 md:mt-4 text-2xl md:text-3xl lg:text-4xl font-black tracking-[-0.03em] text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-1 md:mt-2 text-xs md:text-sm font-medium leading-5 text-gray-500">
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
