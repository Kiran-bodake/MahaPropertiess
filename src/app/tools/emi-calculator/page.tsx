"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import { calculateEMI } from "@/lib/emi";

export default function EMICalculatorPage() {
  const [loan, setLoan] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  // No auto calculation
  const [emi, setEmi] = useState<number | null>(null);

  const handleCalculate = () => {
    setEmi(calculateEMI(loan, rate, years));
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

          <button
            onClick={handleCalculate}
            style={{
              marginTop: 20,
              height: 48,
              padding: "0 24px",
              borderRadius: 12,
              background: "#166534",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Calculate EMI
          </button>

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
              {emi !== null
                ? `₹${emi.toLocaleString("en-IN")}`
                : "Click Calculate"}
            </div>
          </div>

          {/* Guide Section */}
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
              Home Loan EMI Guide
            </h2>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              An EMI (Equated Monthly Installment) is the fixed monthly amount
              paid by a borrower to repay a home loan. The EMI includes both
              principal and interest components and remains constant throughout
              the loan tenure.
            </p>

            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              What Factors Affect EMI?
            </h3>

            <ul
              style={{
                paddingLeft: 20,
                lineHeight: 2,
                color: "#475569",
              }}
            >
              <li>Loan Amount</li>
              <li>Interest Rate</li>
              <li>Loan Tenure</li>
              <li>Prepayments and Foreclosures</li>
            </ul>

            <h3
              style={{
                marginTop: 24,
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Benefits of Using an EMI Calculator
            </h3>

            <ul
              style={{
                paddingLeft: 20,
                lineHeight: 2,
                color: "#475569",
              }}
            >
              <li>Instant EMI estimation</li>
              <li>Compare loan offers easily</li>
              <li>Plan monthly finances better</li>
              <li>Know affordability before purchase</li>
            </ul>

            <h3
              style={{
                marginTop: 24,
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              EMI Formula
            </h3>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.8,
              }}
            >
              EMI = P × R × (1 + R)^N / ((1 + R)^N − 1)
            </p>
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
