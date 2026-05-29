"use client";

import Image from "next/image";
import Link from "next/link";

const localities = [
  {
    title: "Gangapur Road",
    image: "/nashik/localities/gangapur.jpg",
    price: "₹8,500/sq.ft",
    growth: "+18% YoY",
    tag: "Premium Growth Corridor",
  },

  {
    title: "Pathardi",
    image: "/nashik/localities/pathardi.jpg",
    price: "₹5,200/sq.ft",
    growth: "+22% YoY",
    tag: "Emerging Investment Zone",
  },

  {
    title: "Nashik Road",
    image: "/nashik/localities/nashik-road.jpg",
    price: "₹6,800/sq.ft",
    growth: "+16% YoY",
    tag: "Connectivity Hub",
  },
];

export default function HotLocalities() {
  return (
    <section
      style={{
        padding: "64px 20px 96px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "80px",
            maxWidth: "1000px",
          }}
        >
          <p
            style={{
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#16a34a",
            }}
          >
            Investment Opportunities
          </p>

          <h2
            style={{
              fontSize: "62px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#111827",
              margin: 0,
            }}
          >
            High-Growth Investment
            <br />
            Localities In Nashik
          </h2>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(340px,1fr))",
            gap: "40px",
          }}
        >
          {localities.map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: "36px",
                border: "1px solid #f3f4f6",
                background: "#ffffff",
                boxShadow:
                  "0 12px 50px rgba(16,24,40,0.08)",
                transition: "all .5s ease",
              }}
            >
              {/* IMAGE */}
              <div
                style={{
                  position: "relative",
                  height: "300px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{
                    objectFit: "cover",
                    transition: "transform .7s ease",
                  }}
                />
              </div>

              {/* CONTENT */}
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  padding: "28px",
                }}
              >
                {/* TAG */}
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    borderRadius: "999px",
                    background: "#dcfce7",
                    padding: "10px 18px",
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#15803d",
                  }}
                >
                  {item.tag}
                </div>

                {/* TITLE */}
                <h3
                  style={{
                    marginTop: "24px",
                    marginBottom: 0,
                    fontSize: "40px",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "#111827",
                    lineHeight: 1.1,
                  }}
                >
                  {item.title}
                </h3>

                {/* PRICE CARD */}
                <div
                  style={{
                    marginTop: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "24px",
                    border: "1px solid #dcfce7",
                    background:
                      "linear-gradient(to right,#f0fdf4,#ecfdf5)",
                    padding: "22px",
                  }}
                >
                  {/* PRICE */}
                  <div>
                    <p
                      style={{
                        marginBottom: "8px",
                        fontSize: "11px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#15803d",
                      }}
                    >
                      Price
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: 800,
                        color: "#111827",
                      }}
                    >
                      {item.price}
                    </p>
                  </div>

                  {/* GROWTH */}
                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p
                      style={{
                        marginBottom: "8px",
                        fontSize: "11px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#15803d",
                      }}
                    >
                      Growth
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: 800,
                        color: "#16a34a",
                      }}
                    >
                      {item.growth}
                    </p>
                  </div>
                </div>

                {/* BUTTON */}
                <Link
                  href="/properties"
                  style={{
                    marginTop: "28px",
                    display: "inline-flex",
                    height: "56px",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "18px",
                    background: "#16a34a",
                    padding: "0 28px",
                    fontWeight: 700,
                    color: "#ffffff",
                    textDecoration: "none",
                    boxShadow:
                      "0 15px 40px rgba(22,163,74,0.24)",
                    transition: "all .3s ease",
                  }}
                >
                  Explore Properties
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}