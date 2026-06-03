import { calculateEMI } from "@/lib/emi";

export default function PropertyEMIBadge({ price }: { price: number }) {
  const loanAmount = price * 0.8;

  const emi = calculateEMI(loanAmount, 8.5, 20);

  return (
    <div
      style={{
        marginTop: 16,
        padding: "14px 18px",
        borderRadius: 14,
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#15803d",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        EMI Estimate
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 18,
          fontWeight: 800,
          color: "#166534",
        }}
      >
        ₹{emi.toLocaleString()}/month
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#64748b",
          marginTop: 4,
        }}
      >
        Based on 20% down payment, 8.5% interest & 20 years tenure
      </div>
    </div>
  );
}
