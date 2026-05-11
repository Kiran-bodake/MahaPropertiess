"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import {
  BarChart2,
  Search,
  RefreshCw,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bell,
  ChevronDown,
} from "lucide-react";

const dateOptions = [
  "today",
  "tomorrow",
  "weekly",
  "monthly",
  "custom",
] as const;
const statusOptions = [
  "All Status",
  "new",
  "contacted",
  "qualified",
  "lost",
  "won",
];
const sourceOptions = [
  "All Sources",
  "Google Ads",
  "Organic",
  "Referral",
  "Walk-in",
  "WhatsApp",
];

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-GB").format(d);
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-purple-100 text-purple-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [selected, setSelected] =
    useState<(typeof dateOptions)[number]>("today");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [stats, setStats] = useState({ leads: 0, deals: 0, tasks: 0 });
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch("/api/admin/dashboard"),
          fetch("/api/admin/leads"),
        ]);
        const statsData = statsRes.ok ? await statsRes.json() : {};
        const leadsData = leadsRes.ok ? await leadsRes.json() : {};
        setStats({
          leads: statsData.leadsCount ?? 0,
          deals: statsData.dealsCount ?? 0,
          tasks: statsData.tasksCount ?? 0,
        });
        setLeads(leadsData.leads ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const conversionRate =
    stats.leads > 0 ? Math.round((stats.deals / stats.leads) * 100) : 0;

  const filtered = leads.filter((l) => {
    const matchStatus =
      statusFilter === "All Status" || l.status === statusFilter;
    const matchSource =
      sourceFilter === "All Sources" || l.source === sourceFilter;
    const matchSearch =
      !searchQuery ||
      l._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSource && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleRow = (id: string) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );

  const toggleAll = () =>
    setSelectedRows(
      selectedRows.length === paginated.length
        ? []
        : paginated.map((l) => l._id),
    );

  if (loading) {
    return (
      <div className="p-6 space-y-4 bg-[#f0f2f7] min-h-screen">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f7] font-sans flex flex-col">
      {/* ── TOP BAR ── */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-10">
        <div>
          <h1 className="text-[15px] font-bold text-[#0f172a]">Dashboard</h1>
          <p className="text-[11px] text-slate-400">
            Leads, deals &amp; performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative p-2 rounded-lg hover:bg-slate-50 transition">
            <Bell size={15} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          {/* Date filter */}
          <div className="relative flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] cursor-pointer hover:bg-slate-50 transition">
            <span className="text-slate-600 capitalize font-medium">
              {selected}
            </span>
            <ChevronDown size={12} className="text-slate-400" />
            <select
              value={selected}
              onChange={(e) =>
                setSelected(e.target.value as (typeof dateOptions)[number])
              }
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            >
              {dateOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Total Leads",
              value: stats.leads,
              delta: "+12%",
              deltaPositive: true,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Active Deals",
              value: stats.deals,
              delta: "+5%",
              deltaPositive: true,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              label: "Tasks Due",
              value: stats.tasks,
              delta: "-3%",
              deltaPositive: false,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              label: "Conversion",
              value: `${conversionRate}%`,
              delta: "+2%",
              deltaPositive: true,
              color: "text-green-600",
              bg: "bg-green-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-start justify-between hover:shadow-md transition"
            >
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-2xl font-bold text-[#0f172a] mt-1">
                  {s.value}
                </p>
                <p
                  className={`text-[11px] font-semibold mt-1 ${s.deltaPositive ? "text-green-600" : "text-red-500"}`}
                >
                  {s.delta} this period
                </p>
              </div>
              <div className={`${s.bg} ${s.color} p-2 rounded-lg`}>
                <BarChart2 size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* ── LEADS TABLE ── */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-bold text-[#0f172a]">
                Recent Leads
              </h2>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] bg-slate-50">
                <Search size={12} className="text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search leads..."
                  className="outline-none bg-transparent text-slate-700 placeholder:text-slate-300 w-32"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] text-slate-600 bg-slate-50 outline-none cursor-pointer"
              >
                {statusOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {/* Source filter */}
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setPage(1);
                }}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] text-slate-600 bg-slate-50 outline-none cursor-pointer"
              >
                {sourceOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {/* Refresh */}
              <button className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] text-slate-600 bg-slate-50 hover:bg-slate-100 transition">
                <RefreshCw size={11} />
                Refresh
              </button>
            </div>
          </div>

          {/* Bulk action bar */}
          {selectedRows.length > 0 && (
            <div className="px-5 py-2.5 bg-indigo-50 border-b border-indigo-100 flex items-center gap-3 text-[12px]">
              <span className="font-semibold text-indigo-700">
                {selectedRows.length} selected
              </span>
              <button className="text-red-500 hover:underline font-medium">
                Delete
              </button>
              <button className="text-indigo-600 hover:underline font-medium">
                Export
              </button>
              <button
                className="text-slate-500 hover:underline ml-auto"
                onClick={() => setSelectedRows([])}
              >
                Clear
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === paginated.length &&
                        paginated.length > 0
                      }
                      onChange={toggleAll}
                      className="rounded border-slate-300"
                    />
                  </th>
                  {["ID", "Name", "Source", "Status", "Phone", "Date", ""].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1">
                          {col}
                          {col !== "" && (
                            <ArrowUpDown size={10} className="text-slate-300" />
                          )}
                        </span>
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-14 text-center text-slate-400 text-[13px]"
                    >
                      No leads found matching your filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map((lead) => (
                    <tr
                      key={lead._id}
                      className={`hover:bg-slate-50 transition-colors ${selectedRows.includes(lead._id) ? "bg-indigo-50/40" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(lead._id)}
                          onChange={() => toggleRow(lead._id)}
                          className="rounded border-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                        #{lead._id?.slice(-6)}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#0f172a]">
                        {lead.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {lead.source ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[lead.status] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {lead.status ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {lead.phone ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition">
                            <Eye size={13} />
                          </button>
                          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition">
                            <Pencil size={13} />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-500">
            <span>
              Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}{" "}
              leads
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded text-[12px] font-medium transition-colors ${p === page ? "bg-indigo-600 text-white" : "hover:bg-slate-100 text-slate-500"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
