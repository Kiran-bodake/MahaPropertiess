"use client";

import Link from "next/link";

export default function FinalInvestmentCTA() {
  return (
    <section
      style={{
        padding: "0px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          className="ctaWrapper"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "40px",
            boxShadow: "0 40px 120px rgba(0,0,0,0.22)",
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
              background: "rgba(0,0,0,0.55)",
            }}
          />

          {/* CONTENT */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "48px",
            }}
          >
            {/* LEFT CONTENT */}
            <div
              style={{
                maxWidth: "820px",
              }}
            >
              <h2 className="ctaTitle">
                Nashik's Next Growth Phase
                <br />
                Has Already Started
              </h2>

              <p
                style={{
                  marginTop: "32px",
                  maxWidth: "700px",
                  fontSize: "18px",
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Invest before infrastructure, tourism, and connectivity projects
                significantly increase land values.
              </p>
            </div>

            {/* BUTTONS */}
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {/* EXPLORE */}
              <Link
                href="/properties"
                style={{
                  display: "flex",
                  height: "64px",
                  minWidth: "240px",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "999px",
                  background: "#05a336",
                  padding: "0 40px",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#000000",
                  textDecoration: "none",
                  transition: "all .3s ease",
                  boxShadow: "0 15px 40px rgba(5,163,54,0.35)",
                }}
              >
                Explore Properties
              </Link>

              {/* CONSULTATION */}
              <Link
                href="/contact"
                style={{
                  display: "flex",
                  height: "64px",
                  minWidth: "240px",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.1)",
                  padding: "0 40px",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#ffffff",
                  textDecoration: "none",
                  backdropFilter: "blur(18px)",
                  transition: "all .3s ease",
                }}
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .ctaTitle {
          max-width: 820px;
          font-size: 64px;
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #ffffff;
          text-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
          margin: 0;
        }

        .ctaWrapper {
          padding: 100px 64px;
        }

        @media (max-width: 768px) {
          .ctaTitle {
            font-size: 38px;
            line-height: 1.1;
          }

          .ctaWrapper {
            padding: 48px 24px;
            border-radius: 28px;
          }
        }

        @media (max-width: 480px) {
          .ctaTitle {
            font-size: 32px;
            line-height: 1.1;
          }
        }
      `}</style>
    </section>
  );
}
