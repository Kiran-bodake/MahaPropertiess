"use client";

import { useEffect, useState } from "react";

export default function ContactInquiriesPage() {

  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {

    fetch("/api/contact-inquiry")
      .then((res) => res.json())
      .then((data) => setInquiries(data));

  }, []);

  return (
    <div style={{ padding: "24px" }}>

      <h1>Contact Inquiries</h1>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Message</th>
          </tr>
        </thead>

        <tbody>
          {inquiries.map((item: any) => (
            <tr key={item._id}>
              <td>{item.fullName}</td>
              <td>{item.phone}</td>
              <td>{item.email}</td>
              <td>{item.message}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}