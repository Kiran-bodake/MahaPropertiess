"use client";

import { useEffect, useState } from "react";

const trends = [
  {
    area: "Gangapur Road",
    price: "₹8,500/sq.ft",
    growth: "+18%",
  },

  {
    area: "Pathardi",
    price: "₹5,200/sq.ft",
    growth: "+22%",
  },

  {
    area: "Nashik Road",
    price: "₹6,800/sq.ft",
    growth: "+16%",
  },

  {
    area: "Trimbak Road",
    price: "₹7,100/sq.ft",
    growth: "+14%",
  },
];

export default function PriceTrendsPage() {
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
        {/* GLOW EFFECT */}
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
            Price Trends
          </p>

          <h1
            style={{
              color: "#ffffff",
              fontSize: mobile ? "40px" : "68px",
              lineHeight: mobile ? "1.08" : "1",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              maxWidth: "920px",
              margin: 0,
            }}
          >
            Nashik Real Estate Price Appreciation Trends
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
            Analyze locality-wise property appreciation, investment growth,
            and emerging residential corridors shaping Nashik’s real estate
            market.
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
                number: "+22%",
                label: "Highest Annual Growth",
              },
              {
                number: "Premium Zones",
                label: "Strong Investment Demand",
              },
              {
                number: "Future Growth",
                label: "Infrastructure Driven Appreciation",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(10px)",
                  padding: mobile ? "20px" : "24px",
                  borderRadius: "18px",
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

      {/* PRICE TABLE SECTION */}
      <section
        style={{
          padding: mobile ? "55px 18px 70px" : "90px 24px 100px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {/* SECTION HEADER */}
          <div
            style={{
              marginBottom: mobile ? "30px" : "42px",
            }}
          >
            <p
              style={{
                color: "#16a34a",
                fontSize: mobile ? "11px" : "13px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Market Analysis
            </p>

            <h2
              style={{
                color: "#0f172a",
                fontSize: mobile ? "34px" : "52px",
                lineHeight: "1.05",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                maxWidth: "760px",
                margin: 0,
              }}
            >
              Locality Wise Property Appreciation Overview
            </h2>

            <p
              style={{
                marginTop: "18px",
                maxWidth: "720px",
                color: "#475569",
                fontSize: mobile ? "15px" : "18px",
                lineHeight: "1.95",
              }}
            >
              Compare property prices, annual appreciation trends, and
              investment growth across Nashik’s rapidly developing locations.
            </p>
          </div>

          {/* TABLE CARD */}
          <div
            style={{
              overflow: "hidden",
              borderRadius: mobile ? "18px" : "22px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              boxShadow:
                "0 18px 50px rgba(15,23,42,0.06)",
            }}
          >
            {/* TABLE HEADER */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: mobile
                  ? "1fr 1fr"
                  : "1.5fr 1fr 1fr",
                background:
                  "linear-gradient(135deg,#16a34a,#22c55e)",
                padding: mobile
                  ? "16px 18px"
                  : "18px 24px",
                color: "#ffffff",
                fontSize: mobile ? "12px" : "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <div>Locality</div>

              <div
                style={{
                  textAlign: mobile ? "right" : "left",
                }}
              >
                Avg Price
              </div>

              {!mobile && <div>YoY Growth</div>}
            </div>

            {/* TABLE BODY */}
            {trends.map((item, index) => (
              <div
                key={item.area}
                style={{
                  display: "grid",
                  gridTemplateColumns: mobile
                    ? "1fr 1fr"
                    : "1.5fr 1fr 1fr",
                  padding: mobile
                    ? "20px 18px"
                    : "24px",
                  alignItems: "center",
                  borderTop:
                    index !== 0
                      ? "1px solid #f1f5f9"
                      : "none",
                  background:
                    index % 2 === 0
                      ? "#ffffff"
                      : "#fafafa",
                }}
              >
                {/* AREA */}
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#0f172a",
                      fontSize: mobile ? "16px" : "18px",
                      fontWeight: 700,
                    }}
                  >
                    {item.area}
                  </h3>

                  {mobile && (
                    <p
                      style={{
                        marginTop: "8px",
                        color: "#16a34a",
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      {item.growth} Growth
                    </p>
                  )}
                </div>

                {/* PRICE */}
                <div
                  style={{
                    textAlign: mobile ? "right" : "left",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#334155",
                      fontSize: mobile ? "15px" : "16px",
                      fontWeight: 600,
                    }}
                  >
                    {item.price}
                  </p>
                </div>

                {/* GROWTH */}
                {!mobile && (
                  <div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px 16px",
                        borderRadius: "999px",
                        background: "#f0fdf4",
                        color: "#16a34a",
                        fontSize: "14px",
                        fontWeight: 700,
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      {item.growth}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
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
            borderRadius: mobile ? "20px" : "24px",
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
              Investment Insights
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
              Invest In Locations Showing Strong Appreciation Growth
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
              Rapid infrastructure expansion and increasing residential demand
              are driving strong property appreciation across Nashik’s key
              growth corridors.
            </p>

            <button
              style={{
                marginTop: "32px",
                display: mobile ? "flex" : "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: mobile ? "100%" : "fit-content",
                padding: mobile
                  ? "15px 20px"
                  : "16px 34px",
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