"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";

const dateOptions = [
  "today",
  "tomorrow",
  "weekly",
  "monthly",
  "custom",
] as const;

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-GB").format(d);
}

type DateRange = { from: string; to: string };

export default function AdminDashboard() {
  const [selected, setSelected] =
    useState<(typeof dateOptions)[number]>("today");
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const [stats, setStats] = useState({ leads: 0, deals: 0, tasks: 0 });
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredLeads = leads;

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

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-32 mb-4" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  const conversionRate =
    stats.leads > 0 ? Math.round((stats.deals / stats.leads) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f6f9ff] px-4 md:px-8 py-6 space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
            Analytics Overview
          </h1>
          <p className="text-sm text-slate-500">
            Insights for leads, deals & performance
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100">
          <span className="text-xs text-slate-400">FILTER</span>
          <select
            value={selected}
            onChange={(e) =>
              setSelected(e.target.value as (typeof dateOptions)[number])
            }
            className="text-sm outline-none"
          >
            {dateOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 items-start">
        {[
          { name: "Total Leads", value: stats.leads },
          { name: "Active Deals", value: stats.deals },
          { name: "Tasks Due", value: stats.tasks },
          { name: "Conversion", value: `${conversionRate}%` },
        ].map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-md transition border border-slate-100"
          >
            <p className="text-sm text-slate-500">{item.name}</p>
            <h2 className="text-3xl font-bold mt-2 text-[#0f172a]">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* CHART + USERS */}
      <div className="grid gap-6 xl:grid-cols-3 items-start">
        {/* CHART */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-md transition border border-slate-100">
          <h2 className="font-semibold text-[#0f172a]">Revenue & Lead Flow</h2>

          <div className="mt-4 h-[260px] md:h-[320px] rounded-xl bg-blue-50 flex items-center justify-center text-slate-400 overflow-hidden">
            Chart here
          </div>
        </div>

        {/* ACTIVE USERS */}
        <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-md transition border border-slate-100">
          <h2 className="font-semibold text-[#0f172a]">Active Users</h2>

          <div className="mt-4 space-y-4">
            {[
              { name: "Website", val: 64 },
              { name: "WhatsApp", val: 21 },
              { name: "Calls", val: 14 },
              { name: "Walk-ins", val: 8 },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{item.name}</span>
                  <span>{item.val}%</span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full mt-1">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${item.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOWER SECTION */}
      <div className="grid gap-6 xl:grid-cols-2 items-start">
        {/* SOURCES */}
        <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-md transition border border-slate-100">
          <h2 className="font-semibold text-[#0f172a]">Top Acquisition</h2>

          <div className="mt-4 space-y-2">
            {[
              { name: "Google Ads", value: 42 },
              { name: "Organic", value: 28 },
              { name: "Referral", value: 18 },
              { name: "Walk-ins", value: 12 },
            ].map((s) => (
              <div
                key={s.name}
                className="flex justify-between bg-blue-50 px-3 py-2 rounded-lg text-sm"
              >
                <span>{s.name}</span>
                <strong>{s.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        {/* LEADS */}
        <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm hover:shadow-md transition border border-slate-100">
          <h2 className="font-semibold text-[#0f172a]">Recent Leads</h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-400">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Source</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="border-t">
                    <td className="p-2 font-medium">{lead._id.slice(-6)}</td>
                    <td className="p-2">{lead.source}</td>
                    <td className="p-2">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-2 text-slate-500">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <p className="text-sm text-slate-500 mt-3">No leads found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
