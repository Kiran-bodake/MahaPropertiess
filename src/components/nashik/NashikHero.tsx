"use client";

import Link from "next/link";

import {
  Building2,
  MapPinned,
  Factory,
  TrendingUp,
} from "lucide-react";

export default function NashikHero() {
  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        minHeight: "88vh",
        alignItems: "center",
        overflow: "hidden",
        backgroundImage:
          "url('/nashik/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.78), rgba(0,0,0,0.58), rgba(0,0,0,0.28))",
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "160px 20px 100px",
        }}
      >
        <div
          style={{
            maxWidth: "850px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          {/* TOP BADGE */}
          <div
            style={{
              marginBottom: "20px",
              display: "inline-flex",
              alignSelf: "flex-start",
              borderRadius: "999px",
              border:
                "1px solid rgba(255,255,255,0.2)",
              background:
                "rgba(255,255,255,0.12)",
              padding: "14px 24px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#ffffff",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.25)",
            }}
          >
            Maharashtra's Emerging
            Investment Destination
          </div>

          {/* TITLE */}
          <h1
            style={{
              maxWidth: "900px",
              margin: 0,
              fontSize: "76px",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              textShadow:
                "0 10px 40px rgba(0,0,0,0.65)",
            }}
          >
            Invest In Nashik's Fastest
            <br />
            Growing Corridors
          </h1>

          {/* DESCRIPTION */}
          <p
            style={{
              maxWidth: "720px",
              fontSize: "21px",
              lineHeight: 1.9,
              color:
                "rgba(255,255,255,0.9)",
              textShadow:
                "0 6px 18px rgba(0,0,0,0.35)",
              margin: 0,
            }}
          >
            Discover premium land and
            property investment
            opportunities powered by
            infrastructure growth,
            industrial expansion,
            tourism, and future
            connectivity.
          </p>

          {/* BUTTONS */}
          <div
            style={{
              marginTop: "18px",
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <Link
              href="/properties"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "18px",
                background: "#16a34a",
                padding: "18px 34px",
                fontWeight: 700,
                color: "#ffffff",
                textDecoration: "none",
                boxShadow:
                  "0 15px 40px rgba(22,163,74,0.35)",
                transition:
                  "all .3s ease",
              }}
            >
              Explore Properties
            </Link>

            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "18px",
                border:
                  "1px solid rgba(255,255,255,0.3)",
                background:
                  "rgba(255,255,255,0.12)",
                padding: "18px 34px",
                fontWeight: 700,
                color: "#ffffff",
                backdropFilter:
                  "blur(18px)",
                cursor: "pointer",
                transition:
                  "all .3s ease",
              }}
            >
              Get Free Consultation
            </button>
          </div>

          {/* STATS CARDS */}
          <div
            style={{
              marginTop: "70px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
            }}
          >
            {[
              {
                icon: Building2,
                text: "2500+ Verified Properties",
              },

              {
                icon: MapPinned,
                text: "40+ Investment Localities",
              },

              {
                icon: Factory,
                text: "Industrial Expansion Hub",
              },

              {
                icon: TrendingUp,
                text: "High Appreciation Corridors",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  style={{
                    borderRadius: "20px",
                    border:
                      "1px solid rgba(255,255,255,0.15)",
                    background:
                      "rgba(255,255,255,0.1)",
                    padding: "24px",
                    backdropFilter:
                      "blur(18px)",
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.18)",
                    transition:
                      "all .3s ease",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "18px",
                      display: "flex",
                      height: "52px",
                      width: "52px",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "18px",
                      background:
                        "rgba(255,255,255,0.12)",
                    }}
                  >
                    <Icon
                      style={{
                        width: "26px",
                        height: "26px",
                        color: "#86efac",
                      }}
                    />
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      fontWeight: 700,
                      lineHeight: 1.7,
                      color: "#ffffff",
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}