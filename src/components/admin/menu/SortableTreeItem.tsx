"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TreeItem from "./TreeItem";

export default function SortableTreeItem({ item }: { item: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TreeItem item={item} />
    </div>
  );
}
