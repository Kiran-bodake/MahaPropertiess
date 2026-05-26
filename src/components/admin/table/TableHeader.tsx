"use client";

interface TableHeaderProps {
  columns: {
    key: string;
    label: string;
    width?: string;
  }[];

  selectable?: boolean;

  onSelectAll?: (
    selected: boolean
  ) => void;

  isAllSelected?: boolean;
}

export function TableHeader({
  columns,
  selectable,
  onSelectAll,
  isAllSelected,
}: TableHeaderProps) {

  return (
    <thead
      style={{
        background: "#f8fafc",

        borderBottom:
          "1px solid #e5e7eb",
      }}
    >

      <tr>

        {/* Checkbox Column */}
        {selectable && (
          <th
            style={{
              width: "48px",

              padding: "18px 24px",

              textAlign: "left",
            }}
          >

            <input
              type="checkbox"

              checked={isAllSelected || false}

              onChange={(e) =>
                onSelectAll?.(e.target.checked)
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
          </th>
        )}

        {/* Columns */}
        {columns.map((col) => (

          <th
            key={col.key}

            style={{
              padding: "18px 24px",

              textAlign: "left",

              fontSize: "12px",

              fontWeight: 700,

              textTransform: "uppercase",

              letterSpacing: "0.14em",

              color: "#6b7280",

              whiteSpace: "nowrap",

              width: col.width || "auto",
            }}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}