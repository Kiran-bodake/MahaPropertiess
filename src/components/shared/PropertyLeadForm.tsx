"use client";
import { useState } from "react";

export function PropertyLeadForm({ propertyTitle }: { propertyTitle: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSubmitted(true);
  };

  const inp: React.CSSProperties = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #fcd34d",
    background: "#fffdf7",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    outline: "none",
    minWidth: 0,
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: "14px 18px",
          background: "#fff8dc",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>✅</div>
        <p style={{ margin: 0, fontWeight: 700, color: "#92400e" }}>
          We'll call you back shortly!
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#a16207" }}>
          Thank you for your interest in {propertyTitle}.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "24px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
        border: "1px solid #bbf7d0",
        borderRadius: "14px",
        padding: "18px 20px",
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#ca8a04",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "4px",
          }}
        >
          Quick Enquiry
        </div>
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: "1rem",
            color: "#78350f",
          }}
        >
          Interested in this property?
        </p>
        <p style={{ margin: "3px 0 0", fontSize: "0.85rem", color: "#92400e" }}>
          Leave your details — our expert will call you within 30 mins.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            style={inp}
          />
          <input
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);

              setPhone(value);
            }}
            placeholder="Phone number"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            required
            style={inp}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #ca8a04, #f59e0b)",
              border: "1px solid #fde68a",
              color: "white",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: loading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Sending…" : "Get a Callback"}
          </button>
        </div>
      </form>
    </div>
  );
}
