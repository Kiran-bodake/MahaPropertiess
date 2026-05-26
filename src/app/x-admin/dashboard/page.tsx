"use client";

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
const propertyTypeData = [
  { name: "Plots", value: 45 },
  { name: "Flats", value: 30 },
  { name: "Villas", value: 15 },
  { name: "Commercial", value: 10 },
];

const trendData = [
  { month: "Jan", properties: 12, leads: 24 },
  { month: "Feb", properties: 18, leads: 13 },
  { month: "Mar", properties: 9, leads: 98 },
  { month: "Apr", properties: 22, leads: 39 },
  { month: "May", properties: 16, leads: 48 },
  { month: "Jun", properties: 28, leads: 38 },
];

const COLORS = ["#3b82f6", "#10b981", "#a855f7", "#f59e0b"];


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalProperties: 0,
    totalDeals: 0,
  });
  const [leads, setLeads] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [analytics, setAnalytics] = useState<any>(null);

  const perPage = 10;

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.allSettled([
          fetch("/api/admin/dashboard").catch(() => null),
          fetch("/api/admin/leads").catch(() => null),
          fetch("/api/admin/recent-properties").catch(() => null),
          fetch("/api/admin/analytics/leads").catch(() => null),
        ]);

        let dashData = {};
        let leadsData = { leads: [] };
        let propsData = { properties: [] };
        let analyticsData = {};

        // Process dashboard response
        if (responses[0].status === "fulfilled" && responses[0].value?.ok) {
          dashData = await responses[0].value.json().catch(() => ({}));
        }

        // Process leads response
        if (responses[1].status === "fulfilled" && responses[1].value?.ok) {
          leadsData = await responses[1].value.json().catch(() => ({ leads: [] }));
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

        setLeads(Array.isArray(leadsData?.leads) ? leadsData.leads : []);
        setProperties(Array.isArray(propsData?.properties) ? propsData.properties : []);
        setAnalytics(analyticsData || {});
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Set default values on error
        setStats({
          totalLeads: 0,
          newLeads: 0,
          totalProperties: 0,
          totalDeals: 0,
        });
        setLeads([]);
        setProperties([]);
        setAnalytics({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and paginate leads
  const filteredLeads = leads.filter(
    (lead) =>
      !query || lead.name?.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / perPage)
  );
  const paginatedLeads = filteredLeads.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Update lead view status
  const handleViewLead = async (leadId: string) => {
    if (!leadId) return;
    try {
      const response = await fetch("/api/admin/leads/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId }),
      });

      if (response.ok) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === leadId ? { ...lead, isViewed: true } : lead
          )
        );
      }
    } catch (error) {
      console.error("Failed to update lead view:", error);
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
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4 mb-10">
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
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 mb-10">
        <ChartCard
          title="Monthly Activity Trend"
          subtitle="Properties & Leads performance over time"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: 12, fontWeight: 500 }}
                tick={{ fill: "#d1d5db" }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: 12, fontWeight: 500 }}
                tick={{ fill: "#d1d5db" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #ffffff30",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="properties"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                name="Properties"
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                name="Leads"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Property Type Distribution"
          subtitle="Breakdown of your property listings by category"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #ffffff30",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tables Section */}
      <div className="mb-10 grid grid-cols-1 gap-7 lg:grid-cols-3">
        {/* Recent Properties */}
        <div className="lg:col-span-2">
          <DataTableCard
            title="Recent Properties"
            subtitle={`${properties.slice(0, 5).length} latest property listings`}
          >
            <table className="w-full">
              <TableHeader
                columns={[
                  { key: "property", label: "Property" },
                  { key: "owner", label: "Owner" },
                  { key: "price", label: "Price" },
                  { key: "status", label: "Status" },
                  { key: "actions", label: "Actions" },
                ]}
              />
              <tbody className="divide-y divide-white/10">
                {properties.slice(0, 5).length > 0 ? (
                  properties.slice(0, 5).map((property, idx) => (
                    <tr
                      key={property._id || idx}
                      className="hover:bg-white/5 transition-all duration-300 group border-b border-white/10"
                    >
                      <td className="px-8 py-6 text-sm font-semibold text-white group-hover:text-white transition-colors">
                        {property.title}
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                        {property.agentName || "-"}
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-white">
                        ₹{Number(property.price || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-8 py-6">
                        <Badge
                          label={property.approvalStatus || "pending"}
                          variant={
                            property.approvalStatus === "approved"
                              ? "success"
                              : property.approvalStatus === "rejected"
                                ? "error"
                                : "warning"
                          }
                          size="sm"
                        />
                      </td>
                      <td className="px-8 py-6 flex-shrink-0">
                        <ActionButtons
                          onView={() =>
                            (window.location.href = `/x-admin/properties/${property._id}`)
                          }
                          onEdit={() =>
                            (window.location.href = `/x-admin/properties/${property._id}/edit`)
                          }
                          onDelete={() =>
                            handlePropertyStatus(property._id, "rejected")
                          }
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-5">
                        <div className="text-6xl text-gray-400">📦</div>
                        <p className="text-gray-300 font-semibold text-lg">No properties yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </DataTableCard>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl p-9 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-white/20 min-h-64">
            <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Property Status</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300">
                <span className="text-base font-semibold text-amber-200">Pending</span>
                <span className="text-3xl font-black text-amber-300">
                  {analytics?.pendingProperties || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-green-500/20 to-transparent border border-green-500/30 hover:border-green-400/50 transition-all duration-300">
                <span className="text-base font-semibold text-green-200">Approved</span>
                <span className="text-3xl font-black text-green-300">
                  {analytics?.approvedProperties || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-red-500/20 to-transparent border border-red-500/30 hover:border-red-400/50 transition-all duration-300">
                <span className="text-base font-semibold text-red-200">Rejected</span>
                <span className="text-3xl font-black text-red-300">
                  {analytics?.rejectedProperties || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-purple-500/20 to-transparent border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <span className="text-base font-semibold text-purple-200">Premium</span>
                <span className="text-3xl font-black text-purple-300">
                  {analytics?.premiumProperties || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <DataTableCard
        title="Recent Leads"
        subtitle="Latest customer inquiries and contact requests"
        action={
          <div className="w-full max-w-sm">
            <SearchBar
              placeholder="Search leads by name..."
              value={query}
              onChange={setQuery}
            />
          </div>
        }
        footer={
          paginatedLeads.length > 0 && (
            <div className="flex items-center justify-between gap-6">
              <div className="text-sm font-medium text-gray-300">
                Showing <span className="font-bold text-white">{paginatedLeads.length}</span> of{" "}
                <span className="font-bold text-white">{filteredLeads.length}</span> leads
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )
        }
      >
        <table className="w-full">
          <TableHeader
            columns={[
              { key: "name", label: "Name" },
              { key: "contact", label: "Contact" },
              { key: "status", label: "Status" },
              { key: "date", label: "Date" },
              { key: "actions", label: "Actions" },
            ]}
          />
          <tbody className="divide-y divide-white/10">
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead, idx) => (
                <tr
                  key={lead._id || idx}
                  className={`hover:bg-white/5 transition-all duration-300 group border-b border-white/10 ${!lead.isViewed ? "bg-blue-500/10" : ""}`}
                >
                  <td className="px-8 py-6 text-sm font-semibold text-white group-hover:text-white transition-colors">
                    {lead.name}
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                    {lead.contact || lead.email || "-"}
                  </td>
                  <td className="px-8 py-6">
                    <Badge
                      label={lead.isViewed ? "Viewed" : "New"}
                      variant={lead.isViewed ? "info" : "success"}
                      size="sm"
                    />
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-8 py-6 flex-shrink-0">
                    <ActionButtons
                      onView={() => handleViewLead(lead._id)}
                      onEdit={() =>
                        (window.location.href = `/x-admin/leads/${lead._id}/edit`)
                      }
                      onDelete={() => console.log("Delete:", lead._id)}
                      size="sm"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-5">
                    <div className="text-6xl text-gray-300">📋</div>
                    <p className="text-gray-600 font-semibold text-lg">
                      {query ? "No leads match your search" : "No leads yet"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DataTableCard>
    </DashboardLayout>
  );
}