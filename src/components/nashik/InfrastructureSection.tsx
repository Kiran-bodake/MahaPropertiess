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
];

export default function InfrastructureSection() {
  return (
    <section className="py-16 bg-white md:py-28">
      <div className="mx-auto max-w-7xl space-y-16 px-4 md:space-y-24 md:px-6">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <div className="relative h-[420px] overflow-hidden rounded-[32px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
                Infrastructure Growth
              </p>

              <h2 className="mt-4 text-4xl font-bold text-gray-900">
                {item.title}
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
