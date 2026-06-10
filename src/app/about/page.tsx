import Image from "next/image";
import Link from "next/link";
import { Navbar as MegaNavbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import { Building2, BadgeCheck, Users, MapPin, PhoneCall } from "lucide-react";
import type { Metadata } from "next";

const BODY_FONT = "'DM Sans', system-ui, sans-serif";

const HEADING_FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "1200+", label: "Happy Clients" },
  { value: "50+", label: "Trusted Partners" },
  { value: "8+", label: "Years Experience" },
];

const values = [
  {
    icon: BadgeCheck,
    title: "Trusted Listings",
    desc: "Verified residential and commercial properties across Maharashtra.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    desc: "Personalized support for buyers, investors and businesses.",
  },
  {
    icon: Building2,
    title: "Market Expertise",
    desc: "Strong understanding of Nashik and Maharashtra property markets.",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://mahaproperties.in"),

  title: "About MahaProperties | Maharashtra's Trusted Property Portal",

  description:
    "Learn about MahaProperties, Maharashtra's trusted real estate platform for verified residential, commercial, agricultural land, NA plots and investment properties.",

  keywords: [
    "MahaProperties",
    "About MahaProperties",
    "Properties in Maharashtra",
    "Real Estate Maharashtra",
    "Property Portal Maharashtra",
    "Properties in Nashik",
    "Agricultural Land Maharashtra",
    "Commercial Properties Maharashtra",
    "NA Plots Maharashtra",
  ],

  openGraph: {
    title: "About MahaProperties | Maharashtra's Trusted Property Portal",

    description:
      "Discover MahaProperties and our mission to provide verified property listings across Maharashtra.",

    url: "https://mahaproperties.in/about",

    siteName: "MahaProperties",

    images: [
      {
        url: "https://mahaproperties.in/about-banner.png",
        width: 1200,
        height: 630,
        alt: "About MahaProperties",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "About MahaProperties | Maharashtra's Trusted Property Portal",

    description:
      "Discover MahaProperties and our mission to provide verified property listings across Maharashtra.",

    images: ["https://mahaproperties.in/about-banner.png"],
  },

  alternates: {
    canonical: "https://mahaproperties.in/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <MegaNavbar />

      <main style={{ background: "#f9fafb", fontFamily: BODY_FONT }}>
        {/* HERO */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.58), rgba(0,0,0,0.58)), url('/about-banner.png')",

            backgroundSize: "cover",

            backgroundPosition: "center",

            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage:
                "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />

          <div
            style={{
              maxWidth: "1100px",
              margin: "auto",
              padding: "80px 20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              gap: "50px",
              alignItems: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* LEFT */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "24px",
                }}
              >
                <Building2 size={16} />
                Maharashtra’s Trusted Property Hub
              </div>

              <h1
                style={{
                  fontFamily: HEADING_FONT,
                  fontSize: "clamp(2.3rem,5vw,4.8rem)",
                  lineHeight: 0.95,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  color: "#fff",
                  marginBottom: "24px",
                  maxWidth: "820px",
                  textShadow: "0 6px 30px rgba(0,0,0,0.35)",
                }}
              >
                About MahaProperties
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.88)",
                  fontSize: "clamp(1rem,1.5vw,1.15rem)",
                  lineHeight: 1.8,
                  maxWidth: "600px",
                }}
              >
                MahaProperties helps buyers, investors, and businesses discover
                verified residential and commercial properties across
                Maharashtra with transparency, trust, and professional guidance.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginTop: "32px",
                }}
              >
                <Link
                  href="/properties"
                  style={{
                    background: "#fff",
                    color: "#166534",
                    padding: "14px 22px",
                    borderRadius: "14px",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Explore Properties
                </Link>

                <Link
                  href="/contact"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    padding: "14px 22px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section
          style={{
            marginTop: "-40px",
            position: "relative",
            zIndex: 10,
            padding: "0 20px",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "auto",
              background: "#fff",
              borderRadius: "24px",
              padding: "30px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "24px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
            }}
          >
            {stats.map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontFamily: HEADING_FONT,
                    letterSpacing: "-0.04em",
                    fontSize: "clamp(2rem,4vw,3rem)",
                    fontWeight: 700,
                    color: "#166534",
                  }}
                >
                  {item.value}
                </h3>

                <p
                  style={{
                    marginTop: "8px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT CONTENT */}
        <section
          style={{
            maxWidth: "1100px",
            margin: "auto",
            padding: "100px 20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              gap: "60px",
              alignItems: "center",
            }}
          >
            {/* IMAGE */}
            <div>
              <div
                style={{
                  position: "relative",
                  height: "520px",
                  borderRadius: "30px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                }}
              >
                <Image
                  src="/about.png"
                  alt="About MahaProperties"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div>
              <p
                style={{
                  color: "#16a34a",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Who We Are
              </p>

              <h2
                style={{
                  fontFamily: HEADING_FONT,
                  letterSpacing: "-0.04em",
                  fontSize: "clamp(2rem,5vw,4rem)",
                  lineHeight: 1.1,
                  fontWeight: 700,
                  marginTop: "16px",
                  color: "#111827",
                }}
              >
                Helping People Find Their Perfect Property
              </h2>

              <p
                style={{
                  marginTop: "30px",
                  color: "#4b5563",
                  lineHeight: 1.9,
                  fontSize: "17px",
                }}
              >
                MahaProperties combines technology, local expertise, and
                customer-focused service to simplify the property buying and
                investment journey across Maharashtra.
              </p>

              <p
                style={{
                  marginTop: "20px",
                  color: "#4b5563",
                  lineHeight: 1.9,
                  fontSize: "17px",
                }}
              >
                Whether you are searching for NA plots, commercial spaces,
                agricultural land, or investment opportunities, our platform
                helps you make confident real estate decisions.
              </p>

              <div
                style={{
                  marginTop: "35px",
                  display: "grid",
                  gap: "22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      background: "#dcfce7",
                      padding: "14px",
                      borderRadius: "16px",
                      color: "#16a34a",
                    }}
                  >
                    <MapPin size={22} />
                  </div>

                  <div>
                    <h4
                      style={{
                        fontWeight: 700,
                        fontSize: "18px",
                        color: "#111827",
                      }}
                    >
                      Maharashtra Focused
                    </h4>

                    <p
                      style={{
                        marginTop: "6px",
                        color: "#6b7280",
                        lineHeight: 1.7,
                      }}
                    >
                      Specialized expertise in Nashik and Maharashtra property
                      markets.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      background: "#dcfce7",
                      padding: "14px",
                      borderRadius: "16px",
                      color: "#16a34a",
                    }}
                  >
                    <PhoneCall size={22} />
                  </div>

                  <div>
                    <h4
                      style={{
                        fontWeight: 800,
                        fontSize: "18px",
                        color: "#111827",
                      }}
                    >
                      Dedicated Support
                    </h4>

                    <p
                      style={{
                        marginTop: "6px",
                        color: "#6b7280",
                        lineHeight: 1.7,
                      }}
                    >
                      Professional assistance for buyers, sellers and investors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section
          style={{
            background: "#fff",
            padding: "100px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "auto",
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: "700px",
                margin: "auto",
              }}
            >
              <p
                style={{
                  color: "#16a34a",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Why Choose Us
              </p>

              <h2
                style={{
                  fontFamily: HEADING_FONT,
                  letterSpacing: "-0.04em",
                  fontSize: "clamp(2rem,5vw,4rem)",
                  lineHeight: 1.1,
                  fontWeight: 700,
                  marginTop: "16px",
                  color: "#111827",
                }}
              >
                Trusted Real Estate Platform
              </h2>

              <p
                style={{
                  marginTop: "24px",
                  color: "#6b7280",
                  lineHeight: 1.8,
                  fontSize: "17px",
                }}
              >
                We focus on transparency, verified listings and professional
                guidance to deliver a seamless property experience.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: "24px",
                marginTop: "60px",
              }}
            >
              {values.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    style={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "24px",
                      padding: "30px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "18px",
                        background: "#dcfce7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#16a34a",
                      }}
                    >
                      <Icon size={28} />
                    </div>

                    <h3
                      style={{
                        fontFamily: HEADING_FONT,
                        letterSpacing: "-0.03em",
                        marginTop: "24px",
                        fontSize: "22px",
                        fontWeight: 800,
                        color: "#111827",
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        marginTop: "14px",
                        color: "#6b7280",
                        lineHeight: 1.8,
                        fontSize: "15px",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
