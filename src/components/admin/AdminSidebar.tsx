"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  BarChart3,
  Home,
  Layers,
  ListChecks,
  Search,
  Users,
} from "lucide-react";

const items = [
  { href: "/x-admin/dashboard", label: "Analytics", icon: BarChart3 },
  { href: "/x-admin/leads", label: "Leads", icon: Users },
  { href: "/x-admin/deals", label: "Deals", icon: Layers },
  { href: "/x-admin/tasks", label: "Tasks", icon: ListChecks },
  { href: "/x-admin/properties", label: "Properties", icon: Home },
  { href: "/x-admin/search", label: "Global Search", icon: Search },
];

export function AdminSidebar() {
  const pathname = usePathname();

  if (pathname === "/x-admin/login") return null;

  return (
    <aside
      style={{
        width: 300,
        height: "100vh",
        padding: 24,
        boxSizing: "border-box",
        background:
          "linear-gradient(180deg,#0f172a,#1e293b)",
        borderRight:
          "1px solid #334155",
      }}
    >

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Image
          src="/maha.png"
          alt="Maha"
          width={42}
          height={42}
        />

        <div>

          <div
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            MahaProperties
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Command Center
          </div>

        </div>
      </div>

      {/* Menu */}
      <div
        style={{
          marginTop: 40,
        }}
      >

        <div
          style={{
            color: "#64748b",
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          WORKSPACE
        </div>

        {items.map(
          ({
            href,
            label,
            icon: Icon,
          }) => {
            const active =
              pathname === href ||
              (href !==
                "/x-admin/dashboard" &&
                pathname?.startsWith(
                  href
                ));

            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px",
                  marginBottom: 10,
                  borderRadius: 16,
                  textDecoration:
                    "none",
                  color: "#fff",
                  background:
                    active
                      ? "linear-gradient(135deg,#4f46e5,#7c3aed)"
                      : "transparent",
                  boxShadow:
                    active
                      ? "0 12px 24px rgba(79,70,229,0.35)"
                      : "none",
                }}
              >

                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    background:
                      "rgba(255,255,255,0.08)",
                  }}
                >
                  <Icon
                    size={18}
                  />
                </div>

                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </span>

              </Link>
            );
          }
        )}

      </div>

      {/* AI Card */}
      <div
        style={{
          marginTop: 40,
          padding: 18,
          borderRadius: 24,
          background:
            "rgba(255,255,255,0.05)",
        }}
      >

        <div
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          AI Insights
        </div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: 12,
            marginTop: 8,
            lineHeight: 1.6,
          }}
        >
          Auto-generate daily
          sales reports.
        </div>

        <button
          style={{
            width: "100%",
            marginTop: 16,
            padding: 12,
            borderRadius: 14,
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            background:
              "linear-gradient(135deg,#4f46e5,#7c3aed)",
          }}
        >
          Generate Report
        </button>

      </div>

    </aside>
  );
}