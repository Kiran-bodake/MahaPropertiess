"use client";

import { useEffect, useState } from "react";

export default function NewMenuPage() {
  const [menus, setMenus] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    href: "",
    location: "header",
    parentId: "",
    type: "custom",
    cssClass: "",
    description: "",
    openInNewTab: false,
    active: true,
    showOnDesktop: true,
    showOnMobile: true,
  });

  useEffect(() => {
    async function fetchMenus() {
      const res = await fetch("/api/menu");
      const data = await res.json();

      setMenus(data);
    }

    fetchMenus();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        parentId: form.parentId || null,
        body: JSON.stringify({
          ...form,
          parentId: form.parentId || null,
          order: menus.length + 1,
        }),
      }),
    });

    if (res.ok) {
      alert("Menu created");

      setForm({
        title: "",
        href: "",
        location: "header",
        parentId: "",
        type: "custom",
        cssClass: "",
        description: "",
        openInNewTab: false,
        active: true,
        showOnDesktop: true,
        showOnMobile: true,
      });
      const updatedMenus = await fetch("/api/menu").then((r) => r.json());

      setMenus(updatedMenus);
    }
  }

  function renderOptions(parentId: string | null = null, level = 0): any[] {
    return menus
      .filter((m) => String(m.parentId || "") === String(parentId || ""))
      .flatMap((menu) => [
        <option key={menu._id} value={menu._id}>
          {"—".repeat(level)} {menu.title}
        </option>,

        ...renderOptions(menu._id, level + 1),
      ]);
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h1>Add Menu</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <br />
        <br />

        <input
          placeholder="/blogs"
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
        />

        <br />
        <br />

        <select
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        >
          <option value="header">Header</option>
          <option value="footer">Footer</option>
        </select>
        <br />

        <select
          value={form.parentId}
          onChange={(e) => setForm({ ...form, parentId: e.target.value })}
        >
          <option value="">None</option>

          {renderOptions()}
        </select>

        <br />
        <br />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="custom">Custom</option>
          <option value="category">Category</option>
          <option value="city">City</option>
          <option value="locality">Locality</option>
          <option value="blog">Blog</option>
          <option value="tool">Tool</option>
        </select>

        <br />
        <br />

        <input
          placeholder="cssClass"
          value={form.cssClass}
          onChange={(e) => setForm({ ...form, cssClass: e.target.value })}
        />

        <br />
        <br />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={form.openInNewTab}
            onChange={(e) =>
              setForm({
                ...form,
                openInNewTab: e.target.checked,
              })
            }
          />
          Open In New Tab
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({
                ...form,
                active: e.target.checked,
              })
            }
          />
          Active
        </label>

        <br />

        <div>
          <label>
            <input
              type="checkbox"
              checked={form.showOnDesktop}
              onChange={(e) =>
                setForm({
                  ...form,
                  showOnDesktop: e.target.checked,
                })
              }
            />
            Show On Desktop
          </label>
        </div>

        <br />

        <div>
          <label>
            <input
              type="checkbox"
              checked={form.showOnMobile}
              onChange={(e) =>
                setForm({
                  ...form,
                  showOnMobile: e.target.checked,
                })
              }
            />
            Show On Mobile
          </label>
        </div>

        <br />
        <br />

        <button type="submit">Save Menu</button>
      </form>
    </div>
  );
}
