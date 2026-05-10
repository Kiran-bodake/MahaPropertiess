"use client";
import { useState } from "react";

interface StickyContactFormProps {
  title?: string;
  description?: string;
}

export function StickyContactForm({}: StickyContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 750));
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setStatus("Thank you! We will contact you shortly.");
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    marginBottom: "8px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        style={inputStyle}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        type="email"
        required
        style={inputStyle}
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        type="tel"
        required
        style={inputStyle}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message (optional)"
        style={{ ...inputStyle, marginBottom: "12px", minHeight: "80px", resize: "vertical" }}
      />
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(135deg, #14532d, #16a34a)",
          color: "white",
          borderRadius: "9px",
          border: "none",
          fontWeight: 700,
          fontSize: "0.95rem",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Request a Call Back
      </button>
      {status && (
        <p style={{ marginTop: "10px", fontSize: "0.88rem", color: "#065f46", textAlign: "center" }}>
          {status}
        </p>
      )}
    </form>
  );
}
