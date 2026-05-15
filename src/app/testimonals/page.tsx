"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => setTestimonials(data || []))
      .catch(console.error);
  }, []);

  return (
    <main
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg,#052e16 0%, #166534 55%, #22c55e 100%)",

          color: "white",

          padding: "72px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "9px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,.16)",
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 18,
            }}
          >
            Client Reviews
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.2rem,5vw,4.2rem)",
              fontWeight: 900,
              lineHeight: 1.05,
            }}
          >
            What Our Clients Say
          </h1>

          <p
            style={{
              marginTop: 22,
              maxWidth: 720,
              lineHeight: 1.9,
              color: "rgba(255,255,255,.92)",
            }}
          >
            Trusted by buyers, investors and property seekers across Nashik for
            verified NA plots, commercial properties and investment
            opportunities.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section
        style={{
          padding: "48px 16px 80px",
        }}
      >
        <div
          className="reviewGrid"
          style={{
            maxWidth: 1200,
            margin: "0 auto",

            display: "grid",

            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",

            gap: 20,
          }}
        >
          {testimonials.map((t: any, i: number) => (
            <article
              key={i}
              style={{
                background: "white",
                borderRadius: 22,
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(0,0,0,.05)",
              }}
            >
              {/* IMAGE */}
              <div
                style={{
                  aspectRatio: "16/8",
                  position: "relative",
                }}
              >
                <Image
                  src={t.pImg || "/maha.png"}
                  alt={t.n}
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
                      "linear-gradient(to top,rgba(0,0,0,.55),transparent)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,

                    padding: "5px 12px",

                    borderRadius: 999,

                    background: "rgba(255,255,255,.14)",

                    color: "white",

                    fontSize: 11,

                    fontWeight: 700,

                    backdropFilter: "blur(10px)",
                  }}
                >
                  📍 {t.r} · {t.lc}
                </div>
              </div>

              {/* CONTENT */}
              <div
                style={{
                  padding: 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    marginBottom: 14,
                  }}
                >
                  {[0, 1, 2, 3, 4].map((j) => (
                    <span key={j}>⭐</span>
                  ))}
                </div>

                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.9,
                    color: "#334155",
                    fontStyle: "italic",
                    fontSize: ".95rem",
                  }}
                >
                  "{t.txt}"
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 22,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",

                      background: "linear-gradient(135deg,#16a34a,#22c55e)",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      color: "white",

                      fontWeight: 900,

                      fontSize: "1.1rem",

                      flexShrink: 0,
                    }}
                  >
                    {t.av}
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: "#0f172a",
                      }}
                    >
                      {t.n}
                    </div>

                    <div
                      style={{
                        fontSize: ".85rem",
                        color: "#64748b",
                        marginTop: 2,
                      }}
                    >
                      {t.r} · {t.lc}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: "center",
            marginTop: 48,
          }}
        >
          <Link
            href="/properties"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",

              height: 52,

              padding: "0 24px",

              borderRadius: 14,

              background: "#16a34a",

              color: "white",

              fontWeight: 800,

              textDecoration: "none",
            }}
          >
            Explore Properties →
          </Link>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){

          .reviewGrid{
            grid-template-columns:1fr !important;
          }

        }
      `}</style>
    </main>
  );
}
