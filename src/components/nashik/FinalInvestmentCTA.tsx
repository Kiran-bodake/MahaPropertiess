import Link from "next/link";

export default function FinalInvestmentCTA() {
  return (
    <section className="px-4 py-0">
      <div className="mx-auto max-w-7xl">
        <div
          className="
            relative
            overflow-hidden
            rounded-[40px]
            px-8
            py-20
            shadow-[0_40px_120px_rgba(0,0,0,0.22)]
            md:px-12
            md:py-28
            lg:px-16
            lg:py-32
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
          <div className="relative z-10 flex flex-col items-center justify-between gap-12 lg:flex-row lg:items-end lg:gap-16">
            {/* LEFT CONTENT */}
            <div className="max-w-4xl">
              <h2
                className="
    max-w-[820px]
    text-4xl
    font-black
    leading-[1.08]
    tracking-[-0.03em]
    !text-white
    drop-shadow-2xl
    md:text-5xl
    lg:text-6xl
  "
              >
                Nashik's Next Growth Phase
                <br />
                Has Already Started
              </h2>

              <p
                className="
                  mt-8
                  max-w-2xl
                  text-base
                  leading-8
                  text-white/90
                  md:text-lg
                  md:leading-9
                "
              >
                Invest before infrastructure, tourism, and connectivity projects
                significantly increase land values.
              </p>
            </div>

            {/* RIGHT BUTTONS */}
            <div className="mt-4 flex w-full flex-wrap items-center gap-5 lg:w-auto lg:mt-0">
              <Link
                href="/properties"
                className="
    flex
    h-16
    min-w-[240px]
    items-center
    justify-center
    rounded-full
    bg-[#05a336]
    px-10
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

              <Link
                href="/contact"
                className="
    flex
    h-16
    min-w-[240px]
    items-center
    justify-center
    rounded-full
    border
    border-white/30
    bg-white/10
    px-10
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
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
