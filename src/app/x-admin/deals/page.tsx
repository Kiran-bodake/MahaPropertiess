"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    try {
      const res = await fetch("/api/admin/deals");
      const data = await res.json();

      if (data.success) {
        setDeals(data.deals);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredDeals = useMemo(() => {
    return deals.filter((deal: any) =>
      [
        deal.customerName,
        deal.propertyTitle,
        deal.dealNumber,
        deal.customerPhone,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [deals, search]);

  if (loading) {
    return (
      <div className="p-5">
        <h2>Loading Deals...</h2>
      </div>
    );
  }

  return (
    <div className="p-5">

      <div className="d-flex justify-content-between mb-4">
        <h2>Deals Management</h2>

        <input
          type="text"
          placeholder="Search..."
          className="form-control"
          style={{ width: 300 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="card-body">

          <table className="table table-hover">

            <thead>
              <tr>
                <th>Deal No</th>
                <th>Customer</th>
                <th>Property</th>
                <th>Amount</th>
                <th>Status</th>
              <th style={{ width: "150px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDeals.map((deal: any) => (
                <tr key={deal._id}>
                  <td>{deal.dealNumber}</td>

                  <td>
                    <div>{deal.customerName}</div>
                    <small>{deal.customerPhone}</small>
                  </td>

                  <td>{deal.propertyTitle}</td>

                  <td>
                    ₹{Number(deal.finalPrice || 0).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span className="badge bg-primary">
                      {deal.status}
                    </span>
                  </td>

                  <td>
                    <Link
                      href={`/x-admin/deals/${deal._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}