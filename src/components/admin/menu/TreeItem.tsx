export default function TreeItem({ item }: { item: any }) {
  return (
    <div
      style={{
        marginLeft: (item.depth || 0) * 40,
        padding: 12,
        marginBottom: 8,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fff",
        cursor: "grab",
        transition: ".2s",
      }}
    >
      ☰ {item.title}
    </div>
  );
}
