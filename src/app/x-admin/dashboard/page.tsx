"use client";

import { useEffect, useState } from "react";
import {
  BarChart2,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";



const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 22,
  padding: 20,
  boxShadow: "0 8px 24px rgba(15,23,42,.05)",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
      leads: 0,
      deals: 0,
      tasks: 0,
    }),
    [leads, setLeads] = useState<any[]>([]),
    [loading, setLoading] = useState(true),
    [query, setQuery] = useState(""),
    [page, setPage] = useState(1),
    [mobile, setMobile] = useState(false),
    

    // ✅ selected rows
    [selected, setSelected] = useState<string[]>([]);

  const perPage = 10;

  const [

  analytics,

  setAnalytics

] = useState<any>(null);
const [

  showLeadAnalytics,

  setShowLeadAnalytics

] = useState(false);

  /* screen detect */
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);

    check();

    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  /* data fetch */
  useEffect(() => {
    (async () => {
      try {
        const [s, l,a] = await Promise.all([

  fetch(
    "/api/admin/dashboard"
  ),

  fetch(
    "/api/admin/leads"
  ),

  fetch(
    "/api/admin/analytics/leads"
  )

]);

        const sd = s.ok ? await s.json() : {};
        const ld = l.ok ? await l.json() : {};
        const ad= a.ok ? await a.json() : {};

        setStats({
          leads: sd.leadsCount || 0,
          deals: sd.dealsCount || 0,
          tasks: sd.tasksCount || 0,
        });

        setLeads(ld.leads || []);
       setAnalytics(
  ad
);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div style={{ padding: 30 }}>Loading...</div>;
  }

  const conversion = stats.leads
    ? Math.round((stats.deals / stats.leads) * 100)
    : 0;

const cards = [

  {

    label:"Total Leads",

    value:
      analytics?.totalLeads || 0,

    delta:"+"

  },

  {

    label:"Today's Leads",

    value:
      analytics?.todayLeads || 0,

    delta:"+"

  },

  {

    label:"New Leads",

    value:
      analytics?.newLeads || 0,

    delta:"+"

  },

  {

    label:"Unread Leads",

    value:
      analytics?.unreadLeads || 0,

    delta:"+"

  }

];

const openLead =
  async (
    lead:any
  ) => {

    try{

      const res =

        await fetch(

          "/api/admin/leads/view",

          {

            method:"POST",

            headers:{

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              id:
                lead._id

            })

          }

        );


      if(!res.ok){

        console.error(
          "View update failed"
        );

        return;

      }


      // update UI instantly
      setLeads(

        prev =>

          prev.map(

            item =>

              item._id === lead._id

              ?

              {

                ...item,

                isViewed:true

              }

              :

              item

          )

      );


      // update analytics instantly
      setAnalytics(

        (prev:any) => ({

          ...prev,

          unreadLeads:

            Math.max(

              0,

              prev?.unreadLeads - 1

            )

        })

      );

    }

    catch(error){

      console.error(
        error
      );

    }

};

  const filtered = leads.filter(
    (x: any) =>
      !query ||
      x.name?.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  );

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ✅ checkbox select */
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ✅ select all */
  const toggleSelectAll = () => {
    const ids = paginated.map((x: any) => x._id);

    if (ids.every((id: string) => selected.includes(id))) {
      setSelected((prev) =>
        prev.filter((id) => !ids.includes(id))
      );
    } else {
      setSelected((prev) => [
        ...new Set([...prev, ...ids]),
      ]);
    }
  };

  /* ✅ delete selected */
  const deleteSelected = async () => {
    if (selected.length === 0) return;

    const confirmDelete = confirm(
      `Delete ${selected.length} selected leads?`
    );

    if (!confirmDelete) return;

    try {
      // API delete request
      await fetch("/api/admin/leads/delete-many", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selected,
        }),
      });

      // remove from UI
      setLeads((prev) =>
        prev.filter((x: any) => !selected.includes(x._id))
      );

      setSelected([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Inter,sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: mobile ? "16px" : "18px 28px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: mobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: mobile ? "flex-start" : "center",
          gap: mobile ? 12 : 0,
        }}
      >
        <div>
          <div
            style={{
              fontSize: mobile ? 18 : 20,
              fontWeight: 700,
            }}
          >
            Dashboard
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#64748b",
            }}
          >
            Leads & Analytics
          </div>
        </div>

        <Bell size={18} color="#64748b" />
      </div>

      <div style={{ padding: mobile ? 12 : 24 }}>
        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile
              ? "1fr"
              : "repeat(4,1fr)",
            gap: 18,
            marginBottom: 24,
          }}
        >
          {/* Lead Analytics */}
<div
  style={{
    marginBottom: 24,
  }}
