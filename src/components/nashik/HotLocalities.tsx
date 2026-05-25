import Image from "next/image";
import Link from "next/link";

const localities = [
  {
    title: "Gangapur Road",
    image: "/nashik/localities/gangapur.jpg",
    price: "₹8,500/sq.ft",
    growth: "+18% YoY",
    tag: "Premium Growth Corridor",
  },

  {
    title: "Pathardi",
    image: "/nashik/localities/pathardi.jpg",
    price: "₹5,200/sq.ft",
    growth: "+22% YoY",
    tag: "Emerging Investment Zone",
  },

  {
    title: "Nashik Road",
    image: "/nashik/localities/nashik-road.jpg",
    price: "₹6,800/sq.ft",
    growth: "+16% YoY",
    tag: "Connectivity Hub",
  },
];

export default function HotLocalities() {
  return (
    <section className="bg-gradient-to-b from-[#f8fbf8] to-white py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 max-w-3xl md:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
            Investment Opportunities
          </p>

          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
            High-Growth Investment Localities In Nashik
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {localities.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-[36px] border border-gray-100 bg-white shadow-[0_12px_50px_rgba(16,24,40,0.08)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                  {item.tag}
                </div>

                <h3 className="mt-5 text-2xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                      Price
                    </p>

                    <p className="font-bold text-gray-900 text-lg">
                      {item.price}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                      Growth
                    </p>

                    <p className="font-bold text-green-600 text-lg">
                      {item.growth}
                    </p>
                  </div>
                </div>

                <Link
                  href="/properties"
                  className="mt-6 inline-flex rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Explore Properties
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
