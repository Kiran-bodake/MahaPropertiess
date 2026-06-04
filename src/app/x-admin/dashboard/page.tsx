"use client";
import PropertyInquiryModule from "@/components/admin/inquiries/PropertyInquiryModule";
import { useEffect, useState } from "react";
import {
  Home,
  Users,
  TrendingUp,
  ListChecks,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { StatCard } from "@/components/admin/cards/StatCard";
import { ChartCard } from "@/components/admin/cards/ChartCard";
import { DataTableCard } from "@/components/admin/cards/DataTableCard";
import { TableHeader } from "@/components/admin/table/TableHeader";
import { Badge } from "@/components/admin/common/Badge";
import { SearchBar } from "@/components/admin/common/SearchBar";
import { ActionButtons } from "@/components/admin/common/ActionButtons";
import { Pagination } from "@/components/admin/common/Pagination";




// Chart Data



const COLORS = ["#3b82f6", "#10b981", "#a855f7", "#f59e0b"];


export default function AdminDashboard() {
 const [stats, setStats] = useState({
  totalInquiries: 0,
  newInquiries: 0,
  totalProperties: 0,
  totalDeals: 0,

  // NEW
  inquiriesGrowth: 0,
  propertiesGrowth: 0,
  dealsGrowth: 0,
});
  const [propertyInquiries, setPropertyInquiries] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [propertyTypeData, setPropertyTypeData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [propertyPage, setPropertyPage] = useState(1);
  const [propertyQuery, setPropertyQuery] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");
 const [analytics, setAnalytics] = useState({
  activeProperties: 0,
  featuredProperties: 0,
  verifiedProperties: 0,
  saleProperties: 0,
});
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const perPage = 10;

  // Fetch dashboard data with SSE for real-time updates
  useEffect(() => {
    let eventSource: EventSource | null = null;

    // Fetch other data (inquiries, properties, analytics)
    const fetchOtherData = async () => {
      try {
        const responses = await Promise.allSettled([
          fetch("/api/property-inquiry").catch(() => null),
          fetch("/api/admin/recent-properties").catch(() => null),
          fetch("/api/admin/analytics/leads").catch(() => null),
        ]);

        let inquiriesData: any = { inquiries: [] };
        let propsData: any = { properties: [] };
        let analyticsData: any = {};

        if (responses[0].status === "fulfilled" && responses[0].value?.ok) {
          inquiriesData = await responses[0].value.json().catch(() => []);
        }

        if (responses[1].status === "fulfilled" && responses[1].value?.ok) {
          propsData = await responses[1].value.json().catch(() => ({ properties: [] }));
        }

        if (responses[2].status === "fulfilled" && responses[2].value?.ok) {
          analyticsData = await responses[2].value.json().catch(() => ({}));
        }

        setPropertyInquiries(inquiriesData?.inquiries || []);
        setProperties(Array.isArray(propsData?.properties) ? propsData.properties : []);
        
        setStats(prev => ({
          ...prev,
          newInquiries: analyticsData?.newLeads || 0,
        }));
      } catch (error) {
        console.error("Failed to fetch other data:", error);
      }
    };

    // Connect to SSE for real-time dashboard data
    const connectSSE = () => {
      eventSource = new EventSource("/api/admin/dashboard/stream");

     eventSource.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    console.log("SSE:", data);

    if (data.type === "connected") return;
    if (data.heartbeat) return;

   if (data.success) {
  const current = data.currentPeriod;
  const previous = data.previousPeriod;

  const calcGrowth = (curr: number, prev: number) => {
    if (!prev) return 100;
    return Math.round(((curr - prev) / prev) * 100);
  };

  setStats((prev) => ({
    ...prev,
    totalInquiries: data.inquiriesCount ?? 0,
    totalProperties: data.propertiesCount ?? 0,
    totalDeals: data.dealsCount ?? 0,

    // NEW → 7-day based values (optional but better)
    newInquiries: current?.inquiries ?? 0,

    // 🔥 GROWTH VALUES (NEW)
    inquiriesGrowth: calcGrowth(current?.inquiries, previous?.inquiries),
    propertiesGrowth: calcGrowth(current?.properties, previous?.properties),
    dealsGrowth: calcGrowth(current?.deals, previous?.deals),
  }));

  setTrendData(data.chartData || []);
  setPropertyTypeData(data.propertyTypeData || []);

  setAnalytics({
    activeProperties: data.activeProperties ?? 0,
    featuredProperties: data.featuredProperties ?? 0,
    verifiedProperties: data.verifiedProperties ?? 0,
    saleProperties: data.saleProperties ?? 0,
  });

  setLoading(false);
}
  } catch (error) {
    console.error("Error parsing SSE data:", error);
  }
};

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        if (eventSource) {
          eventSource.close();
        }
        // Reconnect after 5 seconds
        setTimeout(connectSSE, 5000);
      };
    };

    // Initial fetch
    fetchOtherData();
    connectSSE();

    // Cleanup
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);



  // Filter and paginate property inquiries
  const filteredInquiries = propertyInquiries.filter(
    (inquiry) =>
      !query || 
      inquiry.customerName?.toLowerCase().includes(query.toLowerCase()) ||
      inquiry.name?.toLowerCase().includes(query.toLowerCase()) ||
      inquiry.propertyName?.toLowerCase().includes(query.toLowerCase()) ||
      inquiry.propertyTitle?.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredInquiries.length / perPage)
  );
  const paginatedInquiries = filteredInquiries.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Update inquiry status
  const handleUpdateInquiryStatus = async (inquiryId: string, status: string) => {
    if (!inquiryId || !status) return;
    try {
      const response = await fetch(`/api/property-inquiry/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setPropertyInquiries((prev) =>
          prev.map((inquiry) =>
            inquiry._id === inquiryId ? { ...inquiry, status } : inquiry
          )
        );
      }
    } catch (error) {
      console.error("Failed to update inquiry status:", error);
    }
  };

  // Delete inquiry
 const handleDeleteInquiry = async (inquiryId: string) => {
  if (!confirm("Are you sure you want to delete this inquiry?")) return;

  try {
    const response = await fetch("/api/property-inquiry", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: inquiryId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    setPropertyInquiries((prev) =>
      prev.filter((inquiry) => inquiry._id !== inquiryId)
    );

    setDeleteMessage("Inquiry deleted successfully");
    setTimeout(() => setDeleteMessage(null), 3000);
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
  }
};

  // Update property status
  const handlePropertyStatus = async (propertyId: string, status: string) => {
    if (!propertyId || !status) return;
    try {
      const response = await fetch("/api/admin/properties/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: propertyId, status }),
      });

      if (response.ok) {
        setProperties((prev) =>
          prev.map((prop) =>
            prop._id === propertyId
              ? { ...prop, approvalStatus: status }
              : prop
          )
        );
      }
    } catch (error) {
      console.error("Failed to update property status:", error);
    }
  };

  // Delete property
  const handleDeleteProperty = async (propertyId: string) => {
    if (!propertyId || !confirm("Are you sure you want to delete this property?")) return;
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setProperties((prev) =>
          prev.filter((prop) => prop._id !== propertyId)
        );
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  // Toggle property featured status
  const handleToggleFeatured = async (propertyId: string, isFeatured: boolean) => {
    if (!propertyId) return;
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}/featured`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (response.ok) {
        setProperties((prev) =>
          prev.map((prop) =>
            prop._id === propertyId
              ? { ...prop, isFeatured: !isFeatured }
              : prop
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error);
    }
  };

  // Filter properties
  const filteredProperties = properties
    .filter((prop) => {
      if (propertyFilter === "approved") return prop.approvalStatus === "approved";
      if (propertyFilter === "pending") return prop.approvalStatus === "pending";
      if (propertyFilter === "rejected") return prop.approvalStatus === "rejected";
      if (propertyFilter === "featured") return prop.isFeatured;
      return true;
    })
    .filter((prop) =>
      !propertyQuery ||
      prop.title?.toLowerCase().includes(propertyQuery.toLowerCase()) ||
      prop.location?.toLowerCase().includes(propertyQuery.toLowerCase())
    );

  const totalPropertyPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / perPage)
  );
  const paginatedProperties = filteredProperties.slice(
    (propertyPage - 1) * perPage,
    propertyPage * perPage
  );

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-blue-500"></div>
            <p className="text-gray-300 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your business overview at a glance."
    >
      {/* KPI Stats Grid */}
   <div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(4,minmax(0,1fr))",

    gap: "18px",

    marginBottom: "16px",
  }}
