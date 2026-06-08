"use client";

import { useState } from "react";

export function PropertyLeadForm({ propertyTitle }: { propertyTitle: string }) {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/property-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyTitle,
          customerName: name,
          email,
          phone,
          message,
          inquiryType: "lead-form",
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Property Inquiry Saved");

        setSubmitted(true);

        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",

    height: 52,

    borderRadius: "14px",

    border: "1px solid #cbd5e1",

    background: "#ffffff",

    padding: "0 16px",

    fontSize: "0.95rem",

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
        <div
          style={{
            fontSize: "1.5rem",
            marginBottom: "6px",
          }}
        >
          ✅
        </div>

        <p
          style={{
            margin: 0,
            fontWeight: 700,
            color: "#92400e",
          }}
        >
          We'll call you back shortly!
        </p>

        <p
          style={{
            margin: "4px 0 0",
            fontSize: "0.85rem",
            color: "#a16207",
          }}
        >
          Thank you for your interest in {propertyTitle}.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "8px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
        border: "1px solid #bbf7d0",
        borderRadius: "14px",
        padding: "18px 20px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: "12px",
        }}
      >
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
            fontSize: "1.45rem",
            color: "#14532d",
          }}
        >
          Interested in this property?
        </p>

        <p
          style={{
            margin: "3px 0 0",
            fontSize: "0.85rem",
            color: "#92400e",
          }}
        >
          Leave your details — our expert will call you back shortly.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div
          className="quickLeadGrid"
          style={{
            display: "grid",

            gridTemplateColumns: "1fr 1fr 1fr",

            gap: 14,

            alignItems: "start",
          }}
        >
          {/* NAME */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            style={inp}
          />

          {/* EMAIL */}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            required
            style={inp}
          />

          {/* PHONE */}
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

          {/* MESSAGE */}
          <div
            style={{
              gridColumn: "1 / -1",
            }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message (optional)"
              rows={4}
              style={{
                width: "100%",

                borderRadius: "16px",

                border: "1px solid #cbd5e1",

                background: "#ffffff",

                padding: 16,

                fontSize: ".96rem",

                fontFamily: "inherit",

                outline: "none",

                resize: "vertical",

                minHeight: 120,
              }}
            />
          </div>

          {/* BUTTON */}
          <div
            style={{
              gridColumn: "1 / -1",

              display: "flex",

              justifyContent: "flex-end",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 52,

                padding: "0 28px",

                border: "none",

                borderRadius: "14px",

                background: "linear-gradient(to right,#15803d,#16a34a)",

                color: "#fff",

                fontWeight: 800,

                fontSize: ".96rem",

                cursor: loading ? "not-allowed" : "pointer",

                whiteSpace: "nowrap",

                fontFamily: "inherit",

                opacity: loading ? 0.8 : 1,

                boxShadow: "0 10px 20px rgba(22,163,74,.18)",
              }}
            >
              {loading ? "Sending..." : "Get a Callback"}
            </button>
          </div>
        </div>
      </form>
      <style jsx>{`
        @media (max-width: 768px) {
          .quickLeadGrid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
