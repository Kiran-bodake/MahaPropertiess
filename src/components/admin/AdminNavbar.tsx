"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  Search,
  Settings,
  UserCircle2,
} from "lucide-react";

const crumbs: Record<string, string[]> = {
  "/x-admin": ["Dashboard"],
  "/x-admin/leads": ["Dashboard", "Leads"],
  "/x-admin/deals": ["Dashboard", "Deals"],
  "/x-admin/tasks": ["Dashboard", "Tasks"],
  "/x-admin/properties": ["Dashboard", "Properties"],
};

export function AdminNavbar() {
  const path = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const breadcrumb = useMemo(
    () => crumbs[path] || ["Dashboard"],
    [path]
  );

  const unreadNotifications = notifications.filter((x) => !x.isRead);

  // ✅ FETCH NOTIFICATIONS
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notifications");
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ SEARCH
  const search = () => {
    if (!query.trim()) return;
    router.push(`/x-admin/search?q=${encodeURIComponent(query)}`);
  };

  // ✅ LOGOUT
  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/x-admin/login");
  };

  // ✅ OPEN NOTIFICATION
  const openNotification = async (item: any) => {
    await fetch("/api/admin/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referenceId: item.referenceId }),
    });

    setNotifications((prev) =>
      prev.map((x) =>
        x.referenceId === item.referenceId
          ? { ...x, isRead: true }
          : x
      )
    );

    setShowNotifications(false);

    if (item.type === "lead") {
      router.push(`/x-admin/leads?id=${item.referenceId}`);
    }

    if (item.type === "property") {
      router.push(`/x-admin/properties/${item.referenceId}`);
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 9999,
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "14px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* LEFT */}
        <div>
          <div style={{ fontWeight: 700, color: "#4f46e5" }}>
            Admin Panel
          </div>

          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {breadcrumb.join(" › ")}
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div style={{ flex: 1, maxWidth: 400, position: "relative" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search..."
            style={{
              width: "100%",
              padding: "10px 40px 10px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              outline: "none",
            }}
          />

          <Search
            onClick={search}
            size={16}
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              cursor: "pointer",
              color: "#6b7280",
            }}
          />
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* NOTIFICATIONS */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                padding: 8,
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                background: "white",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Bell size={18} />

              {unreadNotifications.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    background: "red",
                    color: "white",
                    fontSize: 10,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 45,
                  width: 300,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  zIndex: 9999,
                }}
              >
                {notifications.length === 0 ? (
                  <div style={{ padding: 12 }}>No notifications</div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.referenceId}
                      onClick={() => openNotification(item)}
                      style={{
                        padding: 10,
                        borderBottom: "1px solid #f3f4f6",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {item.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* SETTINGS */}
          <button
            style={{
              padding: 8,
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "white",
            }}
          >
            <Settings size={18} />
          </button>

          {/* PROFILE */}
          <button
            onClick={() => setOpen(!open)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              background: "#4f46e5",
              color: "white",
              borderRadius: 10,
              border: "none",
            }}
          >
            <UserCircle2 size={18} />
            Admin
          </button>

          {open && (
            <div
              style={{
                position: "absolute",
                top: 60,
                right: 20,
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 10,
                zIndex: 9999,
              }}
            >
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}