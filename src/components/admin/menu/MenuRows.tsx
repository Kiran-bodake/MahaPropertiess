"use client";
import { Fragment } from "react";

export default function MenuRows({
  menus,
  parentId = null,
  level = 0,
}: {
  menus: any[];
  parentId?: string | null;
  level?: number;
}) {
  const children = menus.filter(
    (m) => String(m.parentId || "") === String(parentId || ""),
  );

  return (
    <>
      {children.map((menu) => (
        <Fragment key={menu._id}>
          <tr key={menu._id}>
            <td>{menu.order}</td>

            <td>
              <div
                style={{
                  paddingLeft: `${level * 30}px`,
                  whiteSpace: "nowrap",
                }}
              >
                {level > 0 && "↳ "}
                {menu.title}
              </div>
            </td>

            <td>{menu.location}</td>
            <td>{menu.showOnDesktop ? "🖥️" : "❌"}</td>

            <td>{menu.showOnMobile ? "📱" : "❌"}</td>

            <td>{menu.active ? "✅" : "❌"}</td>

            <td>
              {menus.find((m) => String(m._id) === String(menu.parentId))
                ?.title || "-"}
            </td>

            <td>
              <a href={`/x-admin/menu/${menu._id}`}>✏️</a>
            </td>

            <td>
              <button
                onClick={async () => {
                  if (!confirm(`Delete "${menu.title}" ?`)) return;

                  await fetch(`/api/menu/${menu._id}`, {
                    method: "DELETE",
                  });

                  location.reload();
                }}
              >
                🗑️
              </button>
            </td>
          </tr>

          <MenuRows menus={menus} parentId={menu._id} level={level + 1} />
        </Fragment>
      ))}
    </>
  );
}
