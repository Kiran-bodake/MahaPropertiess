"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Eye, EyeOff } from "lucide-react";

type Lead = {
  _id: string;
  name: string;
  source: string;
  status: string;
  createdAt: string;
  contact?: string;
  isViewed?: boolean;
};

const badge = (s?: string) => {
  const status = (s || "new").toLowerCase();

  return (
    {
      new: {
        bg: "#eff6ff",
        c: "#2563eb",
      },

      contacted: {
        bg: "#fff7ed",
        c: "#ea580c",
      },

      negotiation: {
        bg: "#f5f3ff",
        c: "#7c3aed",
      },

      closed: {
        bg: "#f0fdf4",
        c: "#16a34a",
      },
    }[status] || {
      bg: "#f8fafc",
      c: "#475569",
    }
  );
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const searchParams = useSearchParams();

  const leadId = searchParams.get("id");

  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");

  const [dateFilter, setDateFilter] = useState("today");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [selected, setSelected] = useState<string[]>([]);

  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const [activeLead, setActiveLead] = useState<any>(null);

  const [visibleContacts, setVisibleContacts] = useState<
    Record<string, boolean>
  >({});

  const maskPhone = (phone?: string) => {
    if (!phone) return "-";

    return "xxxxxx" + phone.slice(-4);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/leads");

        const data = await res.json();

        setLeads(data.leads || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (leadId && leads.length) {
      const found = leads.find((x) => x._id === leadId);

      if (found && !activeLead) {
        openLead(found);
      }
    }
  }, [leadId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const now = new Date();

    return leads.filter((x) => {
      const searchMatch =
        !q ||
        x.name?.toLowerCase().includes(q) ||
        x.source?.toLowerCase().includes(q);

      const leadDate = new Date(x.createdAt);

      let dateMatch = true;

      if (dateFilter === "today") {
        dateMatch = leadDate.toDateString() === now.toDateString();
      } else if (dateFilter === "7") {
        const d = new Date();

        d.setDate(now.getDate() - 7);

        dateMatch = leadDate >= d;
      } else if (dateFilter === "15") {
        const d = new Date();

        d.setDate(now.getDate() - 15);

        dateMatch = leadDate >= d;
      } else if (dateFilter === "custom") {
        const fromMatch = !fromDate || leadDate >= new Date(fromDate);

        const toMatch = !toDate || leadDate <= new Date(`${toDate}T23:59:59`);

        dateMatch = fromMatch && toMatch;
      }

      return searchMatch && dateMatch;
    });
  }, [leads, query, dateFilter, fromDate, toDate]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const openLead = async (lead: any) => {
    try {
      // mark viewed
      await fetch(
        "/api/admin/leads/view",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: lead._id,
          }),
        },
      );

      // open drawer
      setActiveLead(lead);

      // fetch property details
      if (lead.propertyId) {
        const res = await fetch(`/api/admin/properties/${lead.propertyId}`);

        const data = await res.json();

        setSelectedProperty(data.property);
      }

      // update UI
      setLeads((prev) =>
        prev.map((item) =>
          item._id === lead._id
            ? {
                ...item,

                isViewed: true,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);
    }
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

    const ok = confirm(`Delete ${selected.length} leads?`);

    if (!ok) return;

    await Promise.all(
      selected.map((id) =>
        fetch(
          `/api/admin/leads/${id}`,

          {
            method: "DELETE",
          },
        ),
      ),
    );

    setLeads((prev) => prev.filter((x) => !selected.includes(x._id)));

    setSelected([]);
  };

  return (
    <div
      style={{
        padding: "20px 24px",

        background: "#f8fafc",

        minHeight: "100vh",

        fontFamily: "Inter,sans-serif",
      }}
    >
      {/* TOP */}
      <div
        style={{
          background: "#fff",

          borderRadius: 20,

          padding: "20px 24px",

          marginBottom: 18,

          border: "1px solid #e2e8f0",

          boxShadow: "0 6px 24px rgba(15,23,42,.04)",
        }}
      >
        <h1
          style={{
            margin: 0,

            fontSize: 28,

            fontWeight: 800,

            color: "#0f172a",
          }}
        >
          Lead Dashboard
        </h1>

        <p
          style={{
            marginTop: 6,

            color: "#64748b",
          }}
        >
          Manage all incoming sales leads
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {/* SEARCH */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads..."
            style={{
              width: 260,

              height: 48,

              border: "1px solid #e2e8f0",

              borderRadius: 14,

              padding: "0 16px",

              outline: "none",

              fontSize: 14,
            }}
          />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              height: 48,

              border: "1px solid #e2e8f0",

              borderRadius: 14,

              padding: "0 16px",
            }}
          >
            <option value="today">Today</option>

            <option value="7">Last 7 Days</option>

            <option value="15">Last 15 Days</option>

            <option value="custom">Custom</option>
          </select>
          {dateFilter === "custom" && (
            <>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </>
          )}

          {/* COUNT */}
          <div
            style={{
              height: 48,

              padding: "0 18px",

              display: "flex",

              alignItems: "center",

              borderRadius: 14,

              background: "#eff6ff",

              color: "#1d4ed8",

              fontWeight: 700,
            }}
          >
            {filtered.length} Leads
          </div>

          {/* DELETE */}
          {selected.length > 0 && (
            <button
              onClick={deleteSelected}
              style={{
                height: 48,

                border: "none",

                borderRadius: 14,

                background: "#dc2626",

                color: "#fff",

                padding: "0 20px",

                cursor: "pointer",

                fontWeight: 700,
              }}
            >
              Delete ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#fff",

          borderRadius: 20,

          border: "1px solid #e2e8f0",

          overflow: "hidden",

          boxShadow: "0 8px 30px rgba(15,23,42,.04)",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 30,
            }}
          >
            Loading...
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div
              style={{
                display: "grid",

                gridTemplateColumns: "60px 2fr 1fr 1fr 1fr 1fr",

                padding: "14px 20px",

                background: "#f8fafc",

                fontWeight: 700,

                fontSize: 13,

                color: "#475569",
              }}
            >
              <input
                type="checkbox"
                checked={
                  selected.length === filtered.length && filtered.length > 0
                }
                onChange={toggleSelectAll}
              />

              <div>Name</div>
              <div>Contact</div>
              <div>Source</div>
              <div>Status</div>
              <div>Created</div>
            </div>

            {/* ROWS */}
            {filtered.map((x) => {
              const s = badge(x.status);

              return (
                <div
                  key={x._id}
                  onClick={() => openLead(x)}
                  style={{
                    display: "grid",

                    gridTemplateColumns: "60px 2fr 1fr 1fr 1fr 1fr",

                    padding: "14px 20px",

                    borderTop: "1px solid #f1f5f9",

                    alignItems: "center",

                    minHeight: 64,

                    background: x.isViewed ? "#ffffff" : "#dbeafe",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(x._id)}
                    onChange={() => toggleSelect(x._id)}
                  />

                  <div
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {x.name}
                  </div>

                  {/* CONTACT */}
                  <div
                    style={{
                      display: "flex",

                      gap: 8,

                      alignItems: "center",
                    }}
                  >
                    <span>
                      {visibleContacts[x._id]
                        ? x.contact
                        : maskPhone(x.contact)}
                    </span>

                    <button
                      onClick={() =>
                        setVisibleContacts((prev) => ({
                          ...prev,

                          [x._id]: !prev[x._id],
                        }))
                      }
                      style={{
                        width: 32,

                        height: 32,

                        borderRadius: 10,

                        border: "1px solid #e2e8f0",

                        background: "#fff",

                        cursor: "pointer",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",
                      }}
                    >
                      {visibleContacts[x._id] ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  <div>{x.source}</div>

                  <div>
                    <span
                      style={{
                        background: s.bg,

                        color: s.c,

                        padding: "6px 12px",

                        borderRadius: 999,

                        fontSize: 12,

                        fontWeight: 700,
                      }}
                    >
                      {x.status}
                    </span>
                  </div>

                  <div>{new Date(x.createdAt).toLocaleDateString()}</div>
                </div>
              );
            })}
          </>
        )}
      </div>
      {activeLead && (
        <div
          style={{
            position: "fixed",

            top: 0,

            right: 0,

            width: "420px",

            height: "100vh",

            background: "#fff",

            padding: "24px",

            boxShadow: "-10px 0 30px rgba(0,0,0,.12)",

            zIndex: 999,
          }}
        >
          <button
            onClick={() => {
              setActiveLead(null);

              setSelectedProperty(null);
            }}
          >
            Close
          </button>

          <h2>Customer Info</h2>

          <p>Name: {activeLead.name}</p>

          <p>Contact: {activeLead.contact}</p>

          <h2>Property Info</h2>

          <p>Property Name: {selectedProperty?.title || "--"}</p>

          <p>Property ID: {selectedProperty?.propertyId || "--"}</p>

          <p>Type: {selectedProperty?.propertyType || "--"}</p>

          <p>Price: ₹{selectedProperty?.price || 0}</p>

          <p>Location: {selectedProperty?.city}</p>

          <p>Category: {selectedProperty?.category}</p>
        </div>
      )}
    </div>
  );
}
