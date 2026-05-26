import Link from "next/link";

export default function FinalInvestmentCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="w-full">
        <div
          className="
            relative
            overflow-hidden
            rounded-[40px]
            px-6
            py-16
            shadow-[0_40px_120px_rgba(0,0,0,0.22)]
            md:px-10
            md:py-20
            lg:rounded-[28px]
          "
          style={{
            backgroundImage: "url('/nashik/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/55" />

          {/* CONTENT */}
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 lg:flex-row lg:items-end">
            {/* LEFT CONTENT */}
            <div className="max-w-4xl">
              <h2
                className="
    max-w-[820px]
    text-3xl
    font-black
    leading-[1.08]
    tracking-[-0.03em]
    !text-white
    drop-shadow-2xl
    md:text-5xl
    lg:text-[54px]
  "
              >
                Nashik's Next Growth Phase
                <br />
                Has Already Started
              </h2>

              <p
                className="
                  mt-6
                  max-w-2xl
                  text-base
                  leading-8
                  text-white/90
                  md:text-lg
                "
              >
                Invest before infrastructure, tourism, and connectivity projects
                significantly increase land values.
              </p>
            </div>

            {/* RIGHT BUTTONS */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/properties"
                className="
    flex
    h-14
    min-w-[220px]
    items-center
    justify-center
    rounded-full
    bg-[#05a336]
    px-8
    text-base
    font-semibold
    text-black
    transition-all
    duration-300
    hover:scale-[1.03]
  "
              >
                Explore Properties
              </Link>

              <button
                className="
    flex
    h-14
    min-w-[220px]
    items-center
    justify-center
    rounded-full
    border
    border-white/30
    bg-white/10
    px-8
    text-base
    font-semibold
    text-white
    backdrop-blur-xl
    transition-all
    duration-300
    hover:bg-white/20
  "
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
