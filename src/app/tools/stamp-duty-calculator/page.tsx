"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";

export default function StampDutyPage() {
  const [propertyValue, setPropertyValue] = useState(5000000);

  const [result, setResult] = useState<{
    stampDuty: number;
    registration: number;
    total: number;
  } | null>(null);

  const handleCalculate = () => {
    const stampDuty = propertyValue * 0.05;
    const registration = 30000;

    setResult({
      stampDuty,
      registration,
      total: stampDuty + registration,
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

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
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
                whiteSpace: "nowrap",
              }}
            >
              Calculate Stamp Duty
            </button>
          </div>

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
              value={
                result ? `₹${result.stampDuty.toLocaleString("en-IN")}` : "--"
              }
            />

            <ResultCard
              label="Registration"
              value={
                result
                  ? `₹${result.registration.toLocaleString("en-IN")}`
                  : "--"
              }
            />

            <ResultCard
              label="Total Cost"
              value={result ? `₹${result.total.toLocaleString("en-IN")}` : "--"}
            />
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
              Maharashtra Stamp Duty Guide
            </h2>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              Stamp duty is a mandatory tax paid to the Maharashtra Government
              during property registration. Registration charges are collected
              separately and are compulsory for legal ownership transfer.
            </p>

            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Components of Registration Cost
            </h3>

            <ul
              style={{
                paddingLeft: 20,
                lineHeight: 2,
                color: "#475569",
              }}
            >
              <li>Stamp Duty Charges</li>
              <li>Registration Charges</li>
              <li>Government Fees</li>
              <li>Legal Documentation Costs</li>
            </ul>

            <h3
              style={{
                marginTop: 24,
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Why Use Stamp Duty Calculator?
            </h3>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.8,
              }}
            >
              A stamp duty calculator helps buyers estimate registration
              expenses before purchasing residential, commercial, agricultural
              or industrial properties in Maharashtra.
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
