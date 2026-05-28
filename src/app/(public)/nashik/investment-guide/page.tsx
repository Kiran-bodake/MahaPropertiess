"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  TrendingUp,
  Landmark,
  Building2,
} from "lucide-react";

const guides = [
  {
    title: "Best Areas For Investment",
    desc: "Explore Nashik’s fastest appreciating investment corridors with strong residential growth and future returns.",
    icon: TrendingUp,
  },

  {
    title: "Commercial Investment",
    desc: "Discover premium commercial opportunities near industrial hubs, business districts, and high-demand zones.",
    icon: Building2,
  },

  {
    title: "Future Appreciation Corridors",
    desc: "Identify emerging corridors benefiting from infrastructure projects, smart city development, and connectivity expansion.",
    icon: Landmark,
  },
];

export default function InvestmentGuidePage() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: mobile
            ? "75px 18px 65px"
            : "110px 24px 90px",
          background:
            "linear-gradient(135deg,#07150d 0%, #102318 55%, #173924 100%)",
        }}
      >
        {/* BACKGROUND GLOW */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-100px",
            width: mobile ? "220px" : "420px",
            height: mobile ? "220px" : "420px",
            borderRadius: "50%",
            background: "rgba(34,197,94,0.14)",
            filter: "blur(40px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-100px",
            width: mobile ? "220px" : "360px",
            height: mobile ? "220px" : "360px",
            borderRadius: "50%",
            background: "rgba(74,222,128,0.10)",
            filter: "blur(50px)",
          }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          <p
            style={{
              color: "#4ade80",
              fontSize: mobile ? "11px" : "13px",
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: "22px",
            }}
          >
            Investment Guide
          </p>

          <h1
            style={{
              color: "#ffffff",
              fontSize: mobile ? "40px" : "68px",
              lineHeight: mobile ? "1.08" : "1",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              maxWidth: "860px",
              margin: 0,
            }}
          >
            Smart Real Estate Investment Opportunities In Nashik
          </h1>

          <p
            style={{
              marginTop: mobile ? "24px" : "30px",
              maxWidth: "760px",
              color: "rgba(255,255,255,0.76)",
              fontSize: mobile ? "15px" : "19px",
              lineHeight: "1.95",
            }}
          >
            Learn where investors are focusing, which corridors are growing,
            and how infrastructure development is shaping future appreciation
            across Nashik’s evolving real estate market.
          </p>

          {/* HERO STATS */}
          <div
            style={{
              marginTop: mobile ? "38px" : "55px",
              display: "grid",
              gridTemplateColumns: mobile
                ? "1fr"
                : "repeat(auto-fit,minmax(220px,1fr))",
              gap: "18px",
            }}
          >
            {[
              {
                number: "High ROI",
                label: "Fast Appreciating Corridors",
              },
              {
                number: "Commercial Growth",
                label: "Industrial & Business Expansion",
              },
              {
                number: "Future Ready",
                label: "Infrastructure Driven Demand",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(10px)",
                  padding: mobile ? "20px" : "24px",
                  borderRadius: "26px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize: mobile ? "26px" : "32px",
                    fontWeight: 900,
                    lineHeight: "1.1",
                  }}
                >
                  {item.number}
                </h3>

                <p
                  style={{
                    marginTop: "10px",
                    color: "rgba(255,255,255,0.68)",
                    fontSize: mobile ? "13px" : "14px",
                    lineHeight: "1.8",
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDE CARDS */}
      <section
        style={{
          padding: mobile ? "55px 18px 75px" : "90px 24px 110px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: mobile
              ? "1fr"
              : "repeat(auto-fit,minmax(320px,1fr))",
            gap: mobile ? "22px" : "30px",
          }}
        >
          {guides.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: "#ffffff",
                  borderRadius: mobile ? "28px" : "36px",
                  padding: mobile ? "28px" : "36px",
                  border: "1px solid #edf2f7",
                  boxShadow:
                    "0 18px 50px rgba(15,23,42,0.06)",
                  transition: "0.3s ease",
                }}
              >
                {/* TOP BADGE */}
                <div
                  style={{
                    position: "absolute",
                    top: "22px",
                    right: "22px",
                    width: mobile ? "38px" : "42px",
                    height: mobile ? "38px" : "42px",
                    borderRadius: "50%",
                    background: "#f0fdf4",
                    color: "#16a34a",
                    fontSize: mobile ? "14px" : "15px",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  0{index + 1}
                </div>

                {/* ICON */}
                <div
                  style={{
                    width: mobile ? "64px" : "72px",
                    height: mobile ? "64px" : "72px",
                    borderRadius: mobile ? "20px" : "24px",
                    background:
                      "linear-gradient(135deg,#dcfce7,#f0fdf4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #bbf7d0",
                    boxShadow:
                      "0 10px 25px rgba(34,197,94,0.10)",
                  }}
                >
                  <Icon
                    size={mobile ? 28 : 34}
                    color="#16a34a"
                  />
                </div>

                {/* TITLE */}
                <h2
                  style={{
                    marginTop: mobile ? "24px" : "30px",
                    fontSize: mobile ? "30px" : "38px",
                    lineHeight: "1.08",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "#0f172a",
                    maxWidth: "320px",
                  }}
                >
                  {item.title}
                </h2>

                {/* DESCRIPTION */}
                <p
                  style={{
                    marginTop: mobile ? "16px" : "20px",
                    fontSize: mobile ? "15px" : "17px",
                    lineHeight: "1.9",
                    color: "#475569",
                  }}
                >
                  {item.desc}
                </p>

                {/* FEATURES */}
                <div
                  style={{
                    marginTop: mobile ? "22px" : "28px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {[
                    "Growth Zones",
                    "High Demand",
                    "Future ROI",
                  ].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: mobile
                          ? "8px 12px"
                          : "10px 14px",
                        borderRadius: "999px",
                        background: "#f0fdf4",
                        color: "#15803d",
                        fontSize: mobile ? "12px" : "13px",
                        fontWeight: 600,
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* LINK */}
                <Link
                  href="/properties"
                  style={{
                    marginTop: mobile ? "28px" : "34px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#16a34a",
                    fontWeight: 700,
                    fontSize: mobile ? "14px" : "15px",
                    textDecoration: "none",
                  }}
                >
                  Explore Opportunities

                  <ArrowRight size={18} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        style={{
          padding: mobile ? "0 18px 70px" : "0 24px 100px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            borderRadius: mobile ? "30px" : "42px",
            padding: mobile ? "38px 24px" : "65px 55px",
            background:
              "linear-gradient(135deg,#0f172a 0%, #111827 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* GLOW */}
          <div
            style={{
              position: "absolute",
              top: "-90px",
              right: "-90px",
              width: mobile ? "180px" : "260px",
              height: mobile ? "180px" : "260px",
              borderRadius: "50%",
              background: "rgba(34,197,94,0.15)",
              filter: "blur(20px)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "760px",
            }}
          >
            <p
              style={{
                color: "#4ade80",
                fontSize: mobile ? "11px" : "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
              }}
            >
              Real Estate Growth
            </p>

            <h2
              style={{
                marginTop: "20px",
                color: "#ffffff",
                fontSize: mobile ? "34px" : "52px",
                lineHeight: "1.05",
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              Invest Early In Nashik’s Emerging Growth Corridors
            </h2>

            <p
              style={{
                marginTop: "22px",
                color: "rgba(255,255,255,0.72)",
                fontSize: mobile ? "15px" : "18px",
                lineHeight: "1.95",
                maxWidth: "650px",
              }}
            >
              Smart investors are focusing on infrastructure-driven locations,
              industrial expansion zones, and future appreciation corridors
              across Nashik.
            </p>

            <Link
              href="/properties"
              style={{
                marginTop: "32px",
                display: mobile ? "flex" : "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: mobile ? "100%" : "fit-content",
                padding: mobile
                  ? "15px 20px"
                  : "16px 34px",
                borderRadius: "999px",
                background:
                  "linear-gradient(135deg,#16a34a,#22c55e)",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: mobile ? "14px" : "15px",
                fontWeight: 700,
                boxShadow:
                  "0 12px 30px rgba(34,197,94,0.35)",
              }}
            >
              Explore Investment Properties

              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}