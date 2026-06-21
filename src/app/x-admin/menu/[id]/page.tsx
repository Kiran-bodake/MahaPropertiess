"use client";

import { useEffect, useState } from "react";

export default function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [menu, setMenu] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMenu() {
      const { id } = await params;

      const res = await fetch(`/api/menu/${id}`);

      const data = await res.json();

      setMenu(data);

      const menusRes = await fetch("/api/menu");

      const menusData = await menusRes.json();

      setMenus(menusData.filter((m: any) => m._id !== id));
    }

    fetchMenu();
  }, [params]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch(`/api/menu/${menu._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menu),
    });

    alert("Menu updated successfully");
  }

  if (!menu) return <div>Loading...</div>;

  function renderOptions(parentId: string | null = null, level = 0): any[] {
    return menus
      .filter(
        (m) =>
          String(m.parentId || "") === String(parentId || "") &&
          m._id !== menu._id,
      )
      .flatMap((m) => [
        <option key={m._id} value={m._id}>
          {"—".repeat(level)} {m.title}
        </option>,

        ...renderOptions(m._id, level + 1),
      ]);
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "auto",
        padding: 20,
      }}
    >
      <h1>Edit Menu</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <br />

          <input
            value={menu.title}
            onChange={(e) =>
              setMenu({
                ...menu,
                title: e.target.value,
              })
            }
          />
        </div>

        <br />

        <div>
          <label>URL</label>

          <br />

          <input
            value={menu.href}
            onChange={(e) =>
              setMenu({
                ...menu,
                href: e.target.value,
              })
            }
          />
        </div>

        <br />

        <div>
          <label>Parent</label>

          <br />

          <select
            value={menu.parentId || ""}
            onChange={(e) =>
              setMenu({
                ...menu,
                parentId: e.target.value || null,
              })
            }
          >
            <option value="">None</option>

            {renderOptions()}
          </select>
        </div>

        <br />

        <div>
          <label>Type</label>

          <br />

          <select
            value={menu.type || "custom"}
            onChange={(e) =>
              setMenu({
                ...menu,
                type: e.target.value,
              })
            }
          >
            <option value="custom">Custom</option>

            <option value="category">Category</option>

            <option value="city">City</option>

            <option value="locality">Locality</option>

            <option value="blog">Blog</option>

            <option value="tool">Tool</option>
          </select>
        </div>

        <br />

        <div>
          <label>Location</label>

          <br />

          <select
            value={menu.location}
            onChange={(e) =>
              setMenu({
                ...menu,
                location: e.target.value,
              })
            }
          >
            <option value="header">Header</option>
            <option value="footer">Footer</option>
          </select>
        </div>

        <br />
        <div>
          <label>
            <input
              type="checkbox"
              checked={menu.openInNewTab || false}
              onChange={(e) =>
                setMenu({
                  ...menu,
                  openInNewTab: e.target.checked,
                })
              }
            />
            Open In New Tab
          </label>
        </div>

        <br />

        <div>
          <label>Active</label>

          <input
            type="checkbox"
            checked={menu.active}
            onChange={(e) =>
              setMenu({
                ...menu,
                active: e.target.checked,
              })
            }
          />
        </div>
        <br />

        <div>
          <label>
            <input
              type="checkbox"
              checked={menu.showOnDesktop || false}
              onChange={(e) =>
                setMenu({
                  ...menu,
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
              checked={menu.showOnMobile || false}
              onChange={(e) =>
                setMenu({
                  ...menu,
                  showOnMobile: e.target.checked,
                })
              }
            />
            Show On Mobile
          </label>
        </div>

        <div>
          <label>Description</label>

          <br />

          <textarea
            rows={4}
            value={menu.description || ""}
            onChange={(e) =>
              setMenu({
                ...menu,
                description: e.target.value,
              })
            }
          />
        </div>

        <br />

        <div>
          <label>CSS Class</label>

          <br />

          <input
            value={menu.cssClass || ""}
            onChange={(e) =>
              setMenu({
                ...menu,
                cssClass: e.target.value,
              })
            }
          />
        </div>

        <br />

        <button type="submit">Update Menu</button>
      </form>
    </div>
  );
}
