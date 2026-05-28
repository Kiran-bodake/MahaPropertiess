"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const infra = [
  {
    title: "Bullet Train Connectivity",
    image: "/nashik/bullet-train.jpg",
    desc: "Future high-speed connectivity can accelerate long-term appreciation and improve regional accessibility.",
    stats: "Mumbai–Nashik Corridor",
  },

  {
    title: "Ring Road Development",
    image: "/nashik/ring-road.jpg",
    desc: "Ring road and smart city initiatives are reshaping urban growth and unlocking new investment zones.",
    stats: "Smart Mobility Expansion",
  },

  {
    title: "Industrial Expansion",
    image: "/nashik/industrial.jpg",
    desc: "MIDC and industrial corridors continue increasing housing demand and employment opportunities.",
    stats: "Growing Employment Hub",
  },
];

export default function InfrastructurePage() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
          padding: mobile ? "70px 18px 55px" : "85px 22px 70px",
          background:
            "linear-gradient(135deg, #07111f 0%, #0f172a 55%, #132238 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-100px",
            width: mobile ? "220px" : "360px",
            height: mobile ? "220px" : "360px",
            borderRadius: "50%",
            background: "rgba(34,197,94,0.12)",
            filter: "blur(40px)",
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
              fontSize: mobile ? "11px" : "12px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            Infrastructure Growth
          </p>

          <h1
            style={{
              color: "#ffffff",
              fontSize: mobile ? "38px" : "60px",
              lineHeight: mobile ? "1.08" : "1",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              maxWidth: "760px",
              margin: 0,
            }}
          >
            Infrastructure Driving Nashik’s Future Appreciation
          </h1>

          <p
            style={{
              marginTop: mobile ? "22px" : "26px",
              maxWidth: "680px",
              color: "rgba(255,255,255,0.72)",
              fontSize: mobile ? "15px" : "18px",
              lineHeight: mobile ? "1.9" : "1.9",
            }}
          >
            Strategic infrastructure investments, industrial expansion, and
            upcoming transportation corridors are transforming Nashik into one
            of Maharashtra’s fastest-growing real estate destinations.
          </p>

          {/* HERO STATS */}
          <div
            style={{
              marginTop: mobile ? "34px" : "45px",
              display: "grid",
              gridTemplateColumns: mobile
                ? "1fr"
                : "repeat(auto-fit,minmax(220px,1fr))",
              gap: "18px",
            }}
          >
            {[
              {
                number: "₹12,000+ Cr",
                label: "Infrastructure Investments",
              },
              {
                number: "Rapid Growth",
                label: "Emerging Real Estate Demand",
              },
              {
                number: "Smart City",
                label: "Urban Development Initiatives",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  padding: mobile ? "20px" : "24px",
                  borderRadius: "24px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize: mobile ? "26px" : "30px",
                    fontWeight: 900,
                  }}
                >
                  {item.number}
                </h3>

                <p
                  style={{
                    marginTop: "10px",
                    color: "rgba(255,255,255,0.68)",
                    fontSize: mobile ? "13px" : "14px",
                    lineHeight: "1.7",
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE SECTION */}
      <section
        style={{
          padding: mobile ? "55px 18px" : "80px 22px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: mobile ? "40px" : "60px",
          }}
        >
          {infra.map((item, index) => (
            <div
              key={item.title}
              style={{
                background: "#ffffff",
                borderRadius: mobile ? "26px" : "34px",
                padding: mobile ? "16px" : "24px",
                boxShadow: "0 15px 45px rgba(15,23,42,0.06)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: mobile
                    ? "1fr"
                    : "1.25fr 0.9fr",
                  gap: mobile ? "28px" : "45px",
                  alignItems: "center",
                }}
              >
                {/* IMAGE */}
                <div
                  style={{
                    order:
                      mobile
                        ? 1
                        : index % 2 === 0
                        ? 1
                        : 2,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: mobile ? "300px" : "500px",
                      borderRadius: mobile ? "22px" : "30px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05))",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        bottom: mobile ? "18px" : "24px",
                        left: mobile ? "18px" : "24px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: mobile
                            ? "9px 14px"
                            : "10px 18px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.14)",
                          backdropFilter: "blur(12px)",
                          color: "#ffffff",
                          fontSize: mobile ? "11px" : "12px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.stats}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div
                  style={{
                    order:
                      mobile
                        ? 2
                        : index % 2 === 0
                        ? 2
                        : 1,
                    paddingRight: mobile ? "0px" : "15px",
                  }}
                >
                  <div
                    style={{
                      width: mobile ? "62px" : "72px",
                      height: mobile ? "62px" : "72px",
                      borderRadius: mobile ? "18px" : "22px",
                      background:
                        "linear-gradient(135deg,#16a34a,#22c55e)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: mobile ? "20px" : "28px",
                      boxShadow:
                        "0 10px 25px rgba(34,197,94,0.22)",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontSize: mobile ? "22px" : "26px",
                        fontWeight: 900,
                      }}
                    >
                      0{index + 1}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: mobile ? "32px" : "42px",
                      lineHeight: "1.08",
                      fontWeight: 900,
                      color: "#0f172a",
                      margin: 0,
                      letterSpacing: "-0.04em",
                      maxWidth: mobile ? "100%" : "440px",
                    }}
                  >
                    {item.title}
                  </h2>

                  <p
                    style={{
                      marginTop: mobile ? "18px" : "22px",
                      fontSize: mobile ? "15px" : "17px",
                      lineHeight: "1.9",
                      color: "#475569",
                      maxWidth: mobile ? "100%" : "460px",
                    }}
                  >
                    {item.desc}
                  </p>

                  <div
                    style={{
                      marginTop: mobile ? "24px" : "30px",
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      maxWidth: mobile ? "100%" : "460px",
                    }}
                  >
                    {[
                      "Long-Term Growth",
                      "High Appreciation",
                      "Infrastructure Expansion",
                    ].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: mobile
                            ? "9px 14px"
                            : "10px 16px",
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        style={{
          padding: mobile ? "0 18px 70px" : "0 22px 90px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            background:
              "linear-gradient(135deg,#0f172a 0%, #111827 100%)",
            borderRadius: mobile ? "28px" : "36px",
            padding: mobile ? "38px 24px" : "60px 50px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-80px",
              top: "-80px",
              width: mobile ? "180px" : "240px",
              height: mobile ? "180px" : "240px",
              borderRadius: "50%",
              background: "rgba(34,197,94,0.15)",
              filter: "blur(20px)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "720px",
            }}
          >
            <p
              style={{
                color: "#4ade80",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontSize: mobile ? "11px" : "12px",
              }}
            >
              Investment Opportunity
            </p>

            <h2
              style={{
                marginTop: "20px",
                color: "#ffffff",
                fontSize: mobile ? "34px" : "48px",
                lineHeight: "1.08",
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              Nashik’s Infrastructure Boom is Creating Strong Real Estate Demand
            </h2>

            <p
              style={{
                marginTop: "20px",
                color: "rgba(255,255,255,0.72)",
                fontSize: mobile ? "15px" : "17px",
                lineHeight: "1.9",
                maxWidth: "640px",
              }}
            >
              From industrial growth to improved connectivity, infrastructure
              development is positioning Nashik as a premium long-term
              investment destination.
            </p>

            <button
              style={{
                marginTop: "28px",
                padding: mobile
                  ? "14px 22px"
                  : "16px 32px",
                borderRadius: "999px",
                border: "none",
                background:
                  "linear-gradient(135deg,#16a34a,#22c55e)",
                color: "#ffffff",
                fontSize: mobile ? "14px" : "15px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  "0 12px 30px rgba(34,197,94,0.35)",
                width: mobile ? "100%" : "auto",
              }}
            >
              Explore Investment Opportunities
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}