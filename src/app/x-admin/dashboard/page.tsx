"use client";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Deal from "@/models/Deal";
import Task from "@/models/Task";
import Property from "@/models/Property";
import { requireAdminUser } from "@/lib/admin-auth";

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
    totalLeads: 0,
    newLeads: 0,
    totalProperties: 0,
    totalDeals: 0,
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
  const [analytics, setAnalytics] = useState<any>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const perPage = 10;

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.allSettled([
          fetch("/api/admin/dashboard").catch(() => null),
          fetch("/api/property-inquiry").catch(() => null),
          fetch("/api/admin/recent-properties").catch(() => null),
          fetch("/api/admin/analytics/leads").catch(() => null),
        ]);

        let dashData: any = {};
        let inquiriesData: any = { inquiries: [] };
        let propsData: any = { properties: [] };
        let analyticsData: any = {};

        // Process dashboard response
        if (responses[0].status === "fulfilled" && responses[0].value?.ok) {
          dashData = await responses[0].value.json().catch(() => ({}));
          console.log("Dashboard API:", dashData);
console.log("Analytics State:", analytics);
        }

        // Process property inquiries response
        if (responses[1].status === "fulfilled" && responses[1].value?.ok) {
          inquiriesData = await responses[1].value.json().catch(() => []);
        }

        // Process properties response
        if (responses[2].status === "fulfilled" && responses[2].value?.ok) {
          propsData = await responses[2].value.json().catch(() => ({ properties: [] }));
        }

        // Process analytics response
        if (responses[3].status === "fulfilled" && responses[3].value?.ok) {
          analyticsData = await responses[3].value.json().catch(() => ({}));
        }

        setStats({
          totalLeads: dashData?.leadsCount || 0,
          newLeads: analyticsData?.newLeads || 0,
          totalProperties: dashData?.propertiesCount || 0,
          totalDeals: dashData?.dealsCount || 0,
        });
