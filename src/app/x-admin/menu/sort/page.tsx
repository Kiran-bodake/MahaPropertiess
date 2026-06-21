"use client";

import { useEffect, useState } from "react";
import SortableTree from "@/components/admin/menu/SortableTree";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

export default function MenuSortPage() {
  const [menus, setMenus] = useState<any[]>([]);
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = menus.findIndex((m) => m._id === active.id);

    const newIndex = menus.findIndex((m) => m._id === over.id);

    setMenus(arrayMove(menus, oldIndex, newIndex));
  }

  useEffect(() => {
    async function fetchMenus() {
      const res = await fetch("/api/menu");

      const data = await res.json();

      setMenus(data);
    }

    fetchMenus();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Menu Sorting</h1>
      <button
        onClick={async () => {
          await fetch("/api/menu/reorder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(menus),
          });

          alert("Menu order updated");
        }}
      >
        Save Order
      </button>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={menus.map((m) => m._id)}
          strategy={verticalListSortingStrategy}
        >
          <SortableTree menus={menus} />
        </SortableContext>
      </DndContext>
    </div>
  );
}
