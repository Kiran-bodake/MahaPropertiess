"use client";

import { useEffect, useState } from "react";
import HotLocalities from "@/components/nashik/HotLocalities";

export default function LocalitiesPage() {
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
            Nashik Localities
          </p>

          <h1
            style={{
              color: "#ffffff",
              fontSize: mobile ? "40px" : "68px",
              lineHeight: mobile ? "1.08" : "1",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              maxWidth: "900px",
              margin: 0,
            }}
          >
            Explore High-Growth Investment Corridors In Nashik
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
            Discover premium residential and commercial localities across
            Nashik with strong infrastructure growth, future appreciation
            potential, and rising real estate demand.
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
                number: "High Growth",
                label: "Emerging Investment Corridors",
              },
              {
                number: "Infrastructure",
                label: "Connectivity & Smart Development",
              },
              {
                number: "Future Ready",
                label: "Premium Appreciation Potential",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(10px)",
                  padding: mobile ? "20px" : "24px",
                  borderRadius: "18px", // REDUCED CURVE
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

      {/* LOCALITIES SECTION */}
      <section
        style={{
          position: "relative",
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
              marginBottom: mobile ? "34px" : "50px",
            }}
          >
            <p
              style={{
                color: "#16a34a",
                fontSize: mobile ? "11px" : "13px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Featured Corridors
            </p>

            <h2
              style={{
                color: "#0f172a",
                fontSize: mobile ? "34px" : "54px",
                lineHeight: "1.05",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                maxWidth: "760px",
                margin: 0,
              }}
            >
              Most Preferred Real Estate Investment Locations
            </h2>

            <p
              style={{
                marginTop: "20px",
                maxWidth: "720px",
                color: "#475569",
                fontSize: mobile ? "15px" : "18px",
                lineHeight: "1.95",
              }}
            >
              Explore rapidly developing localities with premium residential
              projects, commercial opportunities, infrastructure upgrades, and
              future growth potential.
            </p>
          </div>

          {/* HOT LOCALITIES COMPONENT WRAPPER */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              borderRadius: mobile ? "18px" : "22px", // REDUCED CURVE
              overflow: "hidden",
            }}
          >
            <HotLocalities />
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
            borderRadius: mobile ? "20px" : "24px", // REDUCED CURVE
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
              Investment Opportunities
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
              Find The Right Locality Before Property Prices Rise
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
              Infrastructure development, industrial expansion, and smart city
              projects are rapidly increasing demand across Nashik’s key growth
              corridors.
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
              Explore Premium Localities
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}