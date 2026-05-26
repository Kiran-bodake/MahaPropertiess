interface BadgeProps {
  children: React.ReactNode;

  variant?:
    | "default"
    | "rera"
    | "featured"
    | "new"
    | "sold"
    | "success"
    | "warning"
    | "zero-brokerage";

  className?: string;

  icon?: React.ReactNode;
}

const variantStyles = {
  default: {
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
  },

  rera: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
  },

  featured: {
    background: "#f5f3ff",
    color: "#7c3aed",
    border: "1px solid #ddd6fe",
  },

  new: {
    background: "#ecfdf5",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
  },

  sold: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },

  success: {
    background: "#ecfdf5",
    color: "#15803d",
    border: "1px solid #bbf7d0",
  },

  warning: {
    background: "#fffbeb",
    color: "#d97706",
    border: "1px solid #fde68a",
  },

  "zero-brokerage": {
    background: "#ecfeff",
    color: "#0891b2",
    border: "1px solid #a5f3fc",
  },
};

export function Badge({
  children,
  variant = "default",
  className,
  icon,
}: BadgeProps) {

  return (
    <span
      className={className}

      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",

        padding: "8px 14px",

        borderRadius: "999px",

        fontSize: "12px",
        fontWeight: 700,

        letterSpacing: "0.02em",

        whiteSpace: "nowrap",

        ...variantStyles[variant],
      }}
    >

      {/* Icon */}
      {icon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>
      )}

      {/* Text */}
      <span>
        {children}
      </span>
    </span>
  );
}