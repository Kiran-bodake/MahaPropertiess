"use client";

import { ReactNode } from "react";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  color?: "blue" | "green" | "purple" | "orange";
}

const iconStyles = {
  blue: {
    background: "#eff6ff",
    color: "#2563eb",
  },

  green: {
    background: "#ecfdf5",
    color: "#16a34a",
  },

  purple: {
    background: "#f5f3ff",
    color: "#7c3aed",
  },

  orange: {
    background: "#fff7ed",
    color: "#ea580c",
  },
};

const trendStyles = {
  positive: {
    background: "#ecfdf5",
    color: "#15803d",
    border: "1px solid #bbf7d0",
  },

  negative: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "blue",
}: StatCardProps) {

  const isPositive = (trend || 0) >= 0;

  return (
    <div
      style={{
        position: "relative",

        overflow: "hidden",

        background: "#ffffff",

        border: "1px solid #edf2f7",

        borderRadius: "22px",

        padding: "18px 20px",

        minHeight: "118px",

        boxShadow:
          "0 4px 14px rgba(15,23,42,0.04)",

        transition: "all .25s ease",
      }}
    >

      {/* Top Border Glow */}
      <div
        style={{
          position: "absolute",

          top: 0,
          left: 0,
          right: 0,

          height: "3px",

          background:
            "linear-gradient(90deg, transparent, #e2e8f0, transparent)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",

          alignItems: "flex-start",

          justifyContent: "space-between",

          position: "relative",

          zIndex: 1,
        }}
      >

        {/* Left */}
        <div
          style={{
            paddingRight: "12px",
          }}
        >

          {/* Label */}
          <p
            style={{
              margin: 0,

              fontSize: "10px",

              fontWeight: 700,

              letterSpacing: "0.14em",

              textTransform: "uppercase",

              color: "#9ca3af",
            }}
          >
            {label}
          </p>

          {/* Value */}
          <h3
            style={{
              marginTop: "14px",

              marginBottom: 0,

              fontSize: "34px",

              lineHeight: 1,

              fontWeight: 700,

              letterSpacing: "-0.04em",

              color: "#0f172a",
            }}
          >
            {value}
          </h3>
        </div>

        {/* Icon */}
        {icon && (
          <div
            style={{
              width: "46px",

              height: "46px",

              borderRadius: "14px",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              flexShrink: 0,

              ...iconStyles[color],
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div
          style={{
            marginTop: "18px",
          }}
        >

          <div
            style={{
              display: "inline-flex",

              alignItems: "center",

              gap: "6px",

              padding: "8px 12px",

              borderRadius: "12px",

              fontSize: "12px",

              fontWeight: 600,

              ...(isPositive
                ? trendStyles.positive
                : trendStyles.negative),
            }}
          >

            {isPositive ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}

            <span>
              {Math.abs(trend)}%
            </span>

            <span
              style={{
                opacity: 0.7,

                fontSize: "11px",
              }}
            >
              vs last month
            </span>
          </div>
        </div>
      )}
    </div>
  );
}