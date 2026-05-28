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
    <main
      style={{
        background: "#f5f7fb",
        overflow: "hidden",
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: "relative",
        }}
      >
        <NashikHero />
      </section>

      {/* TRUST STRIP */}
      <section
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: "-1px",
        }}
      >
        <TrustStrip />
      </section>

      {/* WHY INVEST */}
      <section
        style={{
          padding: "80px 18px 40px",
          background: "#f5f7fb",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
          }}
        >
          {/* SECTION HEADER */}
          <div
            style={{
              marginBottom: "34px",
            }}
          >
            <p
              style={{
                color: "#16a34a",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Why Nashik
            </p>

            <h2
              style={{
                fontSize: "clamp(34px,5vw,58px)",
                lineHeight: "1.02",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#0f172a",
                maxWidth: "820px",
                margin: 0,
              }}
            >
              Reasons Why Investors Are Choosing Nashik
            </h2>

            <p
              style={{
                marginTop: "18px",
                maxWidth: "760px",
                color: "#475569",
                fontSize: "17px",
                lineHeight: "1.9",
              }}
            >
              From infrastructure expansion to industrial growth and future
              connectivity projects, Nashik is becoming one of Maharashtra’s
              strongest emerging real estate markets.
            </p>
          </div>

          {/* CARD */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 15px 45px rgba(15,23,42,0.06)",
            }}
          >
            <WhyInvestSlider />
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      <section
        style={{
          padding: "40px 18px",
          background: "#f5f7fb",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              marginBottom: "34px",
            }}
          >
            <p
              style={{
                color: "#16a34a",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Infrastructure Growth
            </p>

            <h2
              style={{
                fontSize: "clamp(34px,5vw,58px)",
                lineHeight: "1.02",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#0f172a",
                maxWidth: "850px",
                margin: 0,
              }}
            >
              Infrastructure Development Driving Appreciation
            </h2>

            <p
              style={{
                marginTop: "18px",
                maxWidth: "760px",
                color: "#475569",
                fontSize: "17px",
                lineHeight: "1.9",
              }}
            >
              Major projects like ring roads, smart city initiatives, and
              connectivity upgrades are reshaping Nashik’s long-term real estate
              value.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 15px 45px rgba(15,23,42,0.06)",
            }}
          >
            <InfrastructureSection />
          </div>
        </div>
      </section>

      {/* LOCALITIES */}
      <section
        style={{
          padding: "40px 18px",
          background: "#f5f7fb",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              marginBottom: "34px",
            }}
          >
            <p
              style={{
                color: "#16a34a",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Investment Corridors
            </p>

            <h2
              style={{
                fontSize: "clamp(34px,5vw,58px)",
                lineHeight: "1.02",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#0f172a",
                maxWidth: "850px",
                margin: 0,
              }}
            >
              Explore Nashik’s High-Growth Localities
            </h2>

            <p
              style={{
                marginTop: "18px",
                maxWidth: "760px",
                color: "#475569",
                fontSize: "17px",
                lineHeight: "1.9",
              }}
            >
              Discover premium residential and commercial corridors with
              increasing demand, strong appreciation, and future-ready
              infrastructure.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 15px 45px rgba(15,23,42,0.06)",
            }}
          >
            <HotLocalities />
          </div>
        </div>
      </section>

      {/* CONSULTATION */}
      <section
        style={{
          padding: "40px 18px",
          background: "#f5f7fb",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg,#0f172a 0%, #111827 100%)",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow:
                "0 20px 50px rgba(15,23,42,0.10)",
            }}
          >
            <InvestmentConsultationForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          padding: "40px 18px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              marginBottom: "34px",
            }}
          >
            <p
              style={{
                color: "#16a34a",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              FAQs
            </p>

            <h2
              style={{
                fontSize: "clamp(34px,5vw,58px)",
                lineHeight: "1.02",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#0f172a",
                maxWidth: "760px",
                margin: 0,
              }}
            >
              Frequently Asked Questions About Nashik Investment
            </h2>

            <p
              style={{
                marginTop: "18px",
                maxWidth: "720px",
                color: "#475569",
                fontSize: "17px",
                lineHeight: "1.9",
              }}
            >
              Understand investment potential, infrastructure growth, future
              appreciation, and the best opportunities available in Nashik.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px solid #e5e7eb",
              padding: "8px",
              boxShadow:
                "0 15px 45px rgba(15,23,42,0.05)",
            }}
          >
            <FAQSection />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          padding: "40px 18px 100px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow:
                "0 20px 60px rgba(15,23,42,0.10)",
            }}
          >
            <FinalInvestmentCTA />
          </div>
        </div>
      </section>

      {/* STICKY CTA */}
      <StickyInvestmentCTA />
    </main>
  );
}