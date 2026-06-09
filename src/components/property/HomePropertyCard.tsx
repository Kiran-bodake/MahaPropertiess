import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const G = {
  g: "#1a6b3c",
  gm: "#2d9455",
  gl: "#f0faf4",
  gll: "#dcfce7",
  ink: "#0e1117",
  sl: "#374151",
  mu: "#6b7280",
  li: "#e5e7eb",
  bg: "#ffffff",
  off: "#f8f9fa",
  wa: "#25d366",
  go: "#c8973a",
};
const E = "cubic-bezier(0.4,0,0.2,1)";
const I = {
  menu: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  ),
  x: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  srch: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ph: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .27h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.1a16 16 0 006.29 6.29l1.19-1.19a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  usr: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  pin: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  arr: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  arL: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  arR: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 19 19 12 12 5" />
    </svg>
  ),
  chk: (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  cd: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  bll: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  rul: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 3l18 18M9 3v6M3 9h6M15 21v-6M21 15h-6" />
    </svg>
  ),
  eye: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  star: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="#f59e0b"
      stroke="none"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  hrt: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  wa: (
    <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  mail: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polyline points="3,7 12,13 21,7" />
    </svg>
  ),
};

export default function HomePropertyCard({
  p,
  vis,
  d,
}: {
  p: any;
  vis: boolean;
  d: number;
}) {
  const imgs = p.img ? [p.img] : [];
  const [ii, setIi] = useState(0);
  const [sv, setSv] = useState(false);

  return (
    <Link
      href={`/properties/${p.slug}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        height: "100%",
      }}
    >
      <div
        className="lf"
        style={{
          background: "white",
          borderRadius: "13px",
          overflow: "hidden",
          border: `1px solid ${G.li}`,
          boxShadow: "0 2px 8px rgba(0,0,0,.05)",
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(14px)",
          transition: `opacity .45s ${E} ${d}s,transform .45s ${E} ${d}s,box-shadow .26s ${E},transform .26s ${E}`,
          cursor: "pointer",
          height: "100%",
        }}
      >
        {/* Gallery */}
        <div
          style={{
            position: "relative",
            height: "170px",
            overflow: "hidden",
            background: G.off,
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {imgs.length > 0 && (
              <Image
                src={imgs[ii]}
                alt={`${p.title || p.t || "Property"} in ${p.city || "Nashik"}`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            )}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top,rgba(0,0,0,.32) 0%,transparent 50%)",
            }}
          />
          {/* Image prev/next */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIi((n) => (n - 1 + imgs.length) % imgs.length);
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "7px",
                  transform: "translateY(-50%)",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.8)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: G.ink,
                  zIndex: 2,
                  cursor: "pointer",
                }}
              >
                {I.arL}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIi((n) => (n + 1) % imgs.length);
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "7px",
                  transform: "translateY(-50%)",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.8)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: G.ink,
                  zIndex: 2,
                  cursor: "pointer",
                }}
              >
                {I.arR}
              </button>

              <div
                style={{
                  position: "absolute",
                  bottom: "7px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "4px",
                  zIndex: 2,
                }}
              >
                {imgs.map((_: any, j: number) => (
                  <button
                    key={j}
                    onClick={(e) => {
                      e.preventDefault();
                      setIi(j);
                    }}
                    style={{
                      width: ii === j ? "16px" : "5px",
                      height: "5px",
                      borderRadius: "99px",
                      border: "none",
                      background: ii === j ? "white" : "rgba(255,255,255,.5)",
                      transition: `all .22s ${E}`,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div
            style={{
              position: "absolute",
              top: "9px",
              left: "9px",
              display: "flex",
              gap: "5px",
              zIndex: 3,
            }}
          >
            {p.rera && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  background: "rgba(26,107,60,.88)",
                  color: "white",
                  fontSize: "9px",
                  fontWeight: 700,
                  padding: "3px 7px",
                  borderRadius: "5px",
                  backdropFilter: "blur(8px)",
                }}
              >
                {I.chk} RERA
              </span>
            )}

            {p.badge && (
              <span
                style={{
                  background: "rgba(200,151,58,.9)",
                  color: "white",
                  fontSize: "9px",
                  fontWeight: 700,
                  padding: "3px 7px",
                  borderRadius: "5px",
                  backdropFilter: "blur(8px)",
                }}
              >
                {p.badge}
              </span>
            )}
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setSv((s) => !s);
            }}
            style={{
              position: "absolute",
              top: "9px",
              right: "9px",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(255,255,255,.9)",
              backdropFilter: "blur(8px)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
              cursor: "pointer",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill={sv ? "#ef4444" : "none"}
              stroke={sv ? "#ef4444" : "#9ca3af"}
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          <span
            style={{
              position: "absolute",
              bottom: "17px",
              left: "9px",
              background: "rgba(0,0,0,.58)",
              color: "white",
              fontSize: "9.5px",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "5px",
              backdropFilter: "blur(8px)",
              zIndex: 2,
            }}
          >
            {p.cat || p.category}
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: "13px 14px" }}>
          <h3
            style={{
              fontWeight: 700,
              fontSize: "13.5px",
              color: G.ink,
              marginBottom: "5px",
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}
          >
            {p.t || p.title}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: G.mu,
              fontSize: "11.5px",
              marginBottom: "9px",
            }}
          >
            <span style={{ color: G.g }}>{I.pin}</span>
            {p.loc || p.location}
          </div>

          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 900,
              color: G.g,
              letterSpacing: "-0.025em",
              marginBottom: "9px",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {p.pr || p.price}
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              padding: "7px 0",
              borderTop: `1px solid ${G.li}`,
              borderBottom: `1px solid ${G.li}`,
              marginBottom: "11px",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                color: G.mu,
              }}
            >
              {I.rul} {p.area}
            </span>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                color: G.mu,
                marginLeft: "auto",
              }}
            >
              {I.eye} {p.views} views
            </span>
          </div>

          {/* Bottom Buttons */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginTop: "12px",
            }}
          >
            <div
              style={{
                height: "38px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#475569",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Details
            </div>

            <div
              style={{
                height: "38px",
                borderRadius: "8px",
                background: "#166534",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {I.ph}
              Contact
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
