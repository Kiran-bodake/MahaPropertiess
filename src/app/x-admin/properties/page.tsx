"use client";

import { useEffect, useState } from "react";

type Property = {
  _id: string;
  title: string;
  status: string;
  premium?: boolean;
  price?: string;

  // location object
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };

  image?: string;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/properties");
        const data = await res.json();

        setProperties(data.properties ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "24px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Premium Properties
        </h1>

        <p
          style={{
            marginTop: "8px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Manage all listed premium properties
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "40px",
            textAlign: "center",
            border: "1px solid #e2e8f0",
          }}
        >
          Loading properties...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
            gap: "22px",
          }}
        >
          {properties.map((property) => (
            <div
              key={property._id}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                overflow: "hidden",
                border: property.premium
                  ? "2px solid #facc15"
                  : "1px solid #e2e8f0",
                boxShadow: property.premium
                  ? "0 18px 40px rgba(250,204,21,0.20)"
                  : "0 10px 25px rgba(15,23,42,0.06)",
                transition: "0.25s",
                position: "relative",
              }}
            >
              {/* Premium Badge */}
              {property.premium && (
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    background:
                      "linear-gradient(135deg,#facc15,#f59e0b)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "11px",
                    padding: "7px 14px",
                    borderRadius: "999px",
                    zIndex: 10,
                    letterSpacing: "0.5px",
                    boxShadow: "0 8px 20px rgba(245,158,11,0.3)",
                  }}
                >
                  ★ PREMIUM
                </div>
              )}

              {/* Image */}
              <div
                style={{
                  height: "220px",
                  overflow: "hidden",
                  background: "#e2e8f0",
                }}
              >
                <img
                  src={
                    property.image ||
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={property.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: "22px" }}>
                {/* Status */}
                <div
                  style={{
                    display: "inline-block",
                    background: "#dcfce7",
                    color: "#166534",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "6px 12px",
                    borderRadius: "999px",
                    marginBottom: "14px",
                    textTransform: "uppercase",
                  }}
                >
                  {property.status || "Active"}
                </div>

                {/* Title */}
                <h2
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    color: "#0f172a",
                    fontWeight: 800,
                    lineHeight: 1.3,
                  }}
                >
                  {property.title}
                </h2>

                {/* Price */}
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#16a34a",
                  }}
                >
                  {property.price || "₹ --"}
                </div>

                {/* LOCATION FIX */}
                <div
                  style={{
                    marginTop: "12px",
                    color: "#64748b",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  📍{" "}
                  {property.location?.city || "City"},{" "}
                  {property.location?.state || "State"},{" "}
                  {property.location?.country || "Country"}
                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "22px",
                  }}
                >
                  <button
                    style={{
                      flex: 1,
                      background: "#0f172a",
                      color: "#fff",
                      border: "none",
                      borderRadius: "14px",
                      padding: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    View Details
                  </button>

                  <button
                    style={{
                      flex: 1,
                      background: "#f8fafc",
                      color: "#0f172a",
                      border: "1px solid #cbd5e1",
                      borderRadius: "14px",
                      padding: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}