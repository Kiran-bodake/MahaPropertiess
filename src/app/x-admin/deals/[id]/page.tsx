"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function DealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    loadDeal();
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const loadDeal = async () => {
    try {
      const res = await fetch(`/api/admin/deals/${id}`);
      const data = await res.json();

      if (data.success) {
        setDeal(data.deal);
      } else {
        showToast(data.message || "Failed to load deal", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load deal details", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateDeal = async () => {
    if (!deal) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/admin/deals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: deal.customerName,
          customerPhone: deal.customerPhone,
          customerEmail: deal.customerEmail,
          status: deal.status,
          finalPrice: deal.finalPrice,
          owner: deal.owner,
          notes: deal.notes,
          tokenAmount: deal.tokenAmount,
          totalReceived: deal.totalReceived,
          balanceAmount: deal.balanceAmount,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showToast("Deal updated successfully!", "success");
        await loadDeal(); // Reload to get latest data
      } else {
        showToast(data.message || "Failed to update deal", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update deal. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteDeal = async () => {
    // Custom confirmation dialog
    const userConfirmed = await showConfirmationDialog(
      "Delete Deal",
      "Are you sure you want to delete this deal? This action cannot be undone."
    );

    if (!userConfirmed) return;

    try {
      const res = await fetch(`/api/admin/deals/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        showToast("Deal deleted successfully!", "success");
        setTimeout(() => {
          router.push("/x-admin/deals");
        }, 1000);
      } else {
        showToast(data.message || "Failed to delete deal", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete deal. Please try again.", "error");
    }
  };

  const showConfirmationDialog = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      `;

      const modalContent = document.createElement("div");
      modalContent.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;

      modalContent.innerHTML = `
        <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">${title}</h3>
        <p style="margin: 0 0 20px 0; color: #64748b;">${message}</p>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button id="cancel-btn" style="padding: 8px 16px; background: #e2e8f0; border: none; border-radius: 6px; cursor: pointer; color: #1e293b;">Cancel</button>
          <button id="confirm-btn" style="padding: 8px 16px; background: #dc2626; border: none; border-radius: 6px; cursor: pointer; color: white;">Delete</button>
        </div>
      `;

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      const cancelBtn = modalContent.querySelector("#cancel-btn");
      const confirmBtn = modalContent.querySelector("#confirm-btn");

      const cleanup = () => {
        document.body.removeChild(modal);
        resolve(false);
      };

      const confirm = () => {
        document.body.removeChild(modal);
        resolve(true);
      };

      cancelBtn?.addEventListener("click", cleanup);
      confirmBtn?.addEventListener("click", confirm);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) cleanup();
      });
    });
  };

  if (loading) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <div style={{ fontSize: 16, color: "#64748b" }}>Loading deal details...</div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <div style={{ fontSize: 16, color: "#64748b" }}>Deal not found</div>
        <button
          onClick={() => router.push("/x-admin/deals")}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Back to Deals
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 30,
        background: "#f8fafc",
        minHeight: "100vh",
        position: "relative",
      }}
    >
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

      <div
        style={{
          background: "#fff",
          padding: 25,
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            marginBottom: 20,
            padding: "8px 16px",
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ← Back
        </button>

        <h2 style={{ margin: "0 0 20px 0", fontSize: 24 }}>{deal.dealNumber}</h2>

        <div
          style={{
            display: "grid",
            gap: 15,
            marginTop: 20,
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Customer Name
            </label>
            <input
              value={deal.customerName}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  customerName: e.target.value,
                })
              }
              placeholder="Customer Name"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Phone Number
            </label>
            <input
              value={deal.customerPhone}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  customerPhone: e.target.value,
                })
              }
              placeholder="Phone"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Email Address
            </label>
            <input
              value={deal.customerEmail || ""}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  customerEmail: e.target.value,
                })
              }
              placeholder="Email"
              type="email"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Property Title
            </label>
            <input
              value={deal.propertyTitle}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                background: "#f8fafc",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Status
            </label>
            <select
              value={deal.status}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  status: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                background: "#fff",
              }}
            >
              <option value="new">New</option>
              <option value="site_visit">Site Visit</option>
              <option value="negotiation">Negotiation</option>
              <option value="token_paid">Token Paid</option>
              <option value="agreement">Agreement</option>
              <option value="registration">Registration</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Final Price
            </label>
            <input
              type="number"
              value={deal.finalPrice || 0}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  finalPrice: Number(e.target.value),
                })
              }
              placeholder="Final Price"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Token Amount
            </label>
            <input
              type="number"
              value={deal.tokenAmount || 0}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  tokenAmount: Number(e.target.value),
                })
              }
              placeholder="Token Amount"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Total Received
            </label>
            <input
              type="number"
              value={deal.totalReceived || 0}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  totalReceived: Number(e.target.value),
                })
              }
              placeholder="Total Received"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Balance Amount
            </label>
            <input
              type="number"
              value={deal.balanceAmount || 0}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  balanceAmount: Number(e.target.value),
                })
              }
              placeholder="Balance Amount"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Owner
            </label>
            <input
              value={deal.owner || ""}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  owner: e.target.value,
                })
              }
              placeholder="Owner"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#64748b" }}>
              Notes
            </label>
            <textarea
              rows={5}
              value={deal.notes || ""}
              onChange={(e) =>
                setDeal({
                  ...deal,
                  notes: e.target.value,
                })
              }
              placeholder="Notes"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={updateDeal}
            disabled={saving}
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: 8,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Update Deal"}
          </button>

          <button
            onClick={deleteDeal}
            style={{
              background: "#dc2626",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Delete Deal
          </button>
        </div>
      </div>
    </div>
  );
}