"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Bell, Search, Settings, UserCircle2 } from "lucide-react";

const crumbs: Record<string, string[]> = {
  "/x-admin": ["Dashboard"],
  "/x-admin/leads": ["Dashboard", "Leads"],
  "/x-admin/deals": ["Dashboard", "Deals"],
  "/x-admin/tasks": ["Dashboard", "Tasks"],
  "/x-admin/properties": ["Dashboard", "Properties"],
  "/x-admin/notifications": ["Dashboard", "Notifications"],
  "/x-admin/followups": ["Dashboard", "Follow-ups"],
};

export function AdminNavbar() {
  const path = usePathname();
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);
  const hasConnected = useRef(false);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false); // ✅ NEW STATE
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const breadcrumb = useMemo(() => crumbs[path] || ["Dashboard"], [path]);

  const unreadNotifications = notifications.filter((x) => !x.isRead);

  // =========================
  // FETCH INITIAL NOTIFICATIONS
  // =========================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notifications?limit=10");
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  // =========================
  // MARK SINGLE NOTIFICATION AS READ
  // =========================
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, isRead: true }),
      });

      setNotifications((prev) =>
        prev.map((x) =>
          x._id === notificationId ? { ...x, isRead: true } : x,
        ),
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // =========================
  // MARK ALL NOTIFICATIONS AS READ
  // =========================
  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // =========================
  // HELPER: Generate slug from property name
  // =========================
  const generateSlug = (name: string): string => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // =========================
  // HELPER: Redirect to Property Page (Frontend)
  // =========================
  const redirectToPropertyPage = (item: any) => {
    const propertySlug = item.metadata?.propertySlug;
    const propertyName = item.metadata?.propertyName;
    const propertyId = item.metadata?.propertyId;
    const leadId = item.referenceId;

    if (propertySlug) {
      router.push(`/properties/${propertySlug}`);
    } else if (propertyName) {
      router.push(`/properties/${generateSlug(propertyName)}`);
    } else if (propertyId) {
      router.push(`/properties?id=${propertyId}`);
    } else {
      router.push(`/x-admin/leads?id=${leadId}`);
    }
  };

  // =========================
  // HELPER: Redirect to Follow-up Page (Admin)
  // =========================
  const redirectToFollowUpPage = (item: any) => {
    const followupId = item.metadata?.followupId || item.referenceId;
    const leadId = item.referenceId;

    if (followupId) {
      router.push(`/x-admin/followups?id=${followupId}`);
    } else if (leadId) {
      router.push(`/x-admin/leads?id=${leadId}`);
    } else {
      router.push(`/x-admin/followups`);
    }
  };

  // =========================
  // HELPER: Redirect to Property Admin Page
  // =========================
  const redirectToPropertyAdminPage = (item: any) => {
    const propertyId = item.metadata?.propertyId || item.referenceId;

    if (propertyId) {
      router.push(`/x-admin/properties/${propertyId}`);
    } else {
      router.push(`/x-admin/properties`);
    }
  };

  // ✅ NEW: Navigate to Email Settings
  const goToEmailSettings = () => {
    setShowSettingsDropdown(false);
    router.push("/email-settings");
  };

  // ✅ NEW: Navigate to Security Settings
  const goToSecuritySettings = () => {
    setShowSettingsDropdown(false);
    router.push("/x-admin/security");
  };

  // =========================
  // SOCKET CONNECTION (Optional)
  // =========================
  useEffect(() => {
    if (hasConnected.current) return;
    hasConnected.current = true;

    try {
      socketRef.current = io("http://localhost:4000", {
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current?.id);
        socketRef.current?.emit("join", "admin");
      });

      socketRef.current.on("new-notification", (data: any) => {
        setNotifications((prev) => [data, ...prev]);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    } catch (error) {
      console.error("Socket connection error:", error);
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      hasConnected.current = false;
    };
  }, []);

  // =========================
  // SEARCH
  // =========================
  const search = () => {
    if (!query.trim()) return;
    router.push(`/x-admin/search?q=${encodeURIComponent(query)}`);
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/x-admin/login");
  };

  // =========================
  // OPEN NOTIFICATION - MAIN REDIRECT LOGIC
  // =========================
  const openNotification = async (item: any) => {
    console.log("Notification clicked", item);
    // Mark as read
    if (!item.isRead) {
      await markAsRead(item._id);
    }

    setShowNotifications(false);

    console.log("🔔 Opening notification:", {
      type: item.type,
      id: item._id,
      title: item.title,
    });

    // ========================================
    // REDIRECT RULES
    // ========================================

    // 1. LEAD → Property Page (Frontend)
    if (item.type === "lead") {
      router.push("/x-admin/property-inquiries");
      return;
    }

    // 2. INQUIRY → Property Page (Frontend)
    if (item.type === "inquiry") {
      redirectToPropertyPage(item);
      return;
    }

    // 3. CALLBACK → Property Page (Frontend)
    if (item.type === "callback") {
      redirectToPropertyPage(item);
      return;
    }

    // 4. FOLLOW-UP → Follow-ups Page (Admin)
    if (item.type === "followup") {
      redirectToFollowUpPage(item);
      return;
    }

    // 5. PROPERTY → Property Admin Page
    if (item.type === "property") {
      redirectToPropertyAdminPage(item);
      return;
    }

    // 6. SYSTEM → Notifications Page
    if (item.type === "system") {
      router.push(`/x-admin/notifications`);
      return;
    }

    // 7. DEFAULT FALLBACK
    router.push(`/x-admin/notifications`);
  };

  // =========================
  // HELPER: GET TIME AGO
  // =========================
  const getTimeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000,
    );
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  // =========================
  // HELPER: GET NOTIFICATION ICON
  // =========================
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "lead":
        return "📋";
      case "inquiry":
        return "❓";
      case "callback":
        return "📞";
      case "property":
        return "🏠";
      case "followup":
        return "⏰";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  // =========================
  // HELPER: GET PRIORITY STYLE
  // =========================
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return { background: "#fee2e2", color: "#dc2626", label: "High" };
      case "medium":
        return { background: "#fef3c7", color: "#d97706", label: "Medium" };
      default:
        return { background: "#dbeafe", color: "#2563eb", label: "Low" };
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
        {/* LEFT - Logo & Breadcrumb */}
        <div>
          <div style={{ fontWeight: 700, color: "#4f46e5", fontSize: 16 }}>
            🏠 MahaProperties Admin
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            {breadcrumb.join(" › ")}
          </div>
        </div>

        {/* CENTER - Search */}
        <div style={{ flex: 1, maxWidth: 400, position: "relative" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search leads, properties..."
            style={{
              width: "100%",
              padding: "10px 40px 10px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              outline: "none",
              fontSize: 14,
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

        {/* RIGHT - Actions */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* NOTIFICATION BELL */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                padding: 8,
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                background: "white",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
              }}
            >
              <Bell size={18} />

              {unreadNotifications.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    background: "#ef4444",
                    color: "white",
                    fontSize: 10,
                    fontWeight: "bold",
                    minWidth: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}
                >
                  {unreadNotifications.length > 99
                    ? "99+"
                    : unreadNotifications.length}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 45,
                  width: 380,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  overflow: "hidden",
                }}
              >
                {/* Dropdown Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#f9fafb",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 14, color: "#1f2937" }}>
                      Notifications
                    </strong>
                    <div
                      style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}
                    >
                      {unreadNotifications.length} unread
                    </div>
                  </div>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      style={{
                        fontSize: 11,
                        color: "#4f46e5",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div style={{ maxHeight: 400, overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>🔔</div>
                      <div style={{ fontSize: 14, color: "#6b7280" }}>
                        No notifications yet
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}
                      >
                        New notifications will appear here
                      </div>
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const priorityStyle = getPriorityStyle(item.priority);
                      return (
                        <div
                          key={item._id}
                          onClick={() => openNotification(item)}
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #f3f4f6",
                            cursor: "pointer",
                            background: item.isRead ? "#fff" : "#eff6ff",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#f3f4f6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = item.isRead
                              ? "#fff"
                              : "#eff6ff";
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "flex-start",
                            }}
                          >
                            <div style={{ fontSize: 20 }}>
                              {getNotificationIcon(item.type)}
                            </div>

                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  marginBottom: 4,
                                  flexWrap: "wrap",
                                }}
                              >
                                <strong
                                  style={{ fontSize: 13, color: "#1f2937" }}
                                >
                                  {item.title}
                                </strong>
                                <span
                                  style={{
                                    fontSize: 10,
                                    padding: "2px 8px",
                                    borderRadius: 20,
                                    background: priorityStyle.background,
                                    color: priorityStyle.color,
                                    fontWeight: 500,
                                  }}
                                >
                                  {priorityStyle.label}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#6b7280",
                                  marginBottom: 6,
                                  lineHeight: 1.4,
                                }}
                              >
                                {item.message}
                              </div>
                              <div style={{ fontSize: 10, color: "#9ca3af" }}>
                                {getTimeAgo(item.createdAt)}
                              </div>
                              {item.metadata?.propertyName && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#4f46e5",
                                    marginTop: 4,
                                  }}
                                >
                                  🏠 {item.metadata.propertyName}
                                </div>
                              )}
                            </div>

                            {!item.isRead && (
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  background: "#3b82f6",
                                  borderRadius: "50%",
                                  marginTop: 6,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Dropdown Footer */}
                <div
                  style={{
                    padding: "10px 16px",
                    borderTop: "1px solid #e5e7eb",
                    background: "#f9fafb",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      router.push("/x-admin/notifications");
                    }}
                    style={{
                      fontSize: 12,
                      color: "#4f46e5",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ✅ UPDATED: SETTINGS BUTTON WITH DROPDOWN */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              style={{
                padding: 8,
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                background: "white",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
              }}
            >
              <Settings size={18} />
            </button>

            {/* Settings Dropdown Menu */}
            {showSettingsDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSettingsDropdown(false)}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 45,
                    right: 0,
                    width: 220,
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                    overflow: "hidden",
                  }}
                >
                  {/* Email Settings Option */}
                  <button
                    onClick={goToEmailSettings}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      padding: "12px 16px",
                      border: "none",
                      background: "white",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 13,
                      transition: "background 0.2s",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    <span style={{ fontSize: 18 }}>📧</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>Email Settings</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>
                        Configure category emails
                      </div>
                    </div>
                  </button>

                  {/* Security Settings Option */}
                  <button
                    onClick={goToSecuritySettings}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      padding: "12px 16px",
                      border: "none",
                      background: "white",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 13,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    <span style={{ fontSize: 18 }}>🔐</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>Security</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>
                        Password & security
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* PROFILE BUTTON */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(!open)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px 6px 8px",
                background: "#4f46e5",
                color: "white",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4338ca";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#4f46e5";
              }}
            >
              <UserCircle2 size={18} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>Admin</span>
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div
                style={{
                  position: "absolute",
                  top: 45,
                  right: 0,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                  minWidth: 150,
                }}
              >
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/x-admin/profile");
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    fontSize: 13,
                    borderRadius: 8,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  👤 Profile
                </button>
                <button
                  onClick={logout}
                  style={{
                    padding: "8px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    fontSize: 13,
                    borderRadius: 8,
                    color: "#dc2626",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fee2e2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
