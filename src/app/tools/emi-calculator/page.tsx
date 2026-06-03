"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import { calculateEMI } from "@/lib/emi";

export default function EMICalculatorPage() {
  const [loan, setLoan] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const emi = calculateEMI(loan, rate, years);

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
              marginBottom: 8,
            }}
          >
            🧮 EMI Calculator
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: 24,
            }}
          >
            Calculate your monthly home loan EMI instantly.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 16,
            }}
          >
            <InputCard
              label="Loan Amount (₹)"
              value={loan}
              onChange={setLoan}
            />

            <InputCard
              label="Interest Rate (%)"
              value={rate}
              onChange={setRate}
            />

            <InputCard
              label="Tenure (Years)"
              value={years}
              onChange={setYears}
            />
          </div>

          <div
            style={{
              marginTop: 24,
              background: "#dcfce7",
              borderRadius: 20,
              padding: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#166534",
                fontWeight: 700,
              }}
            >
              Monthly EMI
            </div>

            <div
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                marginTop: 8,
              }}
            >
              ₹{emi.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function InputCard({ label, value, onChange }: any) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          height: 52,
          borderRadius: 12,
          border: "1px solid #cbd5e1",
          padding: "0 16px",
        }}
      />
    </div>
  );
}
