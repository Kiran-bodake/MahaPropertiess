"use client";

import { ReactNode } from "react";

interface TableRowProps {
  data: any;
  columns: string[];
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  renderCell?: (key: string, value: any, row: any) => ReactNode;
  actions?: ReactNode;
}

export function TableRow({
  data,
  columns,
  selectable,
  isSelected,
  onSelect,
  renderCell,
  actions,
}: TableRowProps) {
  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition-all duration-300 group">
      {selectable && (
        <td className="w-12 px-8 py-6">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => onSelect?.(e.target.checked)}
            className="rounded border-white/30 accent-blue-500 cursor-pointer"
          />
        </td>
      )}
      {columns.map((col) => (
        <td key={col} className="px-8 py-6 text-base font-medium text-gray-200 group-hover:text-white transition-colors duration-300">
          {renderCell ? renderCell(col, data[col], data) : data[col]}
        </td>
      ))}
      {actions && <td className="px-8 py-6 flex-shrink-0">{actions}</td>}
    </tr>
  );
}
