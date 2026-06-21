export function getProjection(
  items: any[],
  activeId: string,
  overId: string,
  dragOffset: number,
) {
  const overIndex = items.findIndex((item) => item._id === overId);

  const previousItem = items[overIndex - 1];

  const maxDepth = previousItem ? previousItem.depth + 1 : 0;

  let depth = (previousItem?.depth || 0) + Math.round(dragOffset / 40);

  depth = Math.max(0, depth);
  depth = Math.min(maxDepth, depth);

  let parentId = null;

  if (depth > 0 && previousItem) {
    if (depth === previousItem.depth) {
      parentId = previousItem.parentId;
    } else if (depth > previousItem.depth) {
      parentId = previousItem._id;
    }
  }

  return {
    depth,
    parentId,
  };
}
