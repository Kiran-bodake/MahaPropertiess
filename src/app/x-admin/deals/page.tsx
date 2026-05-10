"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";

type Deal = {
  _id: string;
  title: string;
  value: number;
  status: string;
  updatedAt: string;
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/deals");
      const json = await res.json();
      setDeals(json.deals ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <h1 className="text-2xl font-semibold">Deals</h1>
        <p className="text-sm text-slate-400">
          Manage deal pipeline and move objects through stages.
        </p>
      </div>
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b-2 border-slate-600 bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-100">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-100">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-100">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-100">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr
                    key={deal._id}
                    className="border-b border-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-100 font-medium">
                      {deal.title}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      ₹{deal.value.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          deal.status === "open"
                            ? "bg-blue-500/20 text-blue-300"
                            : deal.status === "won"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(deal.updatedAt).toLocaleDateString()}
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
