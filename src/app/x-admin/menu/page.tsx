"use client";

import { useEffect, useState } from "react";

import MenuRows from "@/components/admin/menu/MenuRows";

export default function MenuPage() {
  const [menus, setMenus] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();

        setMenus(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenus();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Menu Manager</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Location</th>
            <th>Desktop</th>
            <th>Mobile</th>
            <th>Active</th>
            <th>Parent</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          <MenuRows menus={menus} />
        </tbody>
      </table>
    </div>
  );
}
