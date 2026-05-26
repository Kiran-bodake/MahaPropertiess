"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Home,
  Users,
  ListChecks,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";
import { StatCard } from "@/components/admin/cards/StatCard";
import { ChartCard } from "@/components/admin/cards/ChartCard";
import { DataTableCard } from "@/components/admin/cards/DataTableCard";
import { TableHeader } from "@/components/admin/table/TableHeader";
import { TableRow } from "@/components/admin/table/TableRow";
import { ActionButtons } from "@/components/admin/common/ActionButtons";
import { Badge } from "@/components/admin/common/Badge";
import { EmptyState } from "@/components/admin/common/EmptyState";

// Sample data
const chartData = [
  { month: "Jan", properties: 40, leads: 24, deals: 24 },
  { month: "Feb", properties: 30, leads: 13, deals: 22 },
  { month: "Mar", properties: 20, leads: 98, deals: 29 },
  { month: "Apr", properties: 27, leads: 39, deals: 20 },
  { month: "May", properties: 35, leads: 48, deals: 21 },
  { month: "Jun", properties: 45, leads: 38, deals: 25 },
];

const recentLeads = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    source: "Website",
    date: "2024-05-20",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    source: "Phone",
    date: "2024-05-19",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "completed",
    source: "Referral",
    date: "2024-05-18",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalLeads: 0,
    totalDeals: 0,
    totalTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/admin/dashboard");
        const data = await response.json();
        setStats({
          totalProperties: data.properties || 0,
          totalLeads: data.leads || 0,
          totalDeals: data.deals || 0,
          totalTasks: data.tasks || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening with your properties."
    >
      {/* Stats Grid */}
     <div className="mb-12 grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          label="Total Properties"
          value={stats.totalProperties}
          icon={<Home className="h-8 w-8" />}
          trend={12}
          color="blue"
        />
        <StatCard
          label="Active Leads"
          value={stats.totalLeads}
          icon={<Users className="h-6 w-6" />}
          trend={8}
          color="green"
        />
        <StatCard
          label="Total Deals"
          value={stats.totalDeals}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={-3}
          color="purple"
        />
        <StatCard
          label="Pending Tasks"
          value={stats.totalTasks}
          icon={<ListChecks className="h-6 w-6" />}
          trend={5}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Activity Overview" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="properties"
                stroke="#3b82f6"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#10b981"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance Metrics" subtitle="Deals vs Properties">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              <Bar dataKey="deals" fill="#a855f7" />
              <Bar dataKey="properties" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Leads Table */}
      <DataTableCard
        title="Recent Leads"
        subtitle="Latest leads from all sources"
        action={
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            View All
          </button>
        }
        footer={
          <div className="text-sm text-gray-600">
            Showing {recentLeads.length} of 24 leads
          </div>
        }
      >
        <table className="w-full">
          <TableHeader
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "source", label: "Source" },
              { key: "status", label: "Status" },
              { key: "date", label: "Date" },
              { key: "actions", label: "Actions", width: "w-20" },
            ]}
          />
          <tbody>
            {recentLeads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {lead.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {lead.source}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    variant={
                      lead.status === "active"
                        ? "success"
                        : lead.status === "pending"
                          ? "warning"
                          : "info"
                    }
                    size="sm"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{lead.date}</td>
                <td className="px-6 py-4">
                  <ActionButtons
                    onView={() => console.log("View lead:", lead.id)}
                    onEdit={() => console.log("Edit lead:", lead.id)}
                    onDelete={() => console.log("Delete lead:", lead.id)}
                    size="sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTableCard>
    </DashboardLayout>
  );
}
