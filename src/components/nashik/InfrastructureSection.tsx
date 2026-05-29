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
          <div
            key={item.title}
            style={{
              display: "grid",
              gridTemplateColumns:
                "1.05fr 0.95fr",
              alignItems: "center",
              gap: "64px",
            }}
          >
            {/* IMAGE */}
            <div
              style={{
                order: index % 2 === 1 ? 2 : 1,
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "520px",
                  overflow: "hidden",
                  borderRadius: "40px",
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,0.14)",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: "cover",
                    transition:
                      "transform .7s ease",
                  }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div
              style={{
                maxWidth: "720px",
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
                style={{
                  margin: 0,
                  fontSize: "62px",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "#111827",
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  marginTop: "32px",
                  fontSize: "22px",
                  lineHeight: 1.9,
                  color: "#4b5563",
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}