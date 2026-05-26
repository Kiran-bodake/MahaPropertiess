import Image from "next/image";

const items = [
  {
    title: "Mumbai–Ahmedabad Bullet Train Connectivity",
    image: "/nashik/bullet-train.jpg",
    description:
      "Future high-speed connectivity can accelerate appreciation across emerging growth corridors.",
  },

  {
    title: "Industrial Corridors & MIDC Growth",
    image: "/nashik/industrial.jpg",
    description:
      "Industrial development continues driving workforce migration and residential demand.",
  },
  {
    title: "Smart City & Ring Road Development",
    image: "/nashik/ring-road.jpg",
    description:
      "Upcoming smart city initiatives, road widening, and ring road connectivity are transforming Nashik into a future-ready urban investment destination.",
  },
];

export default function InfrastructureSection() {
  return (
    <section className="bg-white px-5 py-16 md:px-8 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-20 md:space-y-28 lg:space-y-32">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="grid items-center gap-12 xl:grid-cols-[1.05fr_0.95fr] xl:gap-16"
          >
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <div
                className="
relative
h-[320px]
overflow-hidden
rounded-[40px]
shadow-[0_30px_80px_rgba(0,0,0,0.14)]
md:h-[520px]
"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
                Infrastructure Growth
              </p>

              <h2 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.03em] text-gray-900 md:text-5xl lg:text-6xl">
                {item.title}
              </h2>

              <p className="mt-8 text-lg leading-9 text-gray-600 md:text-xl md:leading-10">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
