"use client";

import React, { useEffect, useState } from "react";

/* ================= TYPES ================= */

type InquiryStatus =
  | "new"
  | "contacted"
  | "interested"
  | "site-visit"
  | "negotiation"
  | "closed";

type Inquiry = {
  _id: string;
  customerName?: string;
  name?: string;
  phone?: string;
  mobileNumber?: string;
  email?: string;
  propertyTitle?: string;
  propertyName?: string;
  message?: string;
  status: InquiryStatus;
  isRead: boolean;
  createdAt: string;
  notes?: string;
  nextFollowUp?: string | null;
};

/* ================= UI HELPERS ================= */

const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  "site-visit": "Site Visit",
  negotiation: "Negotiation",
  closed: "Closed",
};

const statusColors: Record<InquiryStatus, { bg: string; text: string; dot: string }> = {
  new: { bg: "#eff6ff", text: "#1e40af", dot: "#3b82f6" },
  contacted: { bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  interested: { bg: "#ecfdf5", text: "#065f46", dot: "#10b981" },
  "site-visit": { bg: "#fdf2f8", text: "#831843", dot: "#ec4899" },
  negotiation: { bg: "#f5f3ff", text: "#5b21b6", dot: "#8b5cf6" },
  closed: { bg: "#f1f5f9", text: "#475569", dot: "#64748b" },
};

const getFollowUpStatus = (
  dateStr: string
): { label: string; color: string; bg: string } => {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (diff < 0) {
    if (hours > -1) return { label: "Just missed", color: "#b91c1c", bg: "#fee2e2" };
    if (hours > -24) return { label: `${Math.abs(hours)}h overdue`, color: "#b91c1c", bg: "#fee2e2" };
    return { label: `${Math.abs(Math.floor(diff / (1000 * 3600 * 24)))}d overdue`, color: "#b91c1c", bg: "#fee2e2" };
  }

  if (hours < 1) return { label: "Within 1 hour", color: "#b45309", bg: "#fef3c7" };
  if (hours < 24) return { label: `In ${hours}h`, color: "#b45309", bg: "#fef3c7" };
  const days = Math.floor(diff / (1000 * 3600 * 24));
  if (days === 0) return { label: "Today", color: "#b45309", bg: "#fef3c7" };
  if (days === 1) return { label: "Tomorrow", color: "#1e40af", bg: "#dbeafe" };
  return { label: `In ${days}d`, color: "#1e40af", bg: "#dbeafe" };
};

/* ================= COMPONENT ================= */

export default function PropertyInquiryModule() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [drawerNotes, setDrawerNotes] = useState("");
  const [drawerFollowUp, setDrawerFollowUp] = useState("");
  const [drawerStatus, setDrawerStatus] = useState<InquiryStatus>("new");

  // Follow‑up notifications
  const [overdue, setOverdue] = useState<Inquiry[]>([]);
  const [today, setToday] = useState<Inquiry[]>([]);
  const [upcoming, setUpcoming] = useState<Inquiry[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const perPage = 10;

  /* ===== FETCH ===== */
  const fetchData = async () => {
    const res = await fetch("/api/property-inquiry");
    const data = await res.json();
    setInquiries(data?.inquiries || []);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  /* ===== FOLLOW‑UP TRACKING ===== */
  useEffect(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowEnd = new Date(todayEnd.getTime() + 24 * 60 * 60 * 1000);

    const active = inquiries.filter((i) => i.nextFollowUp && i.status !== "closed");

    const overdueList: Inquiry[] = [];
    const todayList: Inquiry[] = [];
    const upcomingList: Inquiry[] = [];

    active.forEach((i) => {
      const d = new Date(i.nextFollowUp!);
      if (d < now) overdueList.push(i);
      else if (d >= todayStart && d < todayEnd) todayList.push(i);
      else if (d >= todayEnd && d < tomorrowEnd) upcomingList.push(i);
    });

    setOverdue(overdueList);
    setToday(todayList);
    setUpcoming(upcomingList);

    if (overdueList.length > 0 || todayList.length > 0) {
      setShowNotification(true);
    }
  }, [inquiries]);

  /* ===== DRAWER ===== */
  const openDrawer = (item: Inquiry) => {
    setSelected(item);
    setDrawerNotes(item.notes || "");
    setDrawerFollowUp(
      item.nextFollowUp
        ? new Date(item.nextFollowUp).toISOString().slice(0, 16)
        : ""
    );
    setDrawerStatus(item.status);
  };

  const saveDrawer = async () => {
    if (!selected) return;

    const payload = {
      status: drawerStatus,
      notes: drawerNotes,
      nextFollowUp: drawerFollowUp || null,
    };

    await fetch(`/api/property-inquiry/${selected._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setInquiries((prev) =>
      prev.map((i) =>
        i._id === selected._id ? { ...i, ...payload } : i
      )
    );

    setSelected((prev) => (prev ? { ...prev, ...payload } : prev));
  };

  const updateStatus = async (id: string, status: InquiryStatus) => {
    await fetch(`/api/property-inquiry/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setInquiries((prev) =>
      prev.map((i) => (i._id === id ? { ...i, status } : i))
    );

    if (selected?._id === id) {
      setSelected({ ...selected, status });
      setDrawerStatus(status);
    }
  };

  /* ===== FILTER & PAGINATION ===== */
  const filtered = inquiries.filter((i) => {
    const s = search.toLowerCase();
    const matchSearch =
      (i.customerName || i.name || "").toLowerCase().includes(s) ||
      (i.phone || i.mobileNumber || "").includes(s) ||
      (i.email || "").toLowerCase().includes(s) ||
      (i.propertyTitle || "").toLowerCase().includes(s);
    const matchStatus =
      statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ================= UI ================= */

  return (
    <div style={container}>
      {/* ========== FOLLOW‑UP NOTIFICATION BANNER ========== */}
      {showNotification && (overdue.length > 0 || today.length > 0) && (
        <div style={notificationBanner}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🔔</span>
            <div>
              <strong>Follow‑up Reminder</strong>
              <p style={{ margin: 4, fontSize: 13 }}>
                {overdue.length > 0 && (
                  <span style={{ color: "#b91c1c", fontWeight: 600 }}>
                    {overdue.length} overdue{" "}
                  </span>
                )}
                {today.length > 0 && (
                  <span style={{ color: "#b45309", fontWeight: 600 }}>
                    {today.length} due today
                  </span>
                )}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={bannerBtn} onClick={() => setShowModal(true)}>
              View
            </button>
            <button
              style={{ ...bannerBtn, background: "#e2e8f0", color: "#334155" }}
              onClick={() => setShowNotification(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ========== HEADER & STATS ========== */}
      <div style={header}>
        <div>
          <h1 style={title}>Property Inquiries</h1>
          <p style={subtitle}>Track and manage customer leads</p>
        </div>
        <div style={statsRow}>
          <div style={statCard}>
            <span style={statNumber}>{inquiries.length}</span>
            <span style={statLabel}>Total</span>
          </div>
          <div style={statCard}>
            <span style={statNumber}>
              {inquiries.filter((i) => i.status === "new").length}
            </span>
            <span style={statLabel}>New</span>
          </div>
          <div style={{ ...statCard, borderColor: "#fecaca" }}>
            <span style={statNumber}>
              {inquiries.filter((i) => i.nextFollowUp && i.status !== "closed").length}
            </span>
            <span style={statLabel}>With Follow‑up</span>
          </div>
        </div>
      </div>

      {/* ========== SEARCH & FILTERS ========== */}
      <div style={filtersBar}>
        <div style={searchBox}>
          <span style={{ marginRight: 6 }}>🔍</span>
          <input
            placeholder="Search customer, phone, email or property..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={filterSelect}
        >
          <option value="all">All Statuses</option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* ========== TABLE ========== */}
      <div style={tableCard}>
        <table style={table}>
          <thead>
            <tr style={tableHeadRow}>
              <th style={th}>Customer</th>
              <th style={th}>Phone</th>
              <th style={th}>Property</th>
              <th style={th}>Status</th>
              <th style={th}>Follow‑up</th>
              <th style={th}>Date</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => {
              const colors = statusColors[item.status];
              const followUp = item.nextFollowUp
                ? getFollowUpStatus(item.nextFollowUp)
                : null;

              return (
                <tr
                  key={item._id}
                  style={{
                    ...tableRow,
                    background: item.isRead ? "#fff" : "#f8fafc",
                  }}
                  onClick={() => openDrawer(item)}
                >
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={avatar}>
                        {(item.customerName || item.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {item.customerName || item.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          {item.email || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={td}>{item.phone || item.mobileNumber}</td>
                  <td style={td}>{item.propertyTitle || "—"}</td>
                  <td style={td}>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        const order: InquiryStatus[] = [
                          "new",
                          "contacted",
                          "interested",
                          "site-visit",
                          "negotiation",
                          "closed",
                        ];
                        const next =
                          order[(order.indexOf(item.status) + 1) % order.length];
                        updateStatus(item._id, next);
                      }}
                      style={{
                        ...statusBadge,
                        backgroundColor: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.dot}40`,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: colors.dot,
                          marginRight: 6,
                        }}
                      />
                      {statusLabels[item.status]}
                    </span>
                  </td>
                  <td style={td}>
                    {followUp ? (
                      <span
                        style={{
                          ...followUpBadge,
                          backgroundColor: followUp.bg,
                          color: followUp.color,
                        }}
                      >
                        {followUp.label}
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td style={{ ...td, fontSize: 13, color: "#475569" }}>
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td style={td}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawer(item);
                      }}
                      style={viewBtn}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            No inquiries found.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={pageBtn}
            >
              ‹ Prev
            </button>
            <span style={{ fontWeight: 500 }}>
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={pageBtn}
            >
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* ========== FOLLOW‑UP MODAL ========== */}
      {showModal && (
        <>
          <div style={overlay} onClick={() => setShowModal(false)} />
          <div style={modal}>
            <div style={modalHeader}>
              <h3 style={{ margin: 0 }}>Follow‑up Reminders</h3>
              <button
                onClick={() => setShowModal(false)}
                style={closeBtn}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "0 24px 24px", overflowY: "auto", maxHeight: "60vh" }}>
              {overdue.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: "#b91c1c", marginBottom: 8 }}>🔴 Overdue</h4>
                  {overdue.map((i) => (
                    <div
                      key={i._id}
                      style={followUpCard}
                      onClick={() => {
                        openDrawer(i);
                        setShowModal(false);
                      }}
                    >
                      <strong>{i.customerName || i.name}</strong>
                      <span style={{ fontSize: 13, color: "#475569" }}>
                        {i.propertyTitle}
                      </span>
                      <span style={{ fontSize: 12, color: "#b91c1c" }}>
                        {getFollowUpStatus(i.nextFollowUp!).label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {today.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: "#b45309", marginBottom: 8 }}>🟡 Due Today</h4>
                  {today.map((i) => (
                    <div
                      key={i._id}
                      style={followUpCard}
                      onClick={() => {
                        openDrawer(i);
                        setShowModal(false);
                      }}
                    >
                      <strong>{i.customerName || i.name}</strong>
                      <span style={{ fontSize: 13, color: "#475569" }}>
                        {i.propertyTitle}
                      </span>
                      <span style={{ fontSize: 12, color: "#b45309" }}>
                        {getFollowUpStatus(i.nextFollowUp!).label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {upcoming.length > 0 && (
                <div>
                  <h4 style={{ color: "#1e40af", marginBottom: 8 }}>🔵 Tomorrow</h4>
                  {upcoming.map((i) => (
                    <div
                      key={i._id}
                      style={followUpCard}
                      onClick={() => {
                        openDrawer(i);
                        setShowModal(false);
                      }}
                    >
                      <strong>{i.customerName || i.name}</strong>
                      <span style={{ fontSize: 13, color: "#475569" }}>
                        {i.propertyTitle}
                      </span>
                      <span style={{ fontSize: 12, color: "#1e40af" }}>
                        {getFollowUpStatus(i.nextFollowUp!).label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ========== DETAIL DRAWER ========== */}
      {selected && (
        <>
          <div style={overlay} onClick={() => setSelected(null)} />
          <div style={drawer}>
            <div style={drawerHeader}>
              <h3 style={{ margin: 0 }}>Inquiry Details</h3>
              <button onClick={() => setSelected(null)} style={closeBtn}>
                ✕
              </button>
            </div>

            <div style={{ padding: "0 24px 24px", overflowY: "auto", flex: 1 }}>
              {/* Customer info */}
              <div style={drawerSection}>
                <label style={drawerLabel}>Customer</label>
                <div style={drawerValue}>
                  {selected.customerName || selected.name}
                </div>
              </div>
              <div style={drawerSection}>
                <label style={drawerLabel}>Phone</label>
                <div style={drawerValue}>
                  {selected.phone || selected.mobileNumber || "—"}
                </div>
              </div>
              <div style={drawerSection}>
                <label style={drawerLabel}>Email</label>
                <div style={drawerValue}>{selected.email || "—"}</div>
              </div>
              <div style={drawerSection}>
                <label style={drawerLabel}>Property</label>
                <div style={drawerValue}>
                  {selected.propertyTitle || "—"}
                </div>
              </div>

              {/* Status */}
              <div style={drawerSection}>
                <label style={drawerLabel}>Status</label>
                <select
                  value={drawerStatus}
                  onChange={(e) =>
                    setDrawerStatus(e.target.value as InquiryStatus)
                  }
                  style={drawerSelect}
                >
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Follow‑up */}
              <div style={drawerSection}>
                <label style={drawerLabel}>Next Follow‑up</label>
                <input
                  type="datetime-local"
                  value={drawerFollowUp}
                  onChange={(e) => setDrawerFollowUp(e.target.value)}
                  style={drawerInput}
                />
              </div>

              {/* Notes */}
              <div style={drawerSection}>
                <label style={drawerLabel}>Internal Notes</label>
                <textarea
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Add notes..."
                  style={drawerTextarea}
                />
              </div>

              {/* Message */}
              {selected.message && (
                <div style={drawerSection}>
                  <label style={drawerLabel}>Customer Message</label>
                  <div style={messageBox}>{selected.message}</div>
                </div>
              )}
            </div>

            <div style={drawerFooter}>
              <button style={saveBtn} onClick={saveDrawer}>
                Save Changes
              </button>
              <a
                href={`tel:${selected.phone || selected.mobileNumber}`}
                style={callLink}
              >
                📞 Call
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const container: React.CSSProperties = {
  padding: "32px 24px",
  background: "#f8fafc",
  minHeight: "100vh",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 24,
  flexWrap: "wrap",
  gap: 16,
};

const title: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: "#0f172a",
  margin: 0,
};

const subtitle: React.CSSProperties = {
  color: "#64748b",
  margin: "4px 0 0",
};

const statsRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
};

const statCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: "12px 20px",
  textAlign: "center",
  minWidth: 80,
};

const statNumber: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  display: "block",
  color: "#0f172a",
};

const statLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  textTransform: "uppercase",
  fontWeight: 600,
  letterSpacing: 0.5,
};

/* Notification Banner */
const notificationBanner: React.CSSProperties = {
  background: "linear-gradient(135deg, #fff5f5, #fff7ed)",
  border: "1px solid #fecaca",
  borderRadius: 16,
  padding: "16px 20px",
  marginBottom: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 12,
};

const bannerBtn: React.CSSProperties = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
};

/* Filters */
const filtersBar: React.CSSProperties = {
  display: "flex",
  gap: 12,
  marginBottom: 20,
  flexWrap: "wrap",
};

const searchBox: React.CSSProperties = {
  flex: 1,
  minWidth: 250,
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
};

const searchInput: React.CSSProperties = {
  border: "none",
  outline: "none",
  width: "100%",
  padding: "12px 0",
  fontSize: 14,
};

const filterSelect: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  background: "#fff",
  fontWeight: 500,
};

/* Table */
const tableCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  overflow: "hidden",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeadRow: React.CSSProperties = {
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "14px 16px",
  fontSize: 12,
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
};

const tableRow: React.CSSProperties = {
  borderBottom: "1px solid #f1f5f9",
  cursor: "pointer",
  transition: "background 0.15s",
};

const td: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 14,
  verticalAlign: "middle",
};

const avatar: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "#3b82f6",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 14,
  flexShrink: 0,
};

const statusBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const followUpBadge: React.CSSProperties = {
  padding: "3px 10px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const viewBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "6px 12px",
  fontWeight: 600,
  fontSize: 12,
  cursor: "pointer",
  color: "#334155",
};

const pagination: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 16,
  padding: 20,
  borderTop: "1px solid #f1f5f9",
};

const pageBtn: React.CSSProperties = {
  padding: "6px 16px",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  color: "#334155",
};

/* Modal */
const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.5)",
  backdropFilter: "blur(4px)",
  zIndex: 1000,
};

const modal: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  borderRadius: 20,
  width: 520,
  maxWidth: "90vw",
  maxHeight: "80vh",
  zIndex: 1001,
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
};

const modalHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  borderBottom: "1px solid #e2e8f0",
};

const closeBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  color: "#64748b",
};

const followUpCard: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  marginBottom: 8,
  cursor: "pointer",
  background: "#fff",
};

/* Drawer */
const drawer: React.CSSProperties = {
  position: "fixed",
  right: 0,
  top: 0,
  width: 440,
  maxWidth: "100vw",
  height: "100%",
  background: "#fff",
  zIndex: 1001,
  display: "flex",
  flexDirection: "column",
  boxShadow: "-8px 0 24px rgba(0,0,0,0.1)",
  animation: "slideIn 0.2s ease",
};

const drawerHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  borderBottom: "1px solid #e2e8f0",
};

const drawerSection: React.CSSProperties = {
  marginBottom: 20,
};

const drawerLabel: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: 6,
};

const drawerValue: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "#0f172a",
};

const drawerSelect: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  fontSize: 14,
};

const drawerInput: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  fontSize: 14,
};

const drawerTextarea: React.CSSProperties = {
  width: "100%",
  minHeight: 100,
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  fontSize: 14,
  resize: "vertical",
};

const messageBox: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: 12,
  fontSize: 14,
  color: "#334155",
};

const drawerFooter: React.CSSProperties = {
  padding: "20px 24px",
  borderTop: "1px solid #e2e8f0",
  display: "flex",
  gap: 12,
};

const saveBtn: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const callLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 20px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: 10,
  fontWeight: 600,
  color: "#166534",
  textDecoration: "none",
};