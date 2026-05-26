"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  children,
  action,
}: ChartCardProps) {

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",

        borderRadius: "30px",

        border: "1px solid #f1f5f9",

        background:
          "linear-gradient(to bottom,#ffffff,#f8fafc)",

        padding: "24px",

        boxShadow:
          "0 10px 35px rgba(15,23,42,0.06)",

        transition: "all .3s ease",
      }}
    >

      {/* Soft Glow */}
      <div
        style={{
          position: "absolute",

          top: "-40px",
          right: "-40px",

          width: "140px",
          height: "140px",

          borderRadius: "999px",

          background: "#dbeafe",

          opacity: 0.5,

          filter: "blur(60px)",
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
            alignItems: "flex-start",
            justifyContent: "space-between",

            gap: "24px",

            marginBottom: "24px",
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

                fontSize: "26px",
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

        {/* Chart Content */}
        <div
          style={{
            paddingTop: "16px",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}