"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableMenuItem({
  menu,
  level,
}: {
  menu: any;
  level: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: menu._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "10px",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    paddingLeft: `${level * 30 + 12}px`,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      ☰ {menu.title}
    </div>
  );
}
