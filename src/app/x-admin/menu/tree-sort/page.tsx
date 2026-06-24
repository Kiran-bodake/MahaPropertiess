"use client";

import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableMenuTree from "@/components/admin/menu/SortableMenuTree";
import { flattenTree } from "@/lib/menu-tree/flattenTree";
import { getProjection } from "@/lib/menu-tree/getProjection";

export default function MenuTreeSortPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [offsetLeft, setOffsetLeft] = useState(0);

  useEffect(() => {
    async function fetchMenus() {
      const res = await fetch("/api/menu");
      const data = await res.json();

      setMenus(data);
    }

    fetchMenus();
  }, []);

  const flatMenus = flattenTree(menus);
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const projection = getProjection(flatMenus, active.id, over.id, offsetLeft);
    if (!projection) return;

    const oldIndex = flatMenus.findIndex((item) => item._id === active.id);

    const newIndex = flatMenus.findIndex((item) => item._id === over.id);

    if (newIndex === -1) return;

    const sortedItems = arrayMove(flatMenus, oldIndex, newIndex);

    const updatedItems = sortedItems.map((item) => {
      if (item._id === active.id) {
        return {
          ...item,
          depth: Math.max(0, projection.depth || 0),
          parentId:
            projection.depth > 0 && projection.parentId
              ? projection.parentId
              : null,
        };
      }

      return item;
    });

    setMenus(
      updatedItems.map((item: any) => ({
        ...item,
        depth: item._id === active.id ? projection.depth : item.depth,
      })),
    );

    console.table(
      updatedItems.map((x: any) => ({
        title: x.title,
        depth: x.depth,
        parent: x.parentId,
      })),
    );
  }
  return (
    <div style={{ padding: 20 }}>
      <h1>WordPress Menu Builder</h1>

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

      <br />
      <br />

      <DndContext
        collisionDetection={closestCenter}
        onDragMove={(event) => {
          setOffsetLeft(event.delta.x);
        }}
        onDragEnd={(event) => {
          handleDragEnd(event);
          setOffsetLeft(0);
        }}
      >
        <SortableContext
          items={flatMenus.map((m) => m._id)}
          strategy={verticalListSortingStrategy}
        >
          <SortableMenuTree items={flatMenus} />
        </SortableContext>
      </DndContext>
    </div>
  );
}
