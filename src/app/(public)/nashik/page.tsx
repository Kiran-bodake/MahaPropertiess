import NashikHero from "@/components/nashik/NashikHero";
import TrustStrip from "@/components/nashik/TrustStrip";
import WhyInvestSlider from "@/components/nashik/WhyInvestSlider";
import InfrastructureSection from "@/components/nashik/InfrastructureSection";
import HotLocalities from "@/components/nashik/HotLocalities";
import InvestmentConsultationForm from "@/components/nashik/InvestmentConsultationForm";
import FAQSection from "@/components/nashik/FAQSection";
import FinalInvestmentCTA from "@/components/nashik/FinalInvestmentCTA";
import StickyInvestmentCTA from "@/components/nashik/StickyInvestmentCTA";

export const metadata = {
  title: "Why Invest in Nashik | Nashik Real Estate Investment",

  description:
    "Discover Nashik investment opportunities driven by industrial growth, wine tourism, education hubs, bullet train connectivity, and infrastructure expansion.",
};

export default function NashikPage() {
  return (
    <main className="bg-[#f6faf7]">
      <NashikHero />

      <TrustStrip />

      {/* WHY INVEST */}
      <section className="bg-[#f6faf7] px-4 py-16 md:px-8 md:py-24 lg:py-32 mb-16 md:mb-28 lg:mb-40">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <WhyInvestSlider />
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      <section className="bg-[#f6faf7] px-4 py-16 md:px-8 md:py-24 lg:py-32 mb-16 md:mb-28 lg:mb-40">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <InfrastructureSection />
        </div>
      </section>

      {/* LOCALITIES */}
      <section className="bg-[#f6faf7] px-4 py-16 md:px-8 md:py-24 lg:py-32 mb-16 md:mb-28 lg:mb-40">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <HotLocalities />
        </div>
      </section>

      {/* CONSULTATION */}
      <section className="bg-[#f6faf7] px-4 py-16 md:px-8 md:py-24 lg:py-32 mb-16 md:mb-28 lg:mb-40">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px]">
          <InvestmentConsultationForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-4 py-16 md:px-8 md:py-24 lg:py-32 mb-16 md:mb-28 lg:mb-40">
        <div className="mx-auto max-w-7xl">
          <FAQSection />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white px-4 py-16 md:px-8 md:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px]">
          <FinalInvestmentCTA />
        </div>
      </section>

      <StickyInvestmentCTA />
    </main>
  );
}
