"use client";

import { useEffect, useState } from "react";

export default function PropertyInquiriesPage() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetch("/api/property-inquiry")
      .then((res) => res.json())
      .then((data) => setData(data));

  }, []);

  return (
    <div style={{ padding: 24 }}>

      <h1>Property Inquiries</h1>

      <table
        style={{
          width: "100%",
          marginTop: 20,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Property</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item: any) => (
            <tr key={item._id}>
              <td>{item.customerName}</td>
              <td>{item.phone}</td>
              <td>{item.propertyTitle}</td>
              <td>{item.inquiryType}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}