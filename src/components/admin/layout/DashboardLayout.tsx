"use client";

import { ReactNode } from "react";
import { Bell, Settings, Search } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        color: "#111827",
        WebkitFontSmoothing: "antialiased",
      }}
    >

      {/* Main */}
      <main
        style={{
          maxWidth: "1380px",

          margin: "0 auto",

          padding: "36px 32px 42px",
        }}
      >

        {/* Sections */}
        <div
          style={{
            display: "flex",

            flexDirection: "column",

            gap: "42px",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}