>
      <StatCard
  label="Total Inquiries"
  value={stats.totalInquiries}
  icon={<Users className="h-7 w-7" />}
  trend={stats.inquiriesGrowth}
  color="blue"
/>

<StatCard
  label="New Inquiries"
  value={stats.newInquiries}
  icon={<TrendingUp className="h-6 w-6" />}
  trend={stats.inquiriesGrowth}
  color="green"
/>
        <StatCard
  label="Properties"
  value={stats.totalProperties}
  icon={<Home className="h-6 w-6" />}
  trend={stats.propertiesGrowth}
  color="purple"
/>
        <StatCard
  label="Deals"
  value={stats.totalDeals}
  icon={<ListChecks className="h-6 w-6" />}
  trend={stats.dealsGrowth}
  color="orange"
/>
      </div>
{/* Charts Section */}
<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(2,minmax(0,1fr))",

    gap: "16px",

    marginBottom: "20px",
  }}
>

  {/* Line Chart */}
  <ChartCard
    title="Monthly Activity Trend"
    subtitle="Properties & Leads performance over time"
  >
    <ResponsiveContainer
      width="100%"
      height={190}
    >
      <LineChart
        data={trendData}
        margin={{
          top: 5,
          right: 10,
          left: -15,
          bottom: 0,
        }}
      >

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          stroke="#94a3b8"
          tick={{
            fill: "#94a3b8",
            fontSize: 11,
          }}

          axisLine={false}
          tickLine={false}
        />

        <YAxis
          stroke="#94a3b8"
          tick={{
            fill: "#94a3b8",
            fontSize: 11,
          }}

          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",

            border:
              "1px solid #e2e8f0",

            borderRadius: "14px",

            boxShadow:
              "0 8px 24px rgba(15,23,42,.08)",
          }}
        />

        <Legend
          wrapperStyle={{
            paddingTop: "10px",

            fontSize: "12px",
          }}
        />

        <Line
          type="monotone"
          dataKey="properties"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
          name="Properties"
        />

        <Line
          type="monotone"
        dataKey="inquiries"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
          name="Leads"
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>

  {/* Pie Chart */}
  <ChartCard
    title="Property Type Distribution"
    subtitle="Breakdown of your listings"
  >
    <ResponsiveContainer
      width="100%"
      height={210}
    >
      <PieChart>

        <Pie
          data={propertyTypeData}
          cx="50%"
          cy="50%"

          labelLine={false}

          label={({ name, value }) =>
            `${name}: ${value}`
          }

          outerRadius={68}

          dataKey="value"
        >

          {propertyTypeData.map(
            (entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  COLORS[
                    index %
                      COLORS.length
                  ]
                }
              />
            )
          )}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",

            border:
              "1px solid #e2e8f0",

            borderRadius: "14px",

            boxShadow:
              "0 8px 24px rgba(15,23,42,.08)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </ChartCard>
