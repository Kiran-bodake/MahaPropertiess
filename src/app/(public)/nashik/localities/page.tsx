import HotLocalities from "@/components/nashik/HotLocalities";

export default function LocalitiesPage() {
  return (
    <main className="bg-[#f8fafc]">
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
            Nashik Localities
          </p>

          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-gray-900 md:text-6xl">
            Explore High-Growth Investment Corridors In Nashik
          </h1>
        </div>
      </section>

      <HotLocalities />
    </main>
  );
}
