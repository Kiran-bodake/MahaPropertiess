export default function FinalInvestmentCTA() {
  return (
    <section className="px-4 py-16 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div
          className="relative overflow-hidden rounded-[52px] px-6 py-24 md:py-40 text-center text-white shadow-[0_40px_120px_rgba(0,0,0,0.22)] md:px-16 lg:rounded-[48px]"
          style={{
            backgroundImage: "url('/nashik/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#041108]/85 via-[#041108]/60 to-[#041108]/35" />
          <div className="relative z-10 space-y-6">
            <h2 className="mx-auto max-w-4xl text-3xl font-black leading-tight text-white drop-shadow-2xl md:text-5xl lg:text-6xl">
              Nashik's Next Growth Phase Has Already Started
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-100 drop-shadow-lg md:text-lg">
              Invest before infrastructure, tourism, and connectivity projects
              significantly increase land values.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button className="rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/40 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700">
                Explore Properties
              </button>

              <button className="rounded-xl border-2 border-white/40 bg-white/15 px-8 py-3.5 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