</div>

{/* Tables Section */}
<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "2fr 1fr",

    gap: "16px",

    marginBottom: "20px",

    alignItems: "start",
  }}
>

  {/* Recent Properties */}
  <div
    style={{
      gridColumn: "span 1",
    }}
  >

    <DataTableCard
  title="Recent Properties"
  subtitle={`${properties.slice(0, 5).length} latest property listings`}
>
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <TableHeader
      columns={[
        { key: "property", label: "Property" },
        { key: "owner", label: "Owner" },
        { key: "price", label: "Price" },
        { key: "status", label: "Status" },
        { key: "actions", label: "Actions" },
      ]}
    />

    <tbody style={{ borderTop: "1px solid #f1f5f9" }}>
      {properties.slice(0, 5).length > 0 ? (
        properties.slice(0, 5).map((property, idx) => (
          <tr
            key={property._id || idx}
            style={{
              borderBottom: "1px solid #f1f5f9",
              background: "#ffffff",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#f8fafc")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#ffffff")
            }
          >
            {/* PROPERTY (with thumbnail) */}
            <td style={{ padding: "14px 16px", minWidth: "220px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Thumbnail */}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#e2e8f0",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    color: "#94a3b8",
                  }}
                >
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "🏠"
                  )}
                </div>

                {/* Title & Location */}
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0f172a",
                      marginBottom: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                    }}
                  >
                    {property.title}
                  </div>
                  {property.location && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      📍 {property.location}
                    </div>
                  )}
                </div>
              </div>
            </td>

            {/* OWNER */}
            <td
              style={{
                padding: "14px 16px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              {property.agentName || "—"}
            </td>

            {/* PRICE */}
            <td
              style={{
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              ₹{Number(property.price || 0).toLocaleString("en-IN")}
            </td>

            {/* STATUS */}
            <td style={{ padding: "14px 16px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  textTransform: "capitalize",
                  background:
                    property.approvalStatus === "approved"
                      ? "#ecfdf5"
                      : property.approvalStatus === "rejected"
                      ? "#fef2f2"
                      : "#fffbeb",
                  border: `1px solid ${
                    property.approvalStatus === "approved"
                      ? "#bbf7d0"
                      : property.approvalStatus === "rejected"
                      ? "#fecaca"
                      : "#fde68a"
                  }`,
                  color:
                    property.approvalStatus === "approved"
                      ? "#15803d"
                      : property.approvalStatus === "rejected"
                      ? "#dc2626"
                      : "#b45309",
                }}
              >
                {/* Status dot */}
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor:
                      property.approvalStatus === "approved"
                        ? "#22c55e"
                        : property.approvalStatus === "rejected"
                        ? "#ef4444"
                        : "#f59e0b",
                    boxShadow: `0 0 0 2px ${
                      property.approvalStatus === "approved"
                        ? "rgba(34,197,94,0.2)"
                        : property.approvalStatus === "rejected"
                        ? "rgba(239,68,68,0.2)"
                        : "rgba(245,158,11,0.2)"
                    }`,
                  }}
                />
                {property.approvalStatus || "pending"}
              </span>
            </td>

            {/* ACTIONS */}
            <td style={{ padding: "14px 16px", minWidth: "160px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {/* View button */}
                <button
                  onClick={() =>
                    (window.location.href = `/x-admin/properties/${property._id}`)
                  }
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    background: "#ffffff",
                    color: "#334155",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View
                </button>

               

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteProperty(property._id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                    background: "#ffffff",
                    color: "#dc2626",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fef2f2";
                    e.currentTarget.style.borderColor = "#fca5a5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.borderColor = "#fecaca";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div style={{ fontSize: "48px", opacity: 0.8 }}>🏘️</div>
              <p
                style={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "16px",
                  margin: 0,
                }}
              >
                No properties yet
              </p>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                  margin: 0,
                }}
              >
                Properties you add will appear here.
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</DataTableCard>
  </div>
        {/* Quick Stats Sidebar */}
        {/* Quick Stats Sidebar */}
{/* Quick Stats Sidebar */}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  }}
>
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "20px",
      padding: "16px",
      boxShadow: "0 4px 14px rgba(15,23,42,0.04)",
      minHeight: "auto",
      transition: "all .25s ease",
    }}
  >
    {/* Title */}
    <h3
      style={{
        fontSize: "18px",
        fontWeight: 800,
        color: "#111827",
        marginTop: 0,
        marginBottom: "14px",
        letterSpacing: "-0.02em",
      }}
    >
      Property Status
    </h3>

    {/* Status Wrapper */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Active */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: "14px",
          background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
          border: "1px solid #fde68a",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#b45309",
          }}
        >
          Active
        </span>

        <span
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#d97706",
          }}
        >
          {analytics?.activeProperties || 0}
        </span>
      </div>

      {/* Featured */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: "14px",
          background: "linear-gradient(135deg,#ecfdf5,#dcfce7)",
          border: "1px solid #bbf7d0",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#15803d",
          }}
        >
          Featured
        </span>

        <span
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#16a34a",
          }}
        >
          {analytics?.featuredProperties || 0}
        </span>
      </div>

      {/* Verified */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: "14px",
          background: "linear-gradient(135deg,#fef2f2,#fee2e2)",
          border: "1px solid #fecaca",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#dc2626",
          }}
        >
          Verified
        </span>

        <span
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#dc2626",
          }}
        >
          {analytics?.verifiedProperties || 0}
        </span>
      </div>

      {/* For Sale */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: "14px",
          background: "linear-gradient(135deg,#faf5ff,#f3e8ff)",
          border: "1px solid #e9d5ff",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#7c3aed",
          }}
        >
           Zero Brokerage
        </span>

        <span
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#9333ea",
          }}
        >
          {analytics?.saleProperties || 0}
        </span>
      </div>
    </div>
  </div>
</div>
      </div>

{/* Property Inquiries Table */}
{deleteMessage && (
  <div
    style={{
      marginBottom: "16px",
      padding: "14px 18px",
      borderRadius: "14px",
      background: "#ecfdf5",
      color: "#166534",
      border: "1px solid #bbf7d0",
      fontWeight: 600,
    }}
  >
    {deleteMessage}
  </div>
)}
<PropertyInquiryModule />

{/* Property Management Section */}
<div style={{ marginTop: "32px" }}>
 
</div>

</DashboardLayout>
  );
}