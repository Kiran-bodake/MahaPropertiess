"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Deal = {
  _id: string;
  dealNumber: string;
  propertyTitle: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: string;
  finalPrice?: number;
  owner?: string;
  notes?: string;
  tokenAmount?: number;
  totalReceived?: number;
  balanceAmount?: number;
  createdAt: string;
  updatedAt: string;
};

type Toast = {
  message: string;
  type: "success" | "error" | "info";
  id: number;
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    loadDeals();
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  async function loadDeals() {
    try {
      const res = await fetch("/api/admin/deals");
      const data = await res.json();

      if (data.success) {
        setDeals(data.deals);
        showToast("Deals loaded successfully", "success");
      } else {
        showToast(data.message || "Failed to load deals", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load deals. Please refresh the page.", "error");
    } finally {
      setLoading(false);
    }
  }

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) =>
      [
        deal.customerName,
        deal.propertyTitle,
        deal.dealNumber,
        deal.customerPhone,
        deal.customerEmail,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [deals, search]);

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "#3b82f6",
      site_visit: "#8b5cf6",
      negotiation: "#f59e0b",
      token_paid: "#10b981",
      agreement: "#06b6d4",
      registration: "#6366f1",
      closed: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#64748b";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: "New",
      site_visit: "Site Visit",
      negotiation: "Negotiation",
      token_paid: "Token Paid",
      agreement: "Agreement",
      registration: "Registration",
      closed: "Closed",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  const totalDeals = filteredDeals.length;
  const totalValue = filteredDeals.reduce((sum, deal) => sum + (deal.finalPrice || 0), 0);
  const activeDeals = filteredDeals.filter(deal => !["closed", "cancelled"].includes(deal.status)).length;

  if (loading) {
    return (
      <div style={{ padding: 30, background: "#f8fafc", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "#64748b" }}>Loading deals...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 30, background: "#f8fafc", minHeight: "100vh" }}>
      {/* Toast Notifications */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: toast.type === "success" ? "#10b981" : toast.type === "error" ? "#ef4444" : "#3b82f6",
              color: "white",
              padding: "12px 20px",
              borderRadius: 8,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              animation: "slideIn 0.3s ease-out",
              minWidth: 250,
              fontSize: 14,
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: "#0f172a", margin: 0 }}>
          Deals Management
        </h1>
        <p style={{ color: "#64748b", marginTop: 8 }}>
          Manage and track all your property deals
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
            Total Deals
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#0f172a" }}>
            {totalDeals}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
            Total Value
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#0f172a" }}>
            ₹{totalValue.toLocaleString("en-IN")}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
            Active Deals
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#10b981" }}>
            {activeDeals}
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 15,
          }}
        >
          <div style={{ flex: 1, maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Search by customer, property, deal number, or phone..."
              style={{
                width: "100%",
                padding: "10px 15px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                transition: "all 0.2s",
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>
          <div>
            <button
              onClick={loadDeals}
              style={{
                padding: "10px 20px",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                color: "#1e293b",
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Deals Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
              <th style={{ padding: "15px", textAlign: "left", fontSize: 14, fontWeight: 600, color: "#475569" }}>
                Deal No
              </th>
              <th style={{ padding: "15px", textAlign: "left", fontSize: 14, fontWeight: 600, color: "#475569" }}>
                Customer
              </th>
              <th style={{ padding: "15px", textAlign: "left", fontSize: 14, fontWeight: 600, color: "#475569" }}>
                Property
              </th>
              <th style={{ padding: "15px", textAlign: "right", fontSize: 14, fontWeight: 600, color: "#475569" }}>
                Amount
              </th>
              <th style={{ padding: "15px", textAlign: "left", fontSize: 14, fontWeight: 600, color: "#475569" }}>
                Status
              </th>
              <th style={{ padding: "15px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#475569", width: "100px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, color: "#64748b", marginBottom: 10 }}>
                    No deals found
                  </div>
                  <div style={{ fontSize: 14, color: "#94a3b8" }}>
                    Try adjusting your search criteria
                  </div>
                </td>
              </tr>
            ) : (
              filteredDeals.map((deal) => (
                <tr
                  key={deal._id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "15px", fontSize: 14, color: "#0f172a", fontWeight: 500 }}>
                    {deal.dealNumber}
                  </td>
                  <td style={{ padding: "15px" }}>
                    <div style={{ fontWeight: 500, color: "#0f172a", marginBottom: 4 }}>
                      {deal.customerName}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {deal.customerPhone}
                    </div>
                  </td>
                  <td style={{ padding: "15px", fontSize: 14, color: "#475569" }}>
                    {deal.propertyTitle}
                  </td>
                  <td style={{ padding: "15px", fontSize: 14, fontWeight: 600, color: "#0f172a", textAlign: "right" }}>
                    ₹{Number(deal.finalPrice || 0).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "15px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        background: `${getStatusBadgeColor(deal.status)}20`,
                        color: getStatusBadgeColor(deal.status),
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {getStatusLabel(deal.status)}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <Link
                      href={`/x-admin/deals/${deal._id}`}
                      style={{
                        display: "inline-block",
                        padding: "6px 16px",
                        background: "#3b82f6",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: 6,
                        fontSize: 13,
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filteredDeals.length > 0 && (
        <div
          style={{
            marginTop: 20,
            padding: "15px 20px",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 14,
            color: "#64748b",
          }}
        >
          <div>Showing {filteredDeals.length} of {deals.length} deals</div>
          <div>
            <strong>Total Value:</strong> ₹{totalValue.toLocaleString("en-IN")}
          </div>
        </div>
      )}
    </div>
  );
}