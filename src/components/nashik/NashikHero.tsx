"use client";

import Link from "next/link";

import { Building2, MapPinned, Factory, TrendingUp } from "lucide-react";

export default function NashikHero() {
  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        minHeight: "70vh",
        alignItems: "center",
        overflow: "hidden",
        backgroundImage: "url('/nashik/hero.jpg')",
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
          padding: "100px 20px 60px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
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
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.12)",
              padding: "14px 24px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#ffffff",
              backdropFilter: "blur(20px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
            }}
          >
            Maharashtra's Emerging Investment Destination
          </div>

          {/* TITLE */}
          <h1
            className="heroTitle"
            style={{
              maxWidth: "900px",
              margin: 0,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              textShadow: "0 10px 40px rgba(0,0,0,0.65)",
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
              fontSize: "19px",
              lineHeight: 1.9,
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 6px 18px rgba(0,0,0,0.35)",
              margin: 0,
            }}
          >
            Discover premium land and property investment opportunities powered
            by infrastructure growth, industrial expansion, tourism, and future
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
                boxShadow: "0 15px 40px rgba(22,163,74,0.35)",
                transition: "all .3s ease",
              }}
            >
              Explore Properties
            </Link>

            <Link href="/contact">
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.12)",
                  padding: "18px 34px",
                  fontWeight: 700,
                  color: "#ffffff",
                  backdropFilter: "blur(18px)",
                  cursor: "pointer",
                  transition: "all .3s ease",
                }}
              >
                Get Free Consultation
              </button>
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .heroTitle {
          font-size: 56px;
        }

        @media (max-width: 1024px) {
          .heroTitle {
            font-size: 58px;
          }
        }

        @media (max-width: 768px) {
          .heroTitle {
            font-size: 42px;
            line-height: 1.05;
          }
        }

        @media (max-width: 480px) {
          .heroTitle {
            font-size: 34px;
            line-height: 1.08;
          }
        }
      `}</style>
    </section>
  );
}
