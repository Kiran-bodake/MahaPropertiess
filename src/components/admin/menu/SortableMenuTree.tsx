"use client";

import SortableTreeItem from "./SortableTreeItem";

export default function SortableMenuTree({ items }: { items: any[] }) {
  return (
    <>
      {items.map((item) => (
        <SortableTreeItem key={item._id} item={item} />
      ))}
    </>
  );
}
