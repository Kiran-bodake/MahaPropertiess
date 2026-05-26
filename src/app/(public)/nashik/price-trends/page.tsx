const trends = [
  {
    area: "Gangapur Road",
    price: "₹8,500/sq.ft",
    growth: "+18%",
  },

  {
    area: "Pathardi",
    price: "₹5,200/sq.ft",
    growth: "+22%",
  },

  {
    area: "Nashik Road",
    price: "₹6,800/sq.ft",
    growth: "+16%",
  },

  {
    area: "Trimbak Road",
    price: "₹7,100/sq.ft",
    growth: "+14%",
  },
];

export default function PriceTrendsPage() {
  return (
    <main className="bg-white">
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
            Price Trends
          </p>

          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-gray-900 md:text-6xl">
            Nashik Real Estate Price Appreciation Trends
          </h1>

          <div className="mt-20 overflow-hidden rounded-[36px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <table className="w-full border-collapse">
              <thead className="bg-green-600 text-left text-white">
                <tr>
                  <th className="px-6 py-5 text-sm font-semibold uppercase tracking-wide">
                    Locality
                  </th>

                  <th className="px-6 py-5 text-sm font-semibold uppercase tracking-wide">
                    Avg Price
                  </th>

                  <th className="px-6 py-5 text-sm font-semibold uppercase tracking-wide">
                    YoY Growth
                  </th>
                </tr>
              </thead>

              <tbody>
                {trends.map((item) => (
                  <tr key={item.area} className="border-t border-gray-100">
                    <td className="px-6 py-6 text-lg font-semibold text-gray-900">
                      {item.area}
                    </td>

                    <td className="px-6 py-6 text-gray-700">{item.price}</td>

                    <td className="px-6 py-6 font-semibold text-green-600">
                      {item.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
