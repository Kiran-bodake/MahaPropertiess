"use client";

import { useEffect, useState } from "react";

export default function PropertyInquiriesPage() {

  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchInquiries = async () => {

      try {

        const res = await fetch("/api/property-inquiry");

        const result = await res.json();

        console.log(result);

        setData(result);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    fetchInquiries();

  }, []);


  if (loading) {

    return (
      <div
        style={{
          padding: 24,
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        Loading inquiries...
      </div>
    );
  }


  return (
    <div
      style={{
        padding: 24,
      }}
    >

      {/* HEADER */}
      <div
        style={{
          marginBottom: 20,
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Property Inquiries
        </h1>

        <p
          style={{
            marginTop: 6,
            color: "#64748b",
            fontSize: ".95rem",
          }}
        >
          Manage all property leads and callback requests.
        </p>

      </div>


      {/* EMPTY STATE */}
      {data.length === 0 ? (

        <div
          style={{
            padding: 24,
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
          }}
        >
          No inquiries found.
        </div>

      ) : (

        <div
          style={{
            overflowX: "auto",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >

            <thead>

              <tr
                style={{
                  background: "#f8fafc",
                }}
              >

                <th style={th}>Customer</th>

                <th style={th}>Phone</th>

                <th style={th}>Email</th>

                <th style={th}>Property</th>

                <th style={th}>Type</th>

                <th style={th}>Message</th>

                <th style={th}>Date</th>

              </tr>

            </thead>


            <tbody>

              {data.map((item) => (

                <tr
                  key={item._id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >

                  <td style={td}>
                    {item.customerName}
                  </td>

                  <td style={td}>
                    {item.phone}
                  </td>

                  <td style={td}>
                    {item.email || "-"}
                  </td>

                  <td style={td}>
                    {item.propertyTitle}
                  </td>

                  <td style={td}>

                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        background:
                          item.inquiryType === "callback"
                            ? "#dcfce7"
                            : "#dbeafe",
                        color:
                          item.inquiryType === "callback"
                            ? "#166534"
                            : "#1d4ed8",
                        fontSize: ".78rem",
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {item.inquiryType}
                    </span>

                  </td>

                  <td style={td}>
                    {item.message || "-"}
                  </td>

                  <td style={td}>
                    {new Date(item.createdAt)
                      .toLocaleDateString("en-IN")}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}


const th: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: ".9rem",
  fontWeight: 700,
  color: "#0f172a",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};


const td: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: ".9rem",
  color: "#334155",
  verticalAlign: "top",
};