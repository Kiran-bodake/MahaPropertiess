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

import { useRouter }
from "next/navigation";

import {

  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,

  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,

} from "recharts";




const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 22,
  padding: 20,
  boxShadow: "0 8px 24px rgba(15,23,42,.05)",
};


export default function AdminDashboard() {

  const router = useRouter();
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

    const [

  properties,

  setProperties

] = useState<any[]>([]);
const [

  activity,

  setActivity

] = useState<any[]>([]);


  const perPage = 10;

  const [

  analytics,

  setAnalytics

] = useState<any>(null);

const [

  showPropertyAnalytics,

  setShowPropertyAnalytics

] = useState(false);


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
     const [s, l, a, p, rp ,ac] =

  await Promise.all([

    fetch(
      "/api/admin/dashboard"
    ),

    fetch(
      "/api/admin/leads"
    ),

    fetch(
      "/api/admin/analytics/leads"
    ),

    fetch(
      "/api/admin/analytics/properties"
    ),
    fetch(
  "/api/admin/recent-properties"
),
fetch(
  "/api/admin/activity"
)


]);

        const sd = s.ok ? await s.json() : {};
        const ld = l.ok ? await l.json() : {};
        const ad= a.ok ? await a.json() : {};
        const pd =
  p.ok ? await p.json() : {};

        setStats({
          leads: sd.leadsCount || 0,
          deals: sd.dealsCount || 0,
          tasks: sd.tasksCount || 0,
        });

        
        const rpd =

  rp.ok

    ? await rp.json()

    : {};

        setLeads(ld.leads || []);

        
        setProperties(

  rpd.properties || []

);



      setAnalytics({

  ...ad,

  ...pd

});
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

const propertyCards = [

  {

    label:
      "Pending Properties",

    value:
      analytics?.pendingProperties || 0,

    delta:
      "Waiting Approval"

  },

  {

    label:
      "Approved Properties",

    value:
      analytics?.approvedProperties || 0,

    delta:
      "Live Listings"

  },

  {

    label:
      "Rejected Properties",

    value:
      analytics?.rejectedProperties || 0,

    delta:
      "Rejected Listings"

  },

  {

    label:
      "Premium Properties",

    value:
      analytics?.premiumProperties || 0,

    delta:
      "Premium Listings"

  },

  {

    label:
      "Featured Properties",

    value:
      analytics?.featuredProperties || 0,

    delta:
      "Homepage Featured"

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

const updatePropertyStatus = async (

  id:string,

  status:string

) => {

  try{

    const res = await fetch(

      "/api/admin/properties/update-status",

      {

        method:"POST",

        headers:{

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          id,

          status

        })

      }

    );

    if(!res.ok){

      console.error(
        "Status update failed"
      );

      return;

    }

    // update UI instantly
    setProperties(

      prev =>

        prev.map(

          (p:any)=>

            p._id === id

            ?

            {

              ...p,

              approvalStatus:status

            }

            :

            p

        )

    );

  }

  catch(error){

    console.error(error);

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

  const propertyTypeData = [

  {
    name:"Plots",
    value:45
  },

  {
    name:"Flats",
    value:30
  },

  {
    name:"Villas",
    value:15
  },

  {
    name:"Commercial",
    value:10
  }

];

const trendData = [

  {
    day:"Mon",
    properties:12
  },

  {
    day:"Tue",
    properties:18
  },

  {
    day:"Wed",
    properties:9
  },

  {
    day:"Thu",
    properties:22
  },

  {
    day:"Fri",
    properties:16
  },

  {
    day:"Sat",
    properties:28
  },

  {
    day:"Sun",
    properties:20
  }

];

const COLORS = [

  "#16a34a",

  "#2563eb",

  "#7c3aed",

  "#eab308"

];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Inter,sans-serif",
      }}
    >
      {/* Header */}
      {/* HEADER */}
<div
  style={{
    height: 64,

    background:
      "rgba(255,255,255,.85)",

    backdropFilter:
      "blur(12px)",

    borderBottom:
      "1px solid #e2e8f0",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    padding:
      mobile
        ? "0 14px"
        : "0 22px",

    position: "sticky",

    top: 0,

    zIndex: 20,
  }}
>

  {/* LEFT */}
  <div>

    <div
      style={{
        fontSize:
          mobile
            ? 18
            : 22,

        fontWeight: 700,

        color:"#0f172a",

        lineHeight:1.1,
      }}
    >
      Dashboard
    </div>

    <div
      style={{
        fontSize:11,

        color:"#64748b",

        marginTop:2,

        fontWeight:500,
      }}
    >
      Leads & Analytics
    </div>

  </div>

  {/* RIGHT */}
  <div
    style={{
      display:"flex",
      alignItems:"center",
      gap:10,
    }}
  >

    <button
      style={{
        width:36,
        height:36,

        border:"none",

        borderRadius:12,

        background:"#f8fafc",

        display:"flex",

        alignItems:"center",

        justifyContent:
          "center",

        cursor:"pointer",
      }}
    >
      <Bell
        size={16}
        color="#64748b"
      />
    </button>

  </div>

</div>

{/* BODY */}
<div
  style={{
    padding:
      mobile
        ? 12
        : 20,
  }}
>
     {/* COMPACT KPI */}
<div
  style={{
    display: "grid",

    gridTemplateColumns:
      mobile
        ? "1fr"
        : "repeat(4,1fr)",

    gap: 16,

    marginBottom: 22,
  }}
>

  {[
    {
      label:"Total Leads",

      value:
        analytics?.totalLeads || 0,

      icon:"📈",

      color:"#2563eb",

      bg:"#eff6ff",
    },

    {
      label:"New Leads",

      value:
        analytics?.newLeads || 0,

      icon:"🔥",

      color:"#7c3aed",

      bg:"#f5f3ff",
    },

    {
      label:"Properties",

      value:
        analytics?.totalProperties || 0,

      icon:"🏠",

      color:"#16a34a",

      bg:"#ecfdf5",
    },

    {
      label:"Pending",

      value:
        analytics?.pendingProperties || 0,

      icon:"⏳",

      color:"#ea580c",

      bg:"#fff7ed",
    },
  ].map((item,index)=>(

    <div
      key={index}

      style={{
        background:"#fff",

        border:
          "1px solid #e2e8f0",

        borderRadius:20,

        padding:"14px 16px",

        display:"flex",

        alignItems:"center",

        justifyContent:
          "space-between",

        boxShadow:
          "0 4px 14px rgba(15,23,42,.04)",

        minHeight:92,
      }}
    >

      {/* LEFT */}
      <div>

        <div
          style={{
            fontSize:11,

            fontWeight:700,

            color:"#64748b",

            textTransform:
              "uppercase",

            letterSpacing:.4,
          }}
        >
          {item.label}
        </div>

        <div
          style={{
            fontSize:
              mobile
                ? 24
                : 30,

            fontWeight:800,

            marginTop:6,

            color:"#0f172a",

            lineHeight:1,
          }}
        >
          {item.value}
        </div>

      </div>

      {/* RIGHT */}
      <div
        style={{
          width:46,
          height:46,

          borderRadius:16,

          background:item.bg,

          display:"flex",

          alignItems:"center",

          justifyContent:
            "center",

          fontSize:20,
        }}
      >
        {item.icon}
      </div>

    </div>

  ))}

</div>
{/* Recent Properties */}
<div
  style={{
    ...card,
    marginBottom:24,
    overflow:"hidden",
  }}
>

  {/* Header */}
  <div
    style={{
      padding:20,
      borderBottom:
        "1px solid #e2e8f0",
      fontWeight:700,
      fontSize:16,
    }}
  >
    Recent Properties
  </div>

  {/* Table */}
  <div
    style={{
      overflowX:"auto",
    }}
  >

    <div
      style={{
        minWidth:700,
      }}
    >

      {/* Header Row */}
      <div
        style={{
          display:"grid",

          gridTemplateColumns:
            "2fr 1fr 1fr 1fr 1fr auto",

          padding:"16px 24px",

          background:"#f8fafc",

          fontSize:12,

          fontWeight:700,

          color:"#64748b",
        }}
      >
        <div>Property</div>

        <div>Owner</div>

        <div>Price</div>

        <div>Status</div>

        <div>Date</div>

        <div>Actions</div>
      </div>

      {/* Rows */}
      {

       properties

  .slice(0,5)

  .map(

    (

      property:any,

      index:number

    ) => (

            <div

              key={property._id || property.id || index}

              style={{

                display:"grid",

                gridTemplateColumns:
                  "2fr 1fr 1fr 1fr 1fr auto",

                padding:"18px 24px",

                borderTop:
                  "1px solid #f1f5f9",

                alignItems:"center",

              }}

            >

              <div
                style={{
                  fontWeight:600,
                }}
              >
                {
                  property.title
                }
              </div>

            <div>

  <div
    style={{
      fontWeight:600
    }}
  >
    {
      property.agentName || "-"
    }
  </div>

  <div
    style={{

      fontSize:11,

      color:"#64748b",

      marginTop:4

    }}
  >

    {

      property.postedBy || "Owner"

    }

  </div>

</div>

   <div>
              ₹
{
  Number(
    property.price || 0
  ).toLocaleString("en-IN")
}
              </div>

              <div>

                <span
                  style={{

                    padding:
                      "6px 12px",

                    borderRadius:999,

                    fontSize:11,

                    fontWeight:700,

                    background:

                      property.approvalStatus ===
                      "approved"

                      ?

                      "#dcfce7"

                      :

                      property.approvalStatus ===
                      "rejected"

                      ?

                      "#fee2e2"

                      :

                      "#fef9c3",

                    color:

                      property.approvalStatus ===
                      "approved"

                      ?

                      "#166534"

                      :

                      property.approvalStatus ===
                      "rejected"

                      ?

                      "#991b1b"

                      :

                      "#854d0e",

                  }}
                >
                  {
                    property.approvalStatus
                  }
                </span>

              </div>

              <div>
                {
                  new Date(

                    property.createdAt

                  ).toLocaleDateString()
                }
              </div>

              <div
                style={{
                  display:"flex",
                  gap:10,
                }}
              >
<button

  onClick={() =>

    window.location.href =

      `/x-admin/properties/${property._id}`

  }

  style={{

    border:"none",

    background:"none",

    cursor:"pointer",

  }}

>

  👁

</button>

               <button

  onClick={()=>

    updatePropertyStatus(

      property._id,

      "approved"

    )

  }

  style={{
    border:"none",
    background:"none",
    cursor:"pointer",
  }}
>

  ✔

</button>

               <button

  onClick={()=>

    updatePropertyStatus(

      property._id,

      "rejected"

    )

  }

  style={{
    border:"none",
    background:"none",
    cursor:"pointer",
  }}
>

  ✖

</button>

              </div>

            </div>

          )

        )

      }

    </div>

  </div>

</div>
{/* RECENT LEADS */}
<div
  style={{
    ...card,

    overflow:"hidden",

    borderRadius:24,
  }}
>

  {/* HEADER */}
  <div
    style={{
      padding:"18px 20px",

      borderBottom:
        "1px solid #e2e8f0",

      display:"flex",

      justifyContent:
        "space-between",

      alignItems:"center",
    }}
  >

    <div>

      <div
        style={{
          fontSize:16,
          fontWeight:700,
        }}
      >
        Recent Leads
      </div>

      <div
        style={{
          fontSize:12,
          color:"#64748b",
          marginTop:4,
        }}
      >
        Latest customer enquiries
      </div>

    </div>

    {/* SEARCH */}
    <div
      style={{
        display:"flex",

        alignItems:"center",

        gap:8,

        padding:"8px 12px",

        border:
          "1px solid #e2e8f0",

        borderRadius:12,

        background:"#fff",
      }}
    >

      <Search size={14}/>

      <input
        value={query}

        onChange={(e)=>
          setQuery(
            e.target.value
          )
        }

        placeholder="Search"

        style={{
          border:"none",
          outline:"none",
          background:"none",
          width:120,
          fontSize:13,
        }}
      />

    </div>

  </div>

  {/* LIST */}
  {

    paginated
      .slice(0,5)
      .map((lead:any,index:number)=>(

        <div
          key={
            lead._id
            ||
            lead.id
            ||
            index
          }

          style={{
            display:"flex",

            justifyContent:
              "space-between",

            alignItems:"center",

            padding:"14px 20px",

            borderTop:
              "1px solid #f1f5f9",

            background:

              !lead.isViewed

              ?

              "#eff6ff"

              :

              "#fff",
          }}
        >

          {/* LEFT */}
          <div
            style={{
              display:"flex",
              alignItems:"center",
              gap:12,
            }}
          >

            {/* AVATAR */}
            <div
              style={{
                width:42,
                height:42,

                borderRadius:"50%",

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

                display:"flex",

                alignItems:"center",

                justifyContent:
                  "center",

                fontWeight:700,

                fontSize:14,
              }}
            >
              {
                lead.name?.charAt(0)
              }
            </div>

            {/* INFO */}
            <div>

              <div
                style={{
                  fontWeight:700,
                  fontSize:14,
                }}
              >
                {lead.name}
              </div>

              <div
                style={{
                  fontSize:12,
                  color:"#64748b",
                  marginTop:4,
                }}
              >
                {
                  lead.contact
                  ||
                  "No Contact"
                }
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div
            style={{
              display:"flex",
              alignItems:"center",
              gap:10,
            }}
          >

            {/* STATUS */}
            <span
              style={{
                background:

                  !lead.isViewed

                  ?

                  "#dbeafe"

                  :

                  "#dcfce7",

                color:

                  !lead.isViewed

                  ?

                  "#1d4ed8"

                  :

                  "#166534",

                padding:"5px 10px",

                borderRadius:999,

                fontSize:11,

                fontWeight:700,
              }}
            >
              {

                !lead.isViewed

                ?

                "New"

                :

                "Viewed"

              }
            </span>

            {/* ACTIONS */}
            <div
              style={{
                display:"flex",
                gap:6,
              }}
            >

              <button

                onClick={()=>
                  openLead(
                    lead
                  )
                }

                style={{
                  width:34,
                  height:34,

                  border:"none",

                  borderRadius:10,

                  background:"#eff6ff",

                  cursor:"pointer",
                }}
              >
                <Eye
                  size={14}
                  color="#2563eb"
                />
              </button>

              <button
                style={{
                  width:34,
                  height:34,

                  border:"none",

                  borderRadius:10,

                  background:"#f8fafc",

                  cursor:"pointer",
                }}
              >
                <Pencil
                  size={14}
                  color="#64748b"
                />
              </button>

              <button
                style={{
                  width:34,
                  height:34,

                  border:"none",

                  borderRadius:10,

                  background:"#fef2f2",

                  cursor:"pointer",
                }}
              >
                <Trash2
                  size={14}
                  color="#dc2626"
                />
              </button>

            </div>

          </div>

        </div>

      ))

  }

  {/* PAGINATION */}
  <div
    style={{
      padding:16,

      borderTop:
        "1px solid #e2e8f0",

      display:"flex",

      justifyContent:
        "flex-end",

      alignItems:"center",

      gap:10,
    }}
  >

    <button

      onClick={()=>

        setPage((p)=>

          Math.max(
            1,
            p - 1
          )

        )

      }

      style={{
        border:"none",
        background:"none",
        cursor:"pointer",
      }}
    >
      <ChevronLeft size={16}/>
    </button>

    <div
      style={{
        fontWeight:600,
      }}
    >
      {page}/{totalPages}
    </div>

    <button

      onClick={()=>

        setPage((p)=>

          Math.min(
            totalPages,
            p + 1
          )

        )

      }

      style={{
        border:"none",
        background:"none",
        cursor:"pointer",
      }}
    >
      <ChevronRight size={16}/>
    </button>

  </div>

</div>
        

{/* Charts */}
<div
  style={{
    display:"grid",

    gridTemplateColumns:

      mobile

        ? "1fr"

        : "1fr 1fr",

    gap:24,

    marginBottom:24,
  }}
>

  {/* Pie Chart */}
  <div
    style={{
      ...card,
      height:350,
    }}
  >

    <div
      style={{
        fontSize:16,
        fontWeight:700,
        marginBottom:20,
      }}
    >
      Property Types
    </div>

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <PieChart>

        <Pie

          data={
            propertyTypeData
          }

          cx="50%"

          cy="50%"

          outerRadius={100}

          dataKey="value"

          label

        >

          {

           propertyTypeData.map(

  (
    entry,
    index
  ) => (

    <Cell

      key={`chart-${index}`}

  fill={
    COLORS[
      index %
      COLORS.length
    ]
  }

/>

              )

            )

          }

        </Pie>

      </PieChart>

    </ResponsiveContainer>

  </div>

  {/* Trend Chart */}
  <div
    style={{
      ...card,
      height:350,
    }}
  >

    <div
      style={{
        fontSize:16,
        fontWeight:700,
        marginBottom:20,
      }}
    >
      Property Posting Trend
    </div>

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      <LineChart
        data={trendData}
      >

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="day"
        />

        <YAxis />

        <Tooltip />

        <Line

          type="monotone"

          dataKey="properties"

          stroke="#16a34a"

          strokeWidth={3}

        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>

       
    </div>

</div>

);
}