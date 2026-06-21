"use client";
import SortableMenuItem from "./SortableMenuItem";
export default function SortableTree({
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
        <div key={menu._id}>
          <SortableMenuItem menu={menu} level={level} />

          <SortableTree menus={menus} parentId={menu._id} level={level + 1} />
        </div>
      ))}
    </>
  );
}
