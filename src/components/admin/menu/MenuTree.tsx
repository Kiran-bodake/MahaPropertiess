"use client";

import Link from "next/link";

export default function MenuTree({
  menus,
  parentId,
}: {
  menus: any[];
  parentId: string | null;
}) {
  const children = menus.filter(
    (m) => String(m.parentId || "") === String(parentId || ""),
  );

  return (
    <>
      {children.map((menu) => (
        <div
          key={menu._id}
          style={{
            paddingLeft: parentId ? "30px" : "0",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <span>
              {parentId && "↳ "} {menu.title}
            </span>

            <Link href={`/x-admin/menu/${menu._id}`}>✏️</Link>
          </div>

          <MenuTree menus={menus} parentId={menu._id} />
        </div>
      ))}
    </>
  );
}
