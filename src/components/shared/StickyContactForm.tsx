"use client";

import { useState } from "react";

interface StickyContactFormProps {
  title?: string;
  description?: string;
  propertyTitle: string;
}
export function StickyContactForm({ propertyTitle }: StickyContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const validate = () => {
    let valid = true;

    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    /* NAME */
    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    /* EMAIL */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter valid email address";
      valid = false;
    }

    /* PHONE */
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter valid 10 digit number";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
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
          inquiryType: "callback",
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Property Lead Saved");

        setStatus("Request submitted successfully");

        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);

      setStatus("Something went wrong");
    }
  };

  const getInputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    marginBottom: "6px",
    padding: "14px 16px",

    borderRadius: "16px",

    border: hasError ? "1px solid #ef4444" : "1px solid #dbeafe",

    fontSize: "0.95rem",

    fontFamily: "inherit",

    outline: "none",

    boxSizing: "border-box",

    background: "#ffffff",

    color: "#334155",

    boxShadow: "inset 0 1px 2px rgba(255,255,255,.8)",

    transition: "0.2s ease",
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* NAME */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        style={getInputStyle(!!errors.name)}
      />

      {errors.name && (
        <p
          style={{
            color: "#dc2626",
            fontSize: ".82rem",
            marginBottom: "12px",
            marginTop: 0,
          }}
        >
          {errors.name}
        </p>
      )}

      {/* EMAIL */}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        type="email"
        style={getInputStyle(!!errors.email)}
      />

      {errors.email && (
        <p
          style={{
            color: "#dc2626",
            fontSize: ".82rem",
            marginBottom: "12px",
            marginTop: 0,
          }}
        >
          {errors.email}
        </p>
      )}

      {/* PHONE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: errors.phone ? "1px solid #ef4444" : "1px solid #dbe2ea",
          borderRadius: "14px",
          background: "#ffffff",
          marginBottom: "6px",
          overflow: "hidden",
        }}
      >
        {/* COUNTRY CODE */}
        <div
          style={{
            padding: "14px 12px",
            background: "#ffffff",
            borderRight: "1px solid #dbe2ea",
            fontWeight: 700,
            color: "#0f172a",
            fontSize: ".95rem",
            whiteSpace: "nowrap",
          }}
        >
          +91
        </div>

        {/* INPUT */}
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          placeholder="Your Number"
          type="tel"
          maxLength={10}
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "none",
            outline: "none",
            fontSize: "0.95rem",
            background: "transparent",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* ERROR */}
      {errors.phone && (
        <p
          style={{
            color: "#dc2626",
            fontSize: ".82rem",
            marginBottom: "12px",
            marginTop: 0,
          }}
        >
          {errors.phone}
        </p>
      )}

      {/* MESSAGE */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message (optional)"
        style={{
          ...getInputStyle(false),
          minHeight: "100px",
          resize: "vertical",
          marginBottom: "14px",
        }}
      />

      {/* BUTTON */}
      <button
        type="submit"
        style={{
          width: "100%",
          height: 54,
          background: "linear-gradient(135deg,#166534,#16a34a)",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontWeight: 800,
          fontSize: "1rem",
          cursor: "pointer",
          transition: "0.25s ease",
          boxShadow: "0 10px 24px rgba(22,163,74,.22)",
        }}
      >
        Request a Call Back
      </button>

      {/* STATUS */}
      {status && (
        <p
          style={{
            marginTop: "14px",
            fontSize: ".9rem",
            color: status.includes("wrong") ? "#dc2626" : "#166534",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {status}
        </p>
      )}

      {/* TRUST TEXT */}
      <div
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: ".78rem",
          color: "#64748b",
          lineHeight: 1.5,
        }}
      >
        🔒 Your information is secure and confidential
      </div>
    </form>
  );
}
