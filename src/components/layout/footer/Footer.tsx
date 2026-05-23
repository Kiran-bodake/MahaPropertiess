"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { FCOLS } from "@/lib/footerData";

export function Footer() {
  const lk: React.CSSProperties = {
    fontSize: "13px",
    color: "rgba(255,255,255,0.82)",
    textDecoration: "none",
    lineHeight: "1.5",
    transition: "0.2s ease",
  };

  return (
    <footer
      style={{
        background: "#070b0e",
        color: "white",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1180px",
          margin: "0 auto",
          boxSizing: "border-box",
          padding: "52px 24px 90px",
        }}
      >
        {/* TOP GRID */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: "32px",
            alignItems: "flex-start",
            marginBottom: "42px",
          }}
        >
          {/* COMPANY INFO */}
          <div
            style={{
              gridColumn: "span 2",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Image
                src="/maha.png"
                alt="Maha Properties Logo"
                width={150}
                height={60}
                style={{
                  objectFit: "contain",
                  height: "auto",
                }}
              />
            </div>

            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                marginBottom: "22px",
                maxWidth: "300px",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              Nashik&apos;s most comprehensive property portal — NA plots,
              agriculture, commercial & industrial since 2018.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* PHONE */}
              <a
                href="tel:02532629711"
                style={{
                  ...lk,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Phone size={15} color="#22c55e" />
                <span>0253 262 9711</span>
              </a>

              {/* EMAIL */}
              <a
                href="mailto:hello@mahaproperties.in"
                style={{
                  ...lk,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  wordBreak: "break-word",
                }}
              >
                <Mail size={15} color="#22c55e" />
                <span>hello@mahaproperties.in</span>
              </a>

              {/* LOCATION */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <MapPin
                  size={15}
                  color="#22c55e"
                  style={{
                    marginTop: "3px",
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.82)",
                    lineHeight: "1.6",
                  }}
                >
                  Nashik, Maharashtra 422001
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER COLUMNS */}
          {FCOLS.map((col) => (
            <div
              key={col.t}
              style={{
                minWidth: 0,
              }}
            >
              <h5
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,.45)",
                  letterSpacing: ".09em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                {col.t}
              </h5>

              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  padding: 0,
                  margin: 0,
                }}
              >
                {col.ll.map(([l, h]) => (
                  <li key={l}>
                    <Link
                      href={h}
                      style={lk}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.82)";
                      }}
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,.08)",
            marginBottom: "20px",
          }}
        />

        {/* BOTTOM SECTION */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            fontSize: "12px",
            color: "rgba(255,255,255,0.75)",
            paddingBottom: "10px",
          }}
        >
          <span
            style={{
              lineHeight: "1.6",
            }}
          >
            © 2026 MahaProperties. All rights reserved. Made with ❤️ in Nashik.
          </span>

          <a
            href="https://betterwork.tech"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(255,255,255,0.9)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "0.2s ease",
              marginLeft: "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
            }}
          >
            Developed By Betterwork
          </a>
        </div>
      </div>
    </footer>
  );
}
