"use client";

import { useEffect, useState } from "react";

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact-inquiry")
      .then((res) => res.json())
      .then((data) => {
        setInquiries(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Contact Inquiries</h1>
          <p style={styles.subtitle}>
            Manage and track all incoming customer leads
          </p>
        </div>

        <div style={styles.badge}>
          Total: {inquiries.length}
        </div>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={styles.loading}>
                    Loading...
                  </td>
                </tr>
              ) : (
                inquiries.map((item, index) => {
                  const isUnread = !item.isRead;

                  return (
                    <tr
                      key={item._id}
                      style={{
                        ...styles.tr,
                        ...(isUnread ? styles.unreadRow : {}),
                        backgroundColor:
                          index % 2 === 0 ? "#fff" : "#fafafa",
                      }}
                    >

                      {/* NAME */}
                      <td style={{
                        ...styles.tdName,
                        ...(isUnread ? styles.unreadText : {})
                      }}>
                        {item.fullName}
                      </td>

                      {/* PHONE */}
                      <td style={styles.td}>{item.phone}</td>

                      {/* EMAIL */}
                      <td style={styles.tdEmail}>{item.email}</td>

                      {/* MESSAGE */}
                      <td style={styles.tdMessage}>
                        {item.message}
                      </td>

                      {/* STATUS */}
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: isUnread ? "#dbeafe" : "#dcfce7",
                            color: isUnread ? "#1d4ed8" : "#166534",
                          }}
                        >
                          {isUnread ? "New" : "Read"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td style={styles.td}>
                        <button
                          style={styles.callButton}
                          onClick={() =>
                            (window.location.href = `tel:${item.phone}`)
                          }
                        >
                          Call Now
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================
   INLINE STYLES
========================= */

const styles: any = {
  page: {
    padding: "24px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    margin: 0,
    color: "#111827",
  },

  subtitle: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
  },

  badge: {
    backgroundColor: "#111827",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  th: {
    textAlign: "left",
    padding: "14px 16px",
    fontSize: "12px",
    backgroundColor: "#f9fafb",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
  },

  tr: {
    transition: "0.2s",
  },

  td: {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#374151",
    borderBottom: "1px solid #f1f1f1",
  },

  tdName: {
    padding: "14px 16px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
    borderBottom: "1px solid #f1f1f1",
  },

  tdEmail: {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#2563eb",
    borderBottom: "1px solid #f1f1f1",
  },

  tdMessage: {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#6b7280",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    borderBottom: "1px solid #f1f1f1",
  },

  /* UNREAD */
  unreadRow: {
    borderLeft: "4px solid #2563eb",
    backgroundColor: "#eff6ff",
  },

  unreadText: {
    fontWeight: "700",
    color: "#111827",
  },

  /* STATUS BADGE */
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },

  /* CALL BUTTON */
  callButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  loading: {
    textAlign: "center",
    padding: "30px",
    color: "#6b7280",
  },
};