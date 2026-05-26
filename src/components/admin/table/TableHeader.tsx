"use client";

interface TableHeaderProps {
  columns: {
    key: string;
    label: string;
    width?: string;
  }[];
  selectable?: boolean;
  onSelectAll?: (selected: boolean) => void;
  isAllSelected?: boolean;
}

export function TableHeader({
  columns,
  selectable,
  onSelectAll,
  isAllSelected,
}: TableHeaderProps) {
  return (
    <thead className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <tr>
        {selectable && (
          <th className="w-12 px-8 py-6">
            <input
              type="checkbox"
              checked={isAllSelected || false}
              onChange={(e) => onSelectAll?.(e.target.checked)}
              className="rounded border-white/30 accent-blue-500 cursor-pointer"
            />
          </th>
        )}
        {columns.map((col) => (
          <th
            key={col.key}
            className={`px-8 py-6 text-left text-xs font-bold text-gray-300 uppercase tracking-widest ${
              col.width || ""
            }`}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
