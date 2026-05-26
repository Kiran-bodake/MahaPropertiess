import Image from "next/image";

const infra = [
  {
    title: "Bullet Train Connectivity",
    image: "/nashik/bullet-train.jpg",
    desc: "Future high-speed connectivity can accelerate long-term appreciation.",
  },

  {
    title: "Ring Road Development",
    image: "/nashik/ring-road.jpg",
    desc: "Ring road and smart city initiatives are reshaping urban growth.",
  },

  {
    title: "Industrial Expansion",
    image: "/nashik/industrial.jpg",
    desc: "MIDC and industrial corridors continue increasing housing demand.",
  },
];

export default function InfrastructurePage() {
  return (
    <main className="bg-white">
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
            Infrastructure Growth
          </p>

          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-gray-900 md:text-6xl">
            Infrastructure Driving Nashik’s Future Appreciation
          </h1>

          <div className="mt-20 space-y-24">
            {infra.map((item, index) => (
              <div
                key={item.title}
                className="grid items-center gap-10 xl:grid-cols-2"
              >
                <div className={index % 2 ? "xl:order-2" : ""}>
                  <div className="relative h-[320px] overflow-hidden rounded-[40px] md:h-[520px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="max-w-2xl">
                  <h2 className="text-4xl font-black tracking-[-0.03em] text-gray-900">
                    {item.title}
                  </h2>

                  <p className="mt-6 text-lg leading-9 text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
