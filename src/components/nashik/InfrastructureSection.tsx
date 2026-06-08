"use client";

import Image from "next/image";

const items = [
  {
    title: "Mumbai–Ahmedabad Bullet Train Connectivity",
    image: "/nashik/bullet-train.jpg",
    description:
      "Future high-speed connectivity can accelerate appreciation across emerging growth corridors.",
  },

  {
    title: "Industrial Corridors & MIDC Growth",
    image: "/nashik/industrial.jpg",
    description:
      "Industrial development continues driving workforce migration and residential demand.",
  },

  {
    title: "Smart City & Ring Road Development",
    image: "/nashik/ring-road.jpg",
    description:
      "Upcoming smart city initiatives, road widening, and ring road connectivity are transforming Nashik into a future-ready urban investment destination.",
  },

  {
    title: "Emerging IT & Data Center Ecosystem",
    image: "/nashik/data-center.jpg",
    description:
      "Growing IT infrastructure, technology parks, and data center investments are creating new employment opportunities and strengthening long-term real estate demand.",
  },
];

export default function InfrastructureSection() {
  return (
    <section
      style={{
        background: "#ffffff",
        padding: "64px 20px 96px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "120px",
        }}
      >
        {items.map((item, index) => (
          <div key={item.title} className="infraRow">
            {/* IMAGE */}
            <div
              style={{
                order: index % 2 === 1 ? 2 : 1,
              }}
            >
              <div
                className="infraImage"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "40px",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.14)",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: "cover",
                    transition: "transform .7s ease",
                  }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div
              className="infraContent"
              style={{
                order: index % 2 === 1 ? 1 : 2,
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                  color: "#16a34a",
                  marginBottom: "24px",
                }}
              >
                Infrastructure Growth
              </p>

              <h2
                className="infraTitle"
                style={{
                  margin: 0,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#111827",
                }}
              >
                {item.title}
              </h2>

              <p
                className="infraDescription"
                style={{
                  marginTop: "32px",
                  color: "#4b5563",
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .infraRow {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 64px;
        }

        .infraImage {
          height: 520px;
        }

        .infraContent {
          max-width: 720px;
        }

        .infraTitle {
          font-size: 50px;
        }

        .infraDescription {
          font-size: 17px;
          line-height: 1.9;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .infraRow {
            gap: 40px;
          }

          .infraImage {
            height: 420px;
          }

          .infraTitle {
            font-size: 48px;
          }

          .infraDescription {
            font-size: 18px;
            line-height: 1.8;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .infraRow {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .infraRow > div:first-child {
            order: 1 !important;
          }

          .infraRow > div:last-child {
            order: 2 !important;
          }

          .infraImage {
            height: 260px;
            border-radius: 24px;
          }

          .infraContent {
            max-width: 100%;
          }

          .infraTitle {
            font-size: 38px;
            line-height: 1.1;
          }

          .infraDescription {
            font-size: 16px;
            line-height: 1.7;
            margin-top: 20px !important;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          section {
            padding: 48px 16px 72px;
          }

          .infraImage {
            height: 220px;
          }

          .infraTitle {
            font-size: 34px;
          }

          .infraDescription {
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  );
}
