"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";

export default function StampDutyPage() {
  const [propertyValue, setPropertyValue] = useState(5000000);

  const stampDuty = propertyValue * 0.05;
  const registration = 30000;

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
            📑 Stamp Duty Calculator
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: 24,
            }}
          >
            Maharashtra property registration cost estimator.
          </p>

          <input
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Number(e.target.value))}
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
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
              marginTop: 24,
            }}
          >
            <ResultCard
              label="Stamp Duty"
              value={`₹${stampDuty.toLocaleString("en-IN")}`}
            />

            <ResultCard
              label="Registration"
              value={`₹${registration.toLocaleString("en-IN")}`}
            />

            <ResultCard
              label="Total Cost"
              value={`₹${(stampDuty + registration).toLocaleString("en-IN")}`}
            />
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
        background: "#dcfce7",
        borderRadius: 18,
        padding: 20,
      }}
    >
      <div>{label}</div>

      <div
        style={{
          marginTop: 8,
          fontWeight: 900,
          fontSize: "1.4rem",
        }}
      >
        {value}
      </div>
    </div>
  );
}
