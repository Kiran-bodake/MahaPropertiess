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
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-collapse on smaller screens
  useEffect(() => {
    if (window.innerWidth < 1280) {
      setCollapsed(true);
    }
  }, []);

  if (pathname === "/x-admin/login") return null;

  const sidebarWidth = collapsed ? "80px" : "240px";

  const renderMenu = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingBottom: collapsed ? "16px" : "24px",
          marginBottom: collapsed ? "16px" : "24px",
          borderBottom: "1px solid #dcfce7",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transition: "all 0.3s ease",
            transform: collapsed ? "scale(0.7)" : "scale(1)",
          }}
        >
          <Image
            src="/maha.png"
            alt="Maha"
            width={collapsed ? 48 : 100}
            height={collapsed ? 48 : 100}
            style={{
              objectFit: "contain",
              borderRadius: collapsed ? "12px" : "24px",
              background: "#ffffff",
              padding: collapsed ? "8px" : "12px",
              border: "1px solid #dcfce7",
              boxShadow: "0 10px 25px rgba(34,197,94,.08)",
              transition: "all 0.3s ease",
            }}
          />
        </div>

        {/* Brand - Hidden when collapsed */}
        {!collapsed && (
          <>
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
          </>
        )}
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1 }}>
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/x-admin/dashboard" && pathname?.startsWith(href));
          const isHovered = hoveredItem === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={() => mobile && setOpen(false)}
              onMouseEnter={() => setHoveredItem(href)}
              onMouseLeave={() => setHoveredItem(null)}
              title={collapsed ? label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: collapsed ? "0" : "12px",
                height: "52px",
                padding: collapsed ? "0" : "0 14px",
                marginBottom: "10px",
                borderRadius: "16px",
                textDecoration: "none",
                transition: "all 0.25s ease",
                background: active
                  ? "linear-gradient(135deg,#dcfce7,#bbf7d0)"
                  : "transparent",
                border: active
                  ? "1px solid #86efac"
                  : "1px solid transparent",
                boxShadow: active
                  ? "0 10px 25px rgba(34,197,94,.10)"
                  : "none",
                color: active ? "#14532d" : "#166534",
                justifyContent: collapsed ? "center" : "flex-start",
                position: "relative" as const,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: collapsed ? "44px" : "36px",
                  height: collapsed ? "44px" : "36px",
                  borderRadius: collapsed ? "14px" : "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: active ? "#ffffff" : "#dcfce7",
                  color: active ? "#16a34a" : "#166534",
                  transition: "all 0.25s ease",
                  flexShrink: 0,
                }}
              >
                <Icon size={collapsed ? 20 : 17} />
              </div>

              {/* Label - Hidden when collapsed */}
              {!collapsed && (
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: active ? 700 : 600,
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {label}
                </span>
              )}

              {/* Active indicator when collapsed */}
              {collapsed && active && (
                <div
                  style={{
                    position: "absolute",
                    right: "-8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "20px",
                    background: "#16a34a",
                    borderRadius: "3px",
                  }}
                />
              )}

              {/* Tooltip on hover when collapsed */}
              {collapsed && isHovered && !active && (
                <div
                  style={{
                    position: "absolute",
                    left: "100%",
                    marginLeft: "12px",
                    padding: "8px 12px",
                    background: "#14532d",
                    color: "#ffffff",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    zIndex: 1000,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    pointerEvents: "none",
                  }}
                >
                  {label}
                  <div
                    style={{
                      position: "absolute",
                      left: "-4px",
                      top: "50%",
                      transform: "translateY(-50%) rotate(45deg)",
                      width: "8px",
                      height: "8px",
                      background: "#14532d",
                    }}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Card - Hidden when collapsed */}
      {!collapsed && (
        <div
          style={{
            marginTop: "28px",
            padding: "20px",
            borderRadius: "24px",
            background: "linear-gradient(135deg,#ecfdf5,#dcfce7)",
            border: "1px solid #bbf7d0",
            boxShadow: "0 12px 28px rgba(34,197,94,.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <Sparkles size={16} color="#16a34a" />
            <div
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#14532d",
              }}
            >
              AI Insights
            </div>
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              lineHeight: 1.7,
              color: "#166534",
            }}
          >
            Generate intelligent sales, property and lead reports automatically.
          </div>
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
              background: "linear-gradient(135deg,#16a34a,#22c55e)",
              boxShadow: "0 12px 24px rgba(34,197,94,.20)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 16px 32px rgba(34,197,94,.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(34,197,94,.20)";
            }}
          >
            Generate Report
          </button>
        </div>
      )}

      {/* Collapse Toggle Button */}
      {!mobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute",
            right: "-14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            border: "1px solid #dcfce7",
            background: "#ffffff",
            color: "#166534",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(34,197,94,.10)",
            zIndex: 10,
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0fdf4";
            e.currentTarget.style.borderColor = "#86efac";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.borderColor = "#dcfce7";
          }}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      )}
    </div>
  );

  // Mobile version
  if (mobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            top: "18px",
            left: "18px",
            zIndex: 999,
            width: "46px",
            height: "46px",
            border: "1px solid #bbf7d0",
            borderRadius: "14px",
            background: "#ffffff",
            color: "#166534",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(34,197,94,.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s ease",
          }}
        >
          <Menu size={20} />
        </button>

        {/* Overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.25)",
              backdropFilter: "blur(3px)",
              zIndex: 998,
            }}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          style={{
            position: "fixed",
            top: 0,
            left: open ? 0 : -320,
            width: "280px",
            height: "100vh",
            padding: "20px",
            zIndex: 999,
            transition: "transform 0.3s ease",
            background: "#f0fdf4",
            borderRight: "1px solid #dcfce7",
            overflowY: "auto",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#166534",
              padding: "4px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
            }}
          >
            <X size={20} />
          </button>

          {renderMenu()}
        </aside>
      </>
    );
  }

  // Desktop version
  return (
    <aside
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        background: "#f0fdf4",
        borderRight: "1px solid #dcfce7",
        position: "sticky",
        top: 0,
        transition: "all 0.3s ease",
        overflow: "hidden",
        zIndex: 100,
      }}
    >
      {renderMenu()}
    </aside>
  );
}