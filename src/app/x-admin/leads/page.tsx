"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  _id: string;
  name: string;
  source: string;
  status: string;
  createdAt: string;
  contact?: string;
};

const tabs = ["New", "Contacted", "Negotiation", "Closed"];

const badge = (s?: string) => {
  const status = (s || "new").toLowerCase();

  return {
    new: { bg: "#dbeafe", c: "#2563eb" },
    contacted: { bg: "#fef3c7", c: "#d97706" },
    negotiation: { bg: "#ede9fe", c: "#7c3aed" },
    closed: { bg: "#dcfce7", c: "#16a34a" },
  }[status] || {
    bg: "#f1f5f9",
    c: "#475569",
  };
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/admin/leads");
        const d = await r.json();
        setLeads(d.leads || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return leads;

    return leads.filter(
      (x) =>
        x.name?.toLowerCase().includes(q) ||
        x.source?.toLowerCase().includes(q) ||
        (x.contact || "").toLowerCase().includes(q)
    );
  }, [leads, query]);

  /* ------------------------------
     CHECKBOX FUNCTIONS
  ------------------------------ */

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((x) => x._id));
    }
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return;

    const confirmDelete = confirm(
      `Delete ${selected.length} selected lead(s)?`
    );

    if (!confirmDelete) return;

    try {
      // API delete call
      await Promise.all(
        selected.map((id) =>
          fetch(`/api/admin/leads/${id}`, {
            method: "DELETE",
          })
        )
      );

      // remove from UI
      setLeads((prev) =>
        prev.filter((x) => !selected.includes(x._id))
      );

      setSelected([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete leads");
    }
  };

  return (
    <div
      style={{
        padding: 24,
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "Inter,sans-serif",
      }}
    >
      {/* Top */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 24,
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 24px rgba(15,23,42,.05)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Lead Management
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#64748b",
            marginTop: 4,
          }}
        >
          Track, search and manage your sales pipeline
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 18,
            flexWrap: "wrap",
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads..."
            style={{
              width: 320,
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "12px 16px",
              outline: "none",
              fontSize: 13,
            }}
          />

          <div
            style={{
              background: "#eef2ff",
              color: "#4338ca",
              padding: "8px 14px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {filtered.length} Leads
          </div>

          {/* Delete Button */}
          {selected.length > 0 && (
            <button
              onClick={deleteSelected}
              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Delete Selected ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 24px rgba(15,23,42,.05)",
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {tabs.map((x) => (
            <button
              key={x}
              style={{
                border: "1px solid #e2e8f0",
                background: "#fff",
                borderRadius: 12,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {x}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 30, color: "#64748b" }}>
            Loading leads...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "60px 2fr 1fr 1fr 1fr 1fr",
                padding: "16px 24px",
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                fontSize: 12,
                fontWeight: 700,
                color: "#475569",
                alignItems: "center",
              }}
            >
              {/* Select All */}
              <div>
                <input
                  type="checkbox"
                  checked={
                    filtered.length > 0 &&
                    selected.length === filtered.length
                  }
                  onChange={toggleSelectAll}
                  style={{
                    width: 16,
                    height: 16,
                    cursor: "pointer",
                  }}
                />
              </div>

              <div>Name</div>
              <div>Contact</div>
              <div>Source</div>
              <div>Status</div>
              <div>Created</div>
            </div>

            {/* Rows */}
            {filtered.map((x) => {
              const s = badge(x.status);

              return (
                <div
                  key={x._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "60px 2fr 1fr 1fr 1fr 1fr",
                    padding: "20px 24px",
                    borderBottom: "1px solid #f1f5f9",
                    alignItems: "center",
                    background: selected.includes(x._id)
                      ? "#f8fafc"
                      : "#fff",
                  }}
                >
                  {/* Checkbox */}
                  <div>
                    <input
                      type="checkbox"
                      checked={selected.includes(x._id)}
                      onChange={() => toggleSelect(x._id)}
                      style={{
                        width: 16,
                        height: 16,
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  {/* Name */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: "#eef2ff",
                        color: "#4338ca",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {x.name?.charAt(0)}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {x.name}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                        }}
                      >
                        Prospect
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div
                    style={{
                      fontSize: 13,
                      color: "#334155",
                    }}
                  >
                    {x.contact || "-"}
                  </div>

                  {/* Source */}
                  <div>
                    <span
                      style={{
                        background: "#f1f5f9",
                        padding: "6px 10px",
                        borderRadius: 10,
                        fontSize: 12,
                        color: "#475569",
                      }}
                    >
                      {x.source}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      style={{
                        background: s.bg,
                        color: s.c,
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {x.status || "New"}
                    </span>
                  </div>

                  {/* Date */}
                  <div
                    style={{
                      fontSize: 13,
                      color: "#64748b",
                    }}
                  >
                    {new Date(x.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}