"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Deal = {
  _id: string;
  dealNumber: string;
  propertyTitle: string;
  propertyPrice?: number;

  customerName: string;
  customerPhone: string;
  customerEmail?: string;

  status: string;

  dealValue?: number;
  finalPrice?: number;

  owner?: string;
  notes?: string;

  tokenAmount?: number;
  totalReceived?: number;
  balanceAmount?: number;

  createdAt: string;
  updatedAt: string;
};

export default function DealDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    const fetchDeal = async () => {
      try {
        const res = await fetch(
          `/api/admin/deals/${params.id}`
        );

        const data = await res.json();

        if (data.success) {
          setDeal(data.deal);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [params?.id]);

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        Loading deal...
      </div>
    );
  }

  if (!deal) {
    return (
      <div style={{ padding: 30 }}>
        Deal not found
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 30,
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 20,
          marginBottom: 20,
          border: "1px solid #e2e8f0",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            marginBottom: 16,
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            fontSize: 28,
            margin: 0,
          }}
        >
          {deal.propertyTitle}
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: 8,
          }}
        >
          Deal Number: {deal.dealNumber}
        </p>
      </div>

      {/* Details Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            gap: 20,
          }}
        >
          <Info label="Customer Name" value={deal.customerName} />
          <Info label="Phone" value={deal.customerPhone} />
          <Info label="Email" value={deal.customerEmail || "-"} />
          <Info label="Status" value={deal.status} />
          <Info label="Property" value={deal.propertyTitle} />
          <Info
            label="Final Price"
            value={`₹${(
              deal.finalPrice ||
              deal.dealValue ||
              0
            ).toLocaleString()}`}
          />
          <Info
            label="Token Amount"
            value={`₹${(
              deal.tokenAmount || 0
            ).toLocaleString()}`}
          />
          <Info
            label="Received Amount"
            value={`₹${(
              deal.totalReceived || 0
            ).toLocaleString()}`}
          />
          <Info
            label="Balance Amount"
            value={`₹${(
              deal.balanceAmount || 0
            ).toLocaleString()}`}
          />
          <Info
            label="Owner"
            value={deal.owner || "-"}
          />
          <Info
            label="Created"
            value={new Date(
              deal.createdAt
            ).toLocaleString()}
          />
          <Info
            label="Updated"
            value={new Date(
              deal.updatedAt
            ).toLocaleString()}
          />
        </div>

        <div
          style={{
            marginTop: 24,
          }}
        >
          <h3>Notes</h3>

          <div
            style={{
              background: "#f8fafc",
              padding: 16,
              borderRadius: 12,
              minHeight: 80,
            }}
          >
            {deal.notes || "No notes available"}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          color: "#64748b",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        {value}
      </div>
    </div>
  );
}