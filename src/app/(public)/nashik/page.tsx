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
    <main className="overflow-hidden bg-[#f6faf7] pb-24 md:pb-0">
      <NashikHero />

      <TrustStrip />

      <WhyInvestSlider />

      <InfrastructureSection />

      <HotLocalities />

      <InvestmentConsultationForm />

      <FAQSection />

      <FinalInvestmentCTA />

      <StickyInvestmentCTA />
    </main>
  );
}
