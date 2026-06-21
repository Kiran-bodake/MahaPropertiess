export function buildTree(flattenedItems: any[]) {
  const root: any[] = [];
  const nodes: any = {};

  flattenedItems.forEach((item) => {
    nodes[item._id] = {
      ...item,
      children: [],
    };
  });

  flattenedItems.forEach((item) => {
    if (item.parentId) {
      nodes[item.parentId]?.children.push(nodes[item._id]);
    } else {
      root.push(nodes[item._id]);
    }
  });

  return root;
}
