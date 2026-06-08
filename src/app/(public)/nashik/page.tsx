import NashikHero from "@/components/nashik/NashikHero";
import TrustStrip from "@/components/nashik/TrustStrip";
import WhyInvestSlider from "@/components/nashik/WhyInvestSlider";
import InfrastructureSection from "@/components/nashik/InfrastructureSection";
import HotLocalities from "@/components/nashik/HotLocalities";
import { getFeaturedProperties } from "@/lib/getFeaturedProperties";
import InvestmentConsultationForm from "@/components/nashik/InvestmentConsultationForm";
import FAQSection from "@/components/nashik/FAQSection";
import FinalInvestmentCTA from "@/components/nashik/FinalInvestmentCTA";
import { Navbar as MegaNavbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Why Invest in Nashik | Nashik Real Estate Investment",
  description:
    "Discover Nashik investment opportunities driven by industrial growth, wine tourism, education hubs, bullet train connectivity, and infrastructure expansion.",
};

const featuredProperties = await getFeaturedProperties(12);

export default function NashikPage() {
  return (
    <>
      <MegaNavbar />
      <main
        style={{
          background: "#f5f7fb",
          overflow: "hidden",
        }}
      >
        {/* HERO */}
        <section style={{ position: "relative" }}>
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
            padding: "80px 0 40px 0",
            background: "#f5f7fb",
          }}
        >
          <div
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              paddingLeft: "18px",
              paddingRight: "18px",
            }}
          >
            <div style={{ marginBottom: "34px", paddingLeft: "18px" }}>
              <p
                style={{
                  color: "#16a34a",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                  marginTop: 0,
                  textAlign: "left",
                }}
              >
                Why Nashik
              </p>

              <h1
                style={{
                  fontSize: "clamp(34px, 3vw, 56px)",
                  whiteSpace: "nowrap",
                  lineHeight: "1.02",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#0f172a",
                  maxWidth: "820px",
                  margin: 0,
                  textAlign: "left",
                }}
              >
                Reasons Why Investors Are Choosing Nashik
              </h1>

              <p
                style={{
                  marginTop: "18px",
                  maxWidth: "760px",
                  color: "#475569",
                  fontSize: "17px",
                  lineHeight: "1.9",
                  textAlign: "left",
                }}
              >
                From infrastructure expansion to industrial growth and future
                connectivity projects, Nashik is becoming one of Maharashtra's
                strongest emerging real estate markets.
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                boxShadow: "0 15px 45px rgba(15,23,42,0.06)",
              }}
            >
              <WhyInvestSlider />
            </div>
          </div>
        </section>

        {/* INFRASTRUCTURE */}
        <section
          style={{
            padding: "40px 0",
            background: "#f5f7fb",
          }}
        >
          <div
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              paddingLeft: "18px",
              paddingRight: "18px",
            }}
          >
            <div style={{ marginBottom: "34px", paddingLeft: "18px" }}>
              <p
                style={{
                  color: "#16a34a",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                  marginTop: 0,
                  textAlign: "left",
                }}
              >
                Infrastructure Growth
              </p>

              <h1
                style={{
                  fontSize: "clamp(34px,3vw,56px)",
                  whiteSpace: "nowrap",
                  lineHeight: "1.02",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#0f172a",
                  maxWidth: "850px",
                  margin: 0,
                  textAlign: "left",
                }}
              >
                Infrastructure Development Driving Appreciation
              </h1>

              <p
                style={{
                  marginTop: "18px",
                  maxWidth: "760px",
                  color: "#475569",
                  fontSize: "17px",
                  lineHeight: "1.9",
                  textAlign: "left",
                }}
              >
                Major projects like ring roads, smart city initiatives, and
                connectivity upgrades are reshaping Nashik's long-term real
                estate value.
              </p>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                boxShadow: "0 15px 45px rgba(15,23,42,0.06)",
              }}
            >
              <InfrastructureSection />
            </div>
          </div>
        </section>

        {/* LOCALITIES */}
        <section
          style={{
            padding: "40px 0",
            background: "#f5f7fb",
          }}
        >
          <div
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              paddingLeft: "18px",
              paddingRight: "18px",
            }}
          >
            <div style={{ marginBottom: "34px", paddingLeft: "18px" }}>
              <p
                style={{
                  color: "#16a34a",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                  marginTop: 0,
                  textAlign: "left",
                }}
              >
                Investment Corridors
              </p>

              <h1
                style={{
                  fontSize: "clamp(34px,3vw,56px)",
                  lineHeight: "1.02",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#0f172a",
                  maxWidth: "1000px",
                  whiteSpace: "nowrap",
                  margin: 0,
                  textAlign: "left",
                }}
              >
                Explore Nashik's High-Growth Localities
              </h1>

              <p
                style={{
                  marginTop: "18px",
                  maxWidth: "760px",
                  color: "#475569",
                  fontSize: "17px",
                  lineHeight: "1.9",
                  textAlign: "left",
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
                boxShadow: "0 15px 45px rgba(15,23,42,0.06)",
              }}
            >
              <HotLocalities properties={featuredProperties} />
            </div>
          </div>
        </section>

        {/* CONSULTATION */}
        <section
          style={{
            padding: "40px 0",
            background: "#f5f7fb",
          }}
        >
          <div
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              paddingLeft: "18px",
              paddingRight: "18px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#0f172a 0%, #111827 100%)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(15,23,42,0.10)",
              }}
            >
              <InvestmentConsultationForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          style={{
            padding: "40px 0",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              paddingLeft: "18px",
              paddingRight: "18px",
            }}
          >
            <div style={{ marginBottom: "34px", paddingLeft: "18px" }}>
              <p
                style={{
                  color: "#16a34a",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                  marginTop: 0,
                  textAlign: "left",
                }}
              >
                FAQs
              </p>

              <h1
                style={{
                  fontSize: "clamp(34px,3vw,56px)",
                  whiteSpace: "nowrap",
                  lineHeight: "1.02",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#0f172a",
                  maxWidth: "760px",
                  margin: 0,
                  textAlign: "left",
                }}
              >
                Frequently Asked Questions About Nashik Investment
              </h1>

              <p
                style={{
                  marginTop: "18px",
                  maxWidth: "720px",
                  color: "#475569",
                  fontSize: "17px",
                  lineHeight: "1.9",
                  textAlign: "left",
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
                boxShadow: "0 15px 45px rgba(15,23,42,0.05)",
              }}
            >
              <FAQSection />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section
          style={{
            padding: "40px 0 100px 0",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              paddingLeft: "18px",
              paddingRight: "18px",
            }}
          >
            <div
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(15,23,42,0.10)",
              }}
            >
              <FinalInvestmentCTA />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
