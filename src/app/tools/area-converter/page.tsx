"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import { sqftToSqm, sqftToGuntha, sqftToAcre } from "@/lib/area";

export default function AreaConverterPage() {
  const [area, setArea] = useState(1000);

  return (
    <>
      <Navbar />

      <main
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 24,
            padding: 32,
            border: "1px solid #e2e8f0",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 900,
            }}
          >
            📐 Area Converter
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: 24,
            }}
          >
            Convert Sq Ft into Sq Meter, Guntha and Acre.
          </p>

          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Area in Sq Ft
          </label>

          <input
            type="number"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            style={{
              width: "100%",
              maxWidth: 300,
              height: 52,
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              padding: "0 16px",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 16,
              marginTop: 24,
            }}
          >
            <ResultCard label="Sq Meter" value={sqftToSqm(area)} />

            <ResultCard label="Guntha" value={sqftToGuntha(area)} />

            <ResultCard label="Acre" value={sqftToAcre(area)} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function ResultCard({ label, value }: any) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: "1.4rem",
          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  );
}
