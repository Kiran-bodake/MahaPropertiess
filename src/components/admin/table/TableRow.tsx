"use client";

import { ReactNode } from "react";

interface TableRowProps {
  data: any;
  columns: string[];

  selectable?: boolean;

  isSelected?: boolean;

  onSelect?: (
    selected: boolean
  ) => void;

  renderCell?: (
    key: string,
    value: any,
    row: any
  ) => ReactNode;

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
    <tr
      style={{
        borderBottom:
          "1px solid #f1f5f9",

        transition: "all .25s ease",
      }}
    >

      {/* Checkbox */}
      {selectable && (
        <td
          style={{
            width: "48px",

            padding: "18px 24px",

            verticalAlign: "middle",
          }}
        >

          <input
            type="checkbox"

            checked={isSelected || false}

            onChange={(e) =>
              onSelect?.(e.target.checked)
            }

            style={{
              width: "16px",
              height: "16px",

              cursor: "pointer",

              accentColor: "#2563eb",

              borderRadius: "6px",

              border:
                "1px solid #d1d5db",
            }}
          />
        </td>
      )}

      {/* Table Cells */}
      {columns.map((col) => (

        <td
          key={col}

          style={{
            padding: "18px 24px",

            fontSize: "14px",

            fontWeight: 500,

            color: "#374151",

            verticalAlign: "middle",

            transition: "all .25s ease",
          }}
        >
          {renderCell
            ? renderCell(
                col,
                data[col],
                data
              )
            : data[col]}
        </td>
      ))}

      {/* Actions */}
      {actions && (
        <td
          style={{
            padding: "18px 24px",

            verticalAlign: "middle",

            whiteSpace: "nowrap",
          }}
        >
          {actions}
        </td>
      )}
    </tr>
  );
}