>
  {/* Main Analytics Card */}
  <div
    onClick={() =>
      setShowLeadAnalytics(
        !showLeadAnalytics
      )
    }
    style={{
      ...card,
      display: "flex",
      justifyContent:
        "space-between",
      alignItems: "center",
      cursor: "pointer",
      border:
        showLeadAnalytics
          ? "2px solid #4338ca"
          : "1px solid #e2e8f0",
      transition: "0.25s",
    }}
  >
    <div>
      <div
        style={{
          fontSize: 12,
          color: "#64748b",
          fontWeight: 600,
        }}
      >
        Lead Analytics
      </div>

      <div
        style={{
          fontSize: mobile
            ? 28
            : 38,
          fontWeight: 800,
          marginTop: 8,
          color: "#0f172a",
        }}
      >
        {
          analytics?.totalLeads || 0
        }
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#16a34a",
          marginTop: 6,
        }}
      >
        Total Registered Leads
      </div>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          background:
            "#eef2ff",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        <BarChart2
          size={18}
          color="#4338ca"
        />
      </div>

      <div
        style={{
          fontSize: 18,
          color: "#64748b",
        }}
      >
        {
          showLeadAnalytics
            ? "▲"
            : "▼"
        }
      </div>
    </div>
  </div>

  {/* Expanded Analytics */}
  {showLeadAnalytics && (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          mobile
            ? "1fr"
            : "repeat(3,1fr)",
        gap: 18,
        marginTop: 18,
      }}
    >
      {cards
        .slice(1)
        .map((c) => (
          <div
            key={c.label}
            style={card}
          >
            <div
              style={{
                fontSize: 12,
                color:
                  "#64748b",
                fontWeight: 600,
              }}
            >
              {c.label}
            </div>

            <div
              style={{
                fontSize:
                  mobile
                    ? 24
                    : 30,
                fontWeight: 800,
                marginTop: 10,
              }}
            >
              {c.value}
            </div>

            <div
              style={{
                fontSize: 12,
                marginTop: 8,
                color:
                  "#16a34a",
              }}
            >
              {c.delta}
            </div>
          </div>
        ))}
    </div>
  )}
</div>
        </div>

        {/* Leads */}
        <div
          style={{
            ...card,
            padding: 0,
            overflow: "hidden",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: 20,
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: mobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: mobile ? "stretch" : "center",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                Recent Leads ({filtered.length})
              </div>

              {selected.length > 0 && (
                <button
                  onClick={deleteSelected}
                  style={{
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Trash2 size={14} />
                  Delete ({selected.length})
                </button>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: mobile ? "column" : "row",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  width: mobile ? "100%" : "auto",
                }}
              >
                <Search size={13} />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                  }}
                />
              </div>

              <button
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  borderRadius: 14,
                  padding: "10px 14px",
                }}
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: mobile ? 760 : "100%" }}>
              {/* Header Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "60px 2fr 1fr 1fr 1fr auto",
                  padding: "16px 24px",
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#64748b",
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={
                      paginated.length > 0 &&
                      paginated.every((x: any) =>
                        selected.includes(x._id)
                      )
                    }
                    onChange={toggleSelectAll}
                  />
                </div>

                <div>Name</div>
                <div>Contact</div>
                <div>Source</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {/* Rows */}
              {paginated.map((lead: any) => (
                <div
                  key={lead._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "60px 2fr 1fr 1fr 1fr auto",
                    alignItems: "center",
                    padding: "22px 24px",
                    borderTop: "1px solid #f1f5f9",
                   background:

  !lead.isViewed

  ?

  "#dbeafe"

  :

  selected.includes(
    lead._id
  )

  ?

  "#f8fafc"

  :

  "#ffffff"
                  }}
                >
                  {/* Checkbox */}
                  <div>
                    <input
                      type="checkbox"
                      checked={selected.includes(lead._id)}
                      onChange={() =>
                        toggleSelect(lead._id)
                      }
                    />
                  </div>

                  {/* User */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                      background:

  lead.isViewed

  ?

  "#dcfce7"

  :

  "#eef2ff",

color:

  lead.isViewed

  ?

  "#166534"

  :

  "#4338ca",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {lead.name?.charAt(0)}
                    </div>

                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {lead.name}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                        }}
                      >
                        Prospect Lead
                      </div>
                    </div>
                  </div>

                  <div>{lead.contact || "—"}</div>

                  <div>{lead.source || "Website"}</div>

                  <div>
                    <span
                      style={{
                        background: "#eef2ff",
                        color: "#4338ca",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                    {

  lead.isViewed

  ?

  "Viewed"

  :

  "New"

}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                    }}
                  >
                   <button

  onClick={()=>

    openLead(

      lead

    )

  }

  style={{

    border:"none",

    background:"none",

    cursor:"pointer"

  }}

>

  <Eye size={14} />

</button>

                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div
            style={{
              padding: 18,
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <div>
              {page}/{totalPages}
            </div>

            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}