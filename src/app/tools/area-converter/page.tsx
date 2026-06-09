"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import { sqftToSqm, sqftToGuntha, sqftToAcre } from "@/lib/area";

export default function AreaConverterPage() {
  // Only showing changed logic

  const [area, setArea] = useState(1000);

  const [results, setResults] = useState({
    sqm: "",
    guntha: "",
    acre: "",
  });

  const handleCalculate = () => {
    setResults({
      sqm: sqftToSqm(area),
      guntha: sqftToGuntha(area),
      acre: sqftToAcre(area),
    });
  };

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

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
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

            <button
              onClick={handleCalculate}
              style={{
                height: 52,
                padding: "0 24px",
                borderRadius: 12,
                background: "#166534",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Calculate Area
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 16,
              marginTop: 24,
            }}
          >
            <ResultCard label="Sq Meter" value={results.sqm || "--"} />
            <ResultCard label="Guntha" value={results.guntha || "--"} />
            <ResultCard label="Acre" value={results.acre || "--"} />
          </div>
          <div
            style={{
              marginTop: 40,
              paddingTop: 32,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              Area Conversion Guide
            </h2>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              Area measurement is one of the most important factors when buying
              agricultural land, NA plots, residential plots, commercial
              property, warehouses and industrial land in Maharashtra.
            </p>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
              Common Area Units
            </h3>

            <ul
              style={{
                paddingLeft: 20,
                lineHeight: 2,
                color: "#475569",
              }}
            >
              <li>1 Acre = 43,560 Sq Ft</li>
              <li>1 Guntha = 1,089 Sq Ft</li>
              <li>1 Sq Meter = 10.764 Sq Ft</li>
              <li>40 Guntha = 1 Acre</li>
            </ul>

            <h3
              style={{
                marginTop: 24,
                fontSize: "1.2rem",
                fontWeight: 700,
              }}
            >
              Why Use Area Converter?
            </h3>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.8,
              }}
            >
              Property listings may use different measurement units. An area
              converter helps compare land parcels accurately and makes property
              evaluation easier.
            </p>
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
