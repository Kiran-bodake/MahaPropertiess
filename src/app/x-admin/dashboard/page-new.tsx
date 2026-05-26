"use client";

import { useEffect, useState } from "react";
import {
  Home,
  Users,
  ListChecks,
  TrendingUp,
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
import { ActionButtons } from "@/components/admin/common/ActionButtons";
import { Badge } from "@/components/admin/common/Badge";

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
    date: "20 May 2026",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    source: "Phone",
    date: "19 May 2026",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "completed",
    source: "Referral",
    date: "18 May 2026",
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
    const fetchStats = async () => {
      try {
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
      subtitle="Welcome back! Here’s what’s happening with your properties."
    >

      {/* KPI SECTION */}
      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Properties"
          value={stats.totalProperties}
          icon={<Home className="h-6 w-6" />}
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

      {/* CHART SECTION */}
      <div className="mb-10 grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* LINE CHART */}
        <ChartCard
          title="Activity Overview"
          subtitle="Last 6 months performance"
        >
          <ResponsiveContainer width="100%" height={260}>

            <LineChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #f1f5f9",
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="properties"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="leads"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
              />

            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* BAR CHART */}
        <ChartCard
          title="Performance Metrics"
          subtitle="Deals vs Properties"
        >
          <ResponsiveContainer width="100%" height={260}>

            <BarChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #f1f5f9",
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />

              <Legend />

              <Bar
                dataKey="deals"
                fill="#a855f7"
                radius={[10, 10, 0, 0]}
              />

              <Bar
                dataKey="properties"
                fill="#f59e0b"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* RECENT LEADS */}
      <DataTableCard
        title="Recent Leads"
        subtitle="Latest leads from all sources"
        action={
          <button
            className="
              rounded-2xl
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-blue-700
              hover:shadow-md
            "
          >
            View All
          </button>
        }
        footer={
          <div className="text-sm text-gray-700">
            Showing {recentLeads.length} of 24 leads
          </div>
        }
      >

        <table className="w-full overflow-hidden rounded-2xl">

          <TableHeader
            columns={[
              { key: "name", label: "Customer" },
              { key: "email", label: "Email" },
              { key: "source", label: "Source" },
              { key: "status", label: "Status" },
              { key: "date", label: "Date" },
              { key: "actions", label: "Actions", width: "w-24" },
            ]}
          />

          <tbody>

            {recentLeads.map((lead) => (

              <tr
                key={lead.id}
                className="
                  border-b
                  border-gray-100
                  transition-all
                  duration-200
                  hover:bg-gray-50/80
                "
              >

                {/* NAME */}
                <td className="px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-100
                      text-sm
                      font-semibold
                      text-blue-600
                    ">
                      {lead.name.charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {lead.name}
                      </p>

                      <p className="text-xs text-gray-700">
                        Premium Customer
                      </p>
                    </div>

                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-5 text-sm text-gray-700">
                  {lead.email}
                </td>

                {/* SOURCE */}
                <td className="px-6 py-5 text-sm text-gray-700">
                  {lead.source}
                </td>

                {/* STATUS */}
                <td className="px-6 py-5">

                  <Badge
                    label={
                      lead.status.charAt(0).toUpperCase() +
                      lead.status.slice(1)
                    }
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

                {/* DATE */}
                <td className="px-6 py-5 text-sm text-gray-700">
                  {lead.date}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-5">

                  <ActionButtons
                    onView={() =>
                      console.log("View lead:", lead.id)
                    }
                    onEdit={() =>
                      console.log("Edit lead:", lead.id)
                    }
                    onDelete={() =>
                      console.log("Delete lead:", lead.id)
                    }
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