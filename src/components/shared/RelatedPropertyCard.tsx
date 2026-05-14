"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type RelatedProp = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  locality: string;
  city: string;
  price: number;
  isZeroBrokerage: boolean;
  images: { url: string }[];
};

export function RelatedPropertyCard({ rel }: { rel: RelatedProp }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/properties/${rel.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "white",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          cursor: "pointer",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          boxShadow: hovered ? "0 12px 30px rgba(0,0,0,0.10)" : "none",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            height: "170px",
            background: "#f1f5f9",
          }}
        >
          <Image
            src={rel.images[0]?.url ?? ""}
            alt={rel.title}
            fill
            style={{ objectFit: "cover" }}
          />
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#16a34a",
              color: "white",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: "999px",
              textTransform: "uppercase",
            }}
          >
            {rel.category}
          </span>
          {rel.isZeroBrokerage && (
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#f0fdf4",
                color: "#166534",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: "999px",
                border: "1px solid #bbf7d0",
              }}
            >
              Zero Brokerage
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "14px" }}>
          <h4
            style={{
              margin: "0 0 6px",
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.3,
            }}
          >
            {rel.title}
          </h4>
          <p
            style={{
              margin: "0 0 10px",
              fontSize: "0.83rem",
              color: "#64748b",
            }}
          >
            📍 {rel.locality}, {rel.city}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontWeight: 800, fontSize: "1rem", color: "#0f766e" }}
            >
              {rel.price.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#16a34a",
                background: "#f0fdf4",
                padding: "4px 10px",
                borderRadius: "6px",
              }}
            >
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
