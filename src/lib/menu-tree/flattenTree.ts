type FlattenedMenu = {
  _id: string;
  parentId?: string | null;
  depth: number;
  [key: string]: any;
};

export function flattenTree(
  items: any[],
  parentId: string | null = null,
  depth = 0,
): FlattenedMenu[] {
  return items
    .filter((item) => String(item.parentId || "") === String(parentId || ""))
    .reduce<FlattenedMenu[]>((acc, item) => {
      return [
        ...acc,
        {
          ...item,
          depth,
        },
        ...flattenTree(items, item._id, depth + 1),
      ];
    }, []);
}
