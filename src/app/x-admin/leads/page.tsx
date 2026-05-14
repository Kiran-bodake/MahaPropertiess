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

const badge = (s?: string) => {
  const status = (s || "new").toLowerCase();

  return {
    new: { bg: "#eff6ff", c: "#2563eb" },
    contacted: { bg: "#fff7ed", c: "#ea580c" },
    negotiation: { bg: "#f5f3ff", c: "#7c3aed" },
    closed: { bg: "#f0fdf4", c: "#16a34a" }
  }[status] || {
    bg: "#f8fafc",
    c: "#475569"
  };
};

export default function LeadsPage() {

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");

  const [dateFilter, setDateFilter] =
    useState("7");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [selected, setSelected] =
    useState<string[]>([]);

  useEffect(() => {

    (async () => {

      try {

        const r =
          await fetch(
            "/api/admin/leads"
          );

        const d =
          await r.json();

        setLeads(
          d.leads || []
        );

      } finally {

        setLoading(false);

      }

    })();

  }, []);

  const filtered =
    useMemo(() => {

      const q =
        query
          .trim()
          .toLowerCase();

      const now =
        new Date();

      return leads.filter(
        (x) => {

          const searchMatch =
            !q ||

            x.name
              ?.toLowerCase()
              .includes(q) ||

            x.source
              ?.toLowerCase()
              .includes(q) ||

            (
              x.contact ||
              ""
            )
              .toLowerCase()
              .includes(q);

          const leadDate =
            new Date(
              x.createdAt
            );

          let dateMatch =
            true;

          if (
            dateFilter ===
            "7"
          ) {

            const d =
              new Date();

            d.setDate(
              now.getDate() -
                7
            );

            dateMatch =
              leadDate >= d;

          }

          else if (
            dateFilter ===
            "15"
          ) {

            const d =
              new Date();

            d.setDate(
              now.getDate() -
                15
            );

            dateMatch =
              leadDate >= d;

          }

          else if (
            dateFilter ===
            "30"
          ) {

            const d =
              new Date();

            d.setDate(
              now.getDate() -
                30
            );

            dateMatch =
              leadDate >= d;

          }

          else if (
            dateFilter ===
            "custom"
          ) {

            const fromMatch =
              !fromDate ||

              leadDate >=
                new Date(
                  fromDate
                );

            const toMatch =
              !toDate ||

              leadDate <=
                new Date(
                  `${toDate}T23:59:59`
                );

            dateMatch =
              fromMatch &&
              toMatch;

          }

          return (
            searchMatch &&
            dateMatch
          );

        }
      );

    }, [
      leads,
      query,
      dateFilter,
      fromDate,
      toDate
    ]);

  const toggleSelect =
    (id: string) => {

      setSelected(
        (prev) =>

          prev.includes(id)

            ? prev.filter(
                (x) =>
                  x !== id
              )

            : [
                ...prev,
                id
              ]

      );

    };

  const toggleSelectAll =
    () => {

      if (
        selected.length ===
        filtered.length
      ) {

        setSelected([]);

      }

      else {

        setSelected(
          filtered.map(
            (x) =>
              x._id
          )
        );

      }

    };

  const deleteSelected =
    async () => {

      if (
        selected.length === 0
      ) return;

      const ok =
        confirm(
          `Delete ${selected.length} leads?`
        );

      if (!ok) return;

      await Promise.all(

        selected.map(
          (id) =>

            fetch(
              `/api/admin/leads/${id}`,
              {
                method:
                  "DELETE"
              }
            )

        )

      );

      setLeads(
        (prev) =>

          prev.filter(
            (x) =>

              !selected.includes(
                x._id
              )

          )

      );

      setSelected([]);

    };

  return (

    <div
      style={{
        padding: 28,
        background:
          "#f8fafc",
        minHeight:
          "100vh",
        fontFamily:
          "Inter,sans-serif"
      }}
    >

      {/* TOP */}
      <div
        style={{
          background:
            "#fff",
          borderRadius: 24,
          border:
            "1px solid #e2e8f0",
          padding: 24,
          marginBottom: 24
        }}
      >

        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color:
              "#0f172a"
          }}
        >
          Lead Dashboard
        </div>

        <div
          style={{
            color:
              "#64748b",
            marginTop: 4
          }}
        >
          Track and manage your sales leads
        </div>

        <div
          style={{
            display:
              "flex",
            gap: 12,
            marginTop: 20,
            alignItems:
              "center",
            flexWrap:
              "wrap"
          }}
        >

          {/* SEARCH */}
          <input
            value={query}
            onChange={(e)=>
              setQuery(
                e.target.value
              )
            }
            placeholder="Search leads..."
            style={{
              width: 280,
              padding:
                "12px 16px",
              border:
                "1px solid #e2e8f0",
              borderRadius: 12
            }}
          />

          {/* COUNT */}
          <div
            style={{
              background:
                "#eef2ff",
              color:
                "#4338ca",
              padding:
                "12px 18px",
              borderRadius: 12,
              fontWeight: 600
            }}
          >
            {
              filtered.length
            } Leads
          </div>

          {/* DATE FILTER */}
          <div
            style={{
              marginLeft:
                "auto",
              display:
                "flex",
              gap: 12,
              alignItems:
                "center",
              flexWrap:
                "wrap"
            }}
          >

            <select
              value={
                dateFilter
              }
              onChange={(e)=>
                setDateFilter(
                  e.target.value
                )
              }
              style={{
                padding:
                  "12px 16px",
                border:
                  "1px solid #e2e8f0",
                borderRadius: 12
              }}
            >

              <option value="7">
                Last 7 Days
              </option>

              <option value="15">
                Last 15 Days
              </option>

              <option value="30">
                Last Month
              </option>

              <option value="custom">
                Custom
              </option>

            </select>

            {dateFilter ===
              "custom" && (

              <>

                <input
                  type="date"
                  value={
                    fromDate
                  }
                  onChange={(e)=>
                    setFromDate(
                      e.target.value
                    )
                  }
                  style={{
                    padding:
                      "12px 16px",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: 12
                  }}
                />

                <input
                  type="date"
                  value={
                    toDate
                  }
                  onChange={(e)=>
                    setToDate(
                      e.target.value
                    )
                  }
                  style={{
                    padding:
                      "12px 16px",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: 12
                  }}
                />

              </>

            )}

          </div>

          {/* DELETE */}
          {selected.length >
            0 && (

            <button
              onClick={
                deleteSelected
              }
              style={{
                background:
                  "#dc2626",
                color:
                  "#fff",
                border:
                  "none",
                borderRadius: 12,
                padding:
                  "12px 16px",
                cursor:
                  "pointer"
              }}
            >
              Delete (
              {
                selected.length
              }
              )
            </button>

          )}

        </div>

      </div>

      {/* TABLE */}
      <div
        style={{
          background:
            "#fff",
          borderRadius: 24,
          overflow:
            "hidden",
          border:
            "1px solid #e2e8f0"
        }}
      >

        {loading ? (

          <div
            style={{
              padding: 30
            }}
          >
            Loading...
          </div>

        ) : (

          <>

            {/* HEADER */}
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "60px 2fr 1fr 1fr 1fr 1fr",
                padding:
                  "18px 24px",
                background:
                  "#f8fafc",
                fontWeight: 700
              }}
            >

              <input
                type="checkbox"
                checked={
                  selected.length ===
                    filtered.length &&
                  filtered.length >
                    0
                }
                onChange={
                  toggleSelectAll
                }
              />

              <div>
                Name
              </div>

              <div>
                Contact
              </div>

              <div>
                Source
              </div>

              <div>
                Status
              </div>

              <div>
                Created
              </div>

            </div>

            {/* ROWS */}
            {filtered.map(
              (x) => {

                const s =
                  badge(
                    x.status
                  );

                return (

                  <div
                    key={
                      x._id
                    }
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "60px 2fr 1fr 1fr 1fr 1fr",
                      padding:
                        "18px 24px",
                      borderTop:
                        "1px solid #f1f5f9",
                      alignItems:
                        "center"
                    }}
                  >

                    <input
                      type="checkbox"
                      checked={
                        selected.includes(
                          x._id
                        )
                      }
                      onChange={()=>
                        toggleSelect(
                          x._id
                        )
                      }
                    />

                    <div>
                      {
                        x.name
                      }
                    </div>

                    <div>
                      {
                        x.contact ||
                        "-"
                      }
                    </div>

                    <div>
                      {
                        x.source
                      }
                    </div>

                    <div>

                      <span
                        style={{
                          background:
                            s.bg,
                          color:
                            s.c,
                          padding:
                            "6px 12px",
                          borderRadius: 999,
                          fontSize: 12
                        }}
                      >
                        {
                          x.status
                        }
                      </span>

                    </div>

                    <div>
                      {new Date(
                        x.createdAt
                      ).toLocaleDateString()}
                    </div>

                  </div>

                );

              }
            )}

          </>

        )}

      </div>

    </div>

  );

}