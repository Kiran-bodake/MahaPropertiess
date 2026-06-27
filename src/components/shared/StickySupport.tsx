"use client";

import { useState } from "react";
import { PhoneCall, X } from "lucide-react";

export default function StickySupport() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* SUPPORT PANEL */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 90,
            width: 390,
            maxWidth: "calc(100vw - 32px)",
            background: "#4A433F",
            borderRadius: 16,
            padding: 16,
            color: "#fff",
            zIndex: 9999,
            boxShadow: "0 18px 45px rgba(0,0,0,.28)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Contact Support
            </h3>

            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={22} />
            </button>
          </div>

          <a
            href="tel:02532629711"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              background: "#6a635f",
              borderRadius: 16,
              padding: "12px 16px",
              textDecoration: "none",
              color: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <PhoneCall size={24} />

              <div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  0253 262 9711
                </div>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 14,
                    opacity: 0.9,
                  }}
                >
                  Monday - Saturday • 9:00 AM - 7:00 PM
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              ›
            </span>
          </a>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 30,
          zIndex: 9999,

          display: "flex",
          alignItems: "center",
          gap: 10,

          background: "#4f4945",
          color: "#fff",

          padding: "14px 22px",
          borderRadius: "999px",

          fontWeight: 700,
          fontSize: "15px",

          border: "none",
          cursor: "pointer",

          boxShadow: "0 10px 25px rgba(0,0,0,.18)",
        }}
      >
        <PhoneCall size={20} />
      </button>
    </>
  );
}
