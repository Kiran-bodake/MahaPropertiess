"use client";

import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";

type Lead = {
  _id: string;
  name: string;
  source: string;
  status: string;
  createdAt: string;
  contact?: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        const response = await fetch("/api/admin/leads");
        const data = await response.json();
        setLeads(data.leads ?? []);
        setLoading(false);
      })();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return leads;
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(term) ||
        lead.source.toLowerCase().includes(term) ||
        (lead.contact ?? "").toLowerCase().includes(term),
    );
  }, [leads, query]);

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <p className="text-sm text-slate-400">
          Search and move leads through stages with full controls.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 outline-none"
          />
          <span className="rounded-lg bg-sky-500/20 px-2 py-1 text-xs text-sky-300">
            {filtered.length} leads found
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <div className="mb-3 flex gap-2">
          {["New", "Contacted", "Negotiation", "Closed"].map((status) => (
            <button
              key={status}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700"
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b-2 border-slate-600 bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-100">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-100">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-100">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-100">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-100">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-b border-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-100 font-medium">
                      {lead.name}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {lead.contact ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="inline-block px-2 py-1 rounded bg-slate-700/50 text-slate-200">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          lead.status === "new"
                            ? "bg-blue-500/20 text-blue-300"
                            : lead.status === "contacted"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : lead.status === "negotiation"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
