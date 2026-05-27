"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Menu,
  X,
  BarChart3,
  Home,
  Layers,
  Search,
  Users,
  Phone,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";

const items = [
  {
    href: "/x-admin/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },

  {
    href: "/x-admin/properties",
    label: "Properties",
    icon: Home,
  },

  {
    href: "/x-admin/property-inquiries",
    label: "Property Inquiries",
    icon: Phone,
  },

  {
  href: "/x-admin/property-reports",
  label: "Reported Property",
    icon: ShieldAlert,
  
},
  {
    href: "/x-admin/analytics",
    label: "Analytics",
    icon: Layers,
  },

  {
    href: "/x-admin/contact-inquiries",
    label: "Contact Settings",
    icon: Users,
  },

  {
    href: "/x-admin/search",
    label: "Global Search",
    icon: Search,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const [propertyOpen, setPropertyOpen] =
  useState(false);

  useEffect(() => {
    const check = () =>
      setMobile(window.innerWidth < 1024);

    check();

    window.addEventListener(
      "resize",
      check
    );

    return () =>
      window.removeEventListener(
        "resize",
        check
      );
  }, []);

  if (pathname === "/x-admin/login")
    return null;

  const renderMenu = () => (
    <>
      {/* Logo Area */}
      <div
        style={{
          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          textAlign: "center",

          paddingBottom: "24px",

          marginBottom: "24px",

          borderBottom:
            "1px solid #dcfce7",
        }}
      >

        {/* Logo */}
        <Image
          src="/maha.png"
          alt="Maha"
          width={100}
          height={100}

          style={{
            objectFit: "contain",

            borderRadius: "24px",

            background: "#ffffff",

            padding: "12px",

            border:
              "1px solid #dcfce7",

            boxShadow:
              "0 10px 25px rgba(34,197,94,.08)",
          }}
        />

        {/* Brand */}
        <div
          style={{
            marginTop: "16px",

            fontSize: "24px",

            fontWeight: 800,

            color: "#14532d",

            letterSpacing: "-0.03em",
          }}
        >
          MahaProperties
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: "6px",

            fontSize: "12px",

            color: "#6b7280",

            lineHeight: 1.6,
          }}
        >
          Premium Real Estate CRM
        </div>
      </div>

      {/* Menu */}
      <div>
        {items.map(
          ({
            href,
            label,
            icon: Icon,
          }) => {

            const active =
              pathname === href ||
              (
                href !==
                  "/x-admin/dashboard" &&
                pathname?.startsWith(
                  href
                )
              );

            return (
              <Link
                key={href}
                href={href}

                onClick={() =>
                  mobile &&
                  setOpen(false)
                }

                style={{
                  display: "flex",

                  alignItems: "center",

                  gap: "12px",

                  height: "52px",

                  padding:
                    "0 14px",

                  marginBottom:
                    "10px",

                  borderRadius:
                    "16px",

                  textDecoration:
                    "none",

                  transition:
                    "all .25s ease",

                  background:
                    active
                      ? "linear-gradient(135deg,#dcfce7,#bbf7d0)"
                      : "transparent",

                  border: active
                    ? "1px solid #86efac"
                    : "1px solid transparent",

                  boxShadow:
                    active
                      ? "0 10px 25px rgba(34,197,94,.10)"
                      : "none",

                  color: active
                    ? "#14532d"
                    : "#166534",
                }}
              >

                {/* Icon */}
                <div
                  style={{
                    width: "36px",

                    height: "36px",

                    borderRadius:
                      "12px",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    background:
                      active
                        ? "#ffffff"
                        : "#dcfce7",

                    color: active
                      ? "#16a34a"
                      : "#166534",
                  }}
                >
                  <Icon size={17} />
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: "14px",

                    fontWeight:
                      active
                        ? 700
                        : 600,

                    letterSpacing:
                      "-0.01em",
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
          marginTop: "28px",

          padding: "20px",

          borderRadius: "24px",

          background:
            "linear-gradient(135deg,#ecfdf5,#dcfce7)",

          border:
            "1px solid #bbf7d0",

          boxShadow:
            "0 12px 28px rgba(34,197,94,.08)",
        }}
      >

        {/* Title */}
        <div
          style={{
            fontSize: "15px",

            fontWeight: 800,

            color: "#14532d",
          }}
        >
          AI Insights
        </div>

        {/* Description */}
        <div
          style={{
            marginTop: "10px",

            fontSize: "12px",

            lineHeight: 1.7,

            color: "#166534",
          }}
        >
          Generate intelligent sales,
          property and lead reports
          automatically.
        </div>

        {/* Button */}
        <button
          style={{
            width: "100%",

            height: "46px",

            marginTop: "18px",

            border: "none",

            borderRadius: "16px",

            cursor: "pointer",

            fontSize: "13px",

            fontWeight: 700,

            color: "#ffffff",

            background:
              "linear-gradient(135deg,#16a34a,#22c55e)",

            boxShadow:
              "0 12px 24px rgba(34,197,94,.20)",
          }}
        >
          Generate Report
        </button>
      </div>
    </>
  );

  // Mobile
  if (mobile) {
    return (
      <>
        {/* Menu Button */}
        <button
          onClick={() => setOpen(true)}

          style={{
            position: "fixed",

            top: "18px",

            left: "18px",

            zIndex: 999,

            width: "46px",

            height: "46px",

            border:
              "1px solid #bbf7d0",

            borderRadius: "14px",

            background: "#ffffff",

            color: "#166534",

            cursor: "pointer",

            boxShadow:
              "0 10px 25px rgba(34,197,94,.10)",
          }}
        >
          <Menu size={20} />
        </button>

        {/* Overlay */}
        {open && (
          <div
            onClick={() =>
              setOpen(false)
            }

            style={{
              position: "fixed",

              inset: 0,

              background:
                "rgba(0,0,0,.25)",

              backdropFilter:
                "blur(3px)",

              zIndex: 998,
            }}
          />
        )}

        {/* Sidebar */}
        <aside
          style={{
            position: "fixed",

            top: 0,

            left: open
              ? 0
              : -320,

            width: "220px",

            height: "100vh",

            padding: "20px",

            zIndex: 999,

            transition:
              ".3s ease",

            background: "#f0fdf4",

            borderRight:
              "1px solid #dcfce7",
          }}
        >

          {/* Close */}
          <button
            onClick={() =>
              setOpen(false)
            }

            style={{
              position: "absolute",

              top: "18px",

              right: "18px",

              border: "none",

              background: "none",

              cursor: "pointer",

              color: "#166534",
            }}
          >
            <X size={20} />
          </button>

          {renderMenu()}
        </aside>
      </>
    );
  }

  // Desktop
  return (
    <aside
      style={{
        width: "220px",

        minWidth: "220px",

        height: "100vh",

        padding: "20px",

        boxSizing: "border-box",

        background: "#f0fdf4",

        borderRight:
          "1px solid #dcfce7",

        position: "sticky",

        top: 0,
      }}
    >
      {renderMenu()}
    </aside>
  );
}