"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Search, Settings, UserCircle2 } from "lucide-react";

const crumbs = {
  "/x-admin": ["Dashboard"],
  "/x-admin/leads": ["Dashboard", "Leads"],
  "/x-admin/deals": ["Dashboard", "Deals"],
  "/x-admin/tasks": ["Dashboard", "Tasks"],
  "/x-admin/properties": ["Dashboard", "Properties"],
};

const btn = {
  border: "1px solid #e2e8f0",
  background: "#fff",
  borderRadius: 14,
  cursor: "pointer",
};

const dropBtn = {
  width: "100%",
  padding: 12,
  border: "none",
  background: "transparent",
  textAlign: "left" as const,
  borderRadius: 12,
  cursor: "pointer",
};

export function AdminNavbar() {
  const path = usePathname(), router = useRouter();
  const [query, setQuery] = useState(""), [open, setOpen] = useState(false);

  const breadcrumb = useMemo(() => crumbs[path as keyof typeof crumbs] ?? ["Dashboard"], [path]);

  useEffect(() => {
    if (path === "/x-admin/login") return;
    (async () => {
      const res = await fetch("/api/admin/auth/me");
      if (res.status === 401) {
        const refresh = await fetch("/api/admin/auth/refresh", { method: "POST" });
        if (!refresh.ok) router.push("/x-admin/login");
      }
    })();
  }, [path, router]);

  if (path === "/x-admin/login") return null;

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/x-admin/login");
  };

  const search = () => {
    if (!query.trim()) return;
    router.push(`/x-admin/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "20px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#eef2ff", color: "#4338ca", padding: "10px 16px", borderRadius: 14, fontWeight: 700 }}>Analytics</div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            {breadcrumb.map((item, i) => <span key={item}>{i > 0 && " › "}{item}</span>)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          <div style={{ position: "relative", width: 320 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search..."
              style={{ width: "100%", height: 46, border: "1px solid #e2e8f0", borderRadius: 16, padding: "0 18px 0 42px", outline: "none" }}
            />
            <button onClick={search} style={{ position: "absolute", left: 14, top: 14, border: "none", background: "none" }}>
              <Search size={16} color="#64748b" />
            </button>
          </div>

          <button style={{ ...btn, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <Settings size={16} /> Preferences
          </button>

          <button style={{ ...btn, position: "relative", padding: 10 }}>
            <Bell size={18} />
            <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
          </button>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(!open)}
              style={{ display: "flex", alignItems: "center", gap: 8, border: "none", borderRadius: 14, padding: "10px 14px", color: "#fff", fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg,#4f46e5,#312e81)" }}
            >
              <UserCircle2 size={20} /> Admin
            </button>

            {open && (
              <div style={{ position: "absolute", top: 60, right: 0, width: 180, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
                <button style={dropBtn}>Profile</button>
                <button style={dropBtn}>Settings</button>
                <button onClick={logout} style={{ ...dropBtn, color: "#dc2626" }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}