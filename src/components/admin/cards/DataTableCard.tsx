"use client";

import { ReactNode } from "react";

interface DataTableCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
}

export function DataTableCard({
  title,
  subtitle,
  children,
  action,
  footer,
}: DataTableCardProps) {

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",

        borderRadius: "28px",

        border: "1px solid #eef2f7",

        background: "#ffffff",

        boxShadow:
          "0 10px 35px rgba(15,23,42,0.06)",

        transition: "all .3s ease",
      }}
    >

      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          background:
            "linear-gradient(to bottom right,#ffffff,#f9fafb)",

          opacity: 0.8,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            gap: "20px",

            padding: "22px 24px",

            borderBottom: "1px solid #f1f5f9",

            flexWrap: "wrap",
          }}
        >

          {/* Left */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >

            {/* Title */}
            <h3
              style={{
                margin: 0,

                fontSize: "28px",
                fontWeight: 700,

                letterSpacing: "-0.03em",

                color: "#111827",
              }}
            >
              {title}
            </h3>

            {/* Subtitle */}
            {subtitle && (
              <p
                style={{
                  marginTop: "10px",

                  fontSize: "15px",
                  lineHeight: 1.7,

                  color: "#6b7280",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Action */}
          {action && (
            <div
              style={{
                flexShrink: 0,
              }}
            >
              {action}
            </div>
          )}
        </div>

        {/* Table Wrapper */}
        <div
          style={{
            overflowX: "auto",
          }}
        >

          {/* Table Content */}
          <div
            style={{
              width: "100%",
            }}
          >
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              padding: "18px 24px",

              borderTop: "1px solid #f1f5f9",

              background: "#f9fafb",
            }}
          >

            <div
              style={{
                fontSize: "14px",
                fontWeight: 500,

                color: "#4b5563",
              }}
            >
              {footer}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}