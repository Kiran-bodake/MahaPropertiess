export function getProjection(
  items: any[],
  activeId: string,
  overId: string,
  dragOffset: number,
) {
  const overIndex = items.findIndex((item) => item._id === overId);

  if (overIndex < 0) {
    return {
      depth: 0,
      parentId: null,
    };
  }

  const previousItem = items[overIndex - 1];

  const maxDepth = previousItem ? previousItem.depth + 1 : 0;

  let depth = (previousItem?.depth ?? 0) + Math.round(dragOffset / 40);

  depth = Math.max(0, Math.min(depth, maxDepth));

  let parentId = null;

  console.log({
    previous: previousItem?.title,
    previousDepth: previousItem?.depth,
    calculatedDepth: depth,
  });

  if (depth > 0 && previousItem) {
    if (depth > previousItem.depth) {
      parentId = previousItem._id;
    } else if (depth === previousItem.depth) {
      parentId = previousItem.parentId ?? null;
    }
  }

  // Prevent self-parent
  if (parentId === activeId) {
    parentId = null;
    depth = 0;
  }

  return {
    depth,
    parentId,
  };
}