setTrendData(
  dashData?.chartData || []
);
setPropertyTypeData(
  dashData?.propertyTypeData || []
);
      setPropertyInquiries(inquiriesData?.inquiries || []);
        setProperties(Array.isArray(propsData?.properties) ? propsData.properties : []);
        setAnalytics(dashData || {});
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Set default values on error
        setStats({
          totalLeads: 0,
          newLeads: 0,
          totalProperties: 0,
          totalDeals: 0,
        });
        setPropertyInquiries([]);
        setProperties([]);
        setAnalytics({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          label="Total Leads"
          value={stats.totalLeads}
          icon={<Users className="h-7 w-7" />}
          trend={12}
          color="blue"
        />
        <StatCard
          label="New Leads"
          value={stats.newLeads}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={8}
          color="green"
        />
        <StatCard
          label="Properties"
          value={stats.totalProperties}
          icon={<Home className="h-6 w-6" />}
          trend={15}
          color="purple"
        />
        <StatCard
          label="Deals"
          value={stats.totalDeals}
          icon={<ListChecks className="h-6 w-6" />}
          trend={-3}
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
          dataKey="leads"
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

      <table
        style={{
          width: "100%",

          borderCollapse:
            "collapse",
        }}
      >

        <TableHeader
          columns={[
            {
              key: "property",
              label: "Property",
            },

            {
              key: "owner",
              label: "Owner",
            },

            {
              key: "price",
              label: "Price",
            },

            {
              key: "status",
              label: "Status",
            },

            {
              key: "actions",
              label: "Actions",
            },
          ]}
        />

        <tbody
          style={{
            borderTop:
              "1px solid #f1f5f9",
          }}
        >

          {properties.slice(0, 5)
            .length > 0 ? (

            properties
              .slice(0, 5)
              .map(
                (
                  property,
                  idx
                ) => (

                  <tr
                    key={
                      property._id ||
                      idx
                    }

                    style={{
                      borderBottom:
                        "1px solid #f1f5f9",

                      background:
                        "#ffffff",
                    }}
                  >

                    {/* Property */}
                    <td
                      style={{
                        padding:
                          "12px 16px",

                        fontSize:
                          "13px",

                        fontWeight:
                          700,

                        color:
                          "#111827",
                      }}
                    >
                      {property.title}
                    </td>

                    {/* Owner */}
                    <td
                      style={{
                        padding:
                          "12px 16px",

                        fontSize:
                          "13px",

                        fontWeight:
                          500,

                        color:
                          "#6b7280",
                      }}
                    >
                      {property.agentName ||
                        "-"}
                    </td>

                    {/* Price */}
                    <td
                      style={{
                        padding:
                          "12px 16px",

                        fontSize:
                          "13px",

                        fontWeight:
                          700,

                        color:
                          "#111827",
                      }}
                    >
                      ₹
                      {Number(
                        property.price ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                   {/* Status */}
<td
  style={{
    padding: "12px 16px",
  }}
>
  <div
    style={{
      display: "inline-flex",

      alignItems: "center",

      gap: "8px",

      padding: "7px 12px",

      borderRadius: "999px",

      background:
        property.approvalStatus ===
        "approved"
          ? "#ecfdf5"
          : property.approvalStatus ===
              "rejected"
            ? "#fef2f2"
            : "#fffbeb",

      border:
        property.approvalStatus ===
        "approved"
          ? "1px solid #bbf7d0"
          : property.approvalStatus ===
              "rejected"
            ? "1px solid #fecaca"
            : "1px solid #fde68a",

      transition: "all .25s ease",
    }}
  >

    {/* Status Dot */}
    <div
      style={{
        width: "8px",

        height: "8px",

        borderRadius: "999px",

        background:
          property.approvalStatus ===
          "approved"
            ? "#22c55e"
            : property.approvalStatus ===
                "rejected"
              ? "#ef4444"
              : "#f59e0b",

        boxShadow:
          property.approvalStatus ===
          "approved"
            ? "0 0 0 3px rgba(34,197,94,.15)"
            : property.approvalStatus ===
                "rejected"
              ? "0 0 0 3px rgba(239,68,68,.15)"
              : "0 0 0 3px rgba(245,158,11,.15)",
      }}
    />

    {/* Label */}
    <span
      style={{
        fontSize: "12px",

        fontWeight: 700,

        letterSpacing: "-0.01em",

        color:
          property.approvalStatus ===
          "approved"
            ? "#15803d"
            : property.approvalStatus ===
                "rejected"
              ? "#dc2626"
              : "#b45309",

        textTransform: "capitalize",
      }}
    >
      {property.approvalStatus ||
        "pending"}
    </span>
  </div>
</td>

                    {/* Actions */}
                    <td
                      style={{
                        padding:
                          "12px 16px",

                        minWidth:
                          "140px",
                      }}
                    >
                      <ActionButtons
                        onView={() =>
                          (window.location.href =
                            `/x-admin/properties/${property._id}`)
                        }

                        onEdit={() =>
                          (window.location.href =
                            `/x-admin/properties/${property._id}/edit`)
                        }

                        onDelete={() =>
                          handlePropertyStatus(
                            property._id,
                            "rejected"
                          )
                        }

                        size="sm"
                      />
                    </td>
                  </tr>
                )
              )
          ) : (

            <tr>
              <td
                colSpan={5}

                style={{
                  padding:
                    "40px 20px",

                  textAlign:
                    "center",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    flexDirection:
                      "column",

                    alignItems:
                      "center",

                    gap: "12px",
                  }}
                >

                  <div
                    style={{
                      fontSize:
                        "38px",
                    }}
                  >
                    📦
                  </div>

                  <p
                    style={{
                      color:
                        "#6b7280",

                      fontWeight:
                        700,

                      fontSize:
                        "14px",

                      margin: 0,
                    }}
                  >
                    No properties yet
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
          For Sale
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
<DataTableCard
  title="Property Inquiries"
  subtitle="Manage customer property inquiry requests"

  action={
    <div
      style={{
        width: "100%",
        maxWidth: "340px",
      }}
    >
      <SearchBar
        placeholder="Search by name, contact, or property..."
        value={query}
        onChange={setQuery}
      />
    </div>
  }

  footer={
    paginatedInquiries.length > 0 && (
      <div
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: "24px",

          flexWrap: "wrap",
        }}
      >

        {/* Footer Text */}
        <div
          style={{
            fontSize: "14px",

            fontWeight: 600,

            color: "#6b7280",
          }}
        >
          Showing{" "}

          <span
            style={{
              fontWeight: 800,

              color: "#111827",
            }}
          >
            {paginatedInquiries.length}
          </span>

          {" "}of{" "}

          <span
            style={{
              fontWeight: 800,

              color: "#111827",
            }}
          >
            {filteredInquiries.length}
          </span>

          {" "}inquiries
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    )
  }
>

  <table
    style={{
      width: "100%",

      borderCollapse: "collapse",
    }}
  >

    {/* Table Header */}
    <TableHeader
      columns={[
        { key: "property", label: "Property" },
        { key: "customer", label: "Customer Name" },
        { key: "contact", label: "Contact" },
        { key: "status", label: "Status" },
        { key: "date", label: "Date" },
        { key: "actions", label: "Actions" },
      ]}
    />

    {/* Table Body */}
    <tbody
      style={{
        borderTop:
          "1px solid #f1f5f9",
      }}
    >

      {paginatedInquiries.length > 0 ? (

        paginatedInquiries.map((inquiry, idx) => {
          const statusConfig = {
            new: { bg: "#ecfdf5", border: "#bbf7d0", dot: "#22c55e", text: "#15803d", label: "New" },
            contacted: { bg: "#dbeafe", border: "#bfdbfe", dot: "#3b82f6", text: "#1e40af", label: "Contacted" },
            interested: { bg: "#ecfdf5", border: "#d1fae5", dot: "#16a34a", text: "#166534", label: "Interested" },
            "site-visit": { bg: "#fce7f3", border: "#fbcfe8", dot: "#be185d", text: "#831843", label: "Site Visit" },
            negotiation: { bg: "#ede9fe", border: "#ddd6fe", dot: "#7c3aed", text: "#5b21b6", label: "Negotiation" },
            closed: { bg: "#f3f4f6", border: "#e5e7eb", dot: "#9ca3af", text: "#6b7280", label: "Closed" },
          };
          const config =
            statusConfig[inquiry.status as keyof typeof statusConfig] ||
            statusConfig.new;
          const phoneNumber = inquiry.phone || inquiry.mobileNumber || "";

          return (
          <tr
            key={inquiry._id || idx}

            style={{
              background:
                inquiry.status === "new"
                  ? "#eff6ff"
                  : "#ffffff",

              borderBottom:
                "1px solid #f1f5f9",

              transition:
                "all .25s ease",
            }}
          >

            {/* Property */}
            <td
              style={{
                padding: "20px 24px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#4b5563",
              }}
            >
              {inquiry.propertyTitle || inquiry.propertyName || "-"}
            </td>

            {/* Customer Name */}
            <td
              style={{
                padding: "20px 24px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {inquiry.customerName || inquiry.name || "-"}
            </td>

            {/* Contact */}
            <td
              style={{
                padding: "20px 24px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#6b7280",
              }}
            >
              {inquiry.phone || inquiry.mobileNumber || inquiry.email || "-"}
            </td>

            {/* Status */}
            <td
              style={{
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  cursor: "pointer",
                  transition: "all .25s ease",
                }}
                onClick={() => {
                  const statuses = [
                    "new",
                    "contacted",
                    "interested",
                    "site-visit",
                    "negotiation",
                    "closed",
                  ];
                  const currentIndex = statuses.indexOf(inquiry.status || "new");
                  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                  handleUpdateInquiryStatus(inquiry._id, nextStatus);
                }}
              >
                {/* Status Dot */}
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: config.dot,
                    boxShadow: `0 0 0 3px ${config.dot}20`,
                  }}
                />

                {/* Label */}
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: config.text,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {config.label}
                </span>
              </div>
            </td>

            {/* Date */}
            <td
              style={{
                padding: "20px 24px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#6b7280",
              }}
            >
              {inquiry.createdAt
                ? new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-"}
            </td>

            {/* Actions */}
            <td
              style={{
                padding: "20px 24px",
                minWidth: "160px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  onClick={() => {
                    const phoneNumber = inquiry.phone || inquiry.mobileNumber || "";
                    if (!phoneNumber) return;
                    window.location.href = `tel:${phoneNumber.replace(/\D/g, "")}`;
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    color: "#3b82f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: phoneNumber ? "pointer" : "not-allowed",
                    opacity: phoneNumber ? 1 : 0.6,
                    transition: "all .2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#3b82f6";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.color = "#3b82f6";
                  }}
                >
                  Contact
                </button>
                <button
                  onClick={() => window.location.assign("/x-admin/property-inquiries")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#0f172a";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.color = "#0f172a";
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteInquiry(inquiry._id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    color: "#ef4444",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#ef4444";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );
        })
      ) : (

        <tr>
          <td
            colSpan={6}

            style={{
              padding: "90px 24px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >

              {/* Icon */}
              <div
                style={{
                  fontSize: "64px",
                  opacity: 0.9,
                }}
              >
                📧
              </div>

              {/* Empty Text */}
              <p
                style={{
                  color: "#6b7280",
                  fontWeight: 700,
                  fontSize: "18px",
                  margin: 0,
                }}
              >
                {query
                  ? "No inquiries match your search"
                  : "No property inquiries yet"}
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</DataTableCard>

{/* Property Management Section */}
<div style={{ marginTop: "32px" }}>
 
</div>

</DashboardLayout>
  );
}