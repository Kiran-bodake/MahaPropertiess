"use client";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
}

const variantClasses = {
  default: "bg-white/10 text-gray-200 border border-white/20",
  success: "bg-green-500/20 text-green-200 border border-green-500/50",
  warning: "bg-amber-500/20 text-amber-200 border border-amber-500/50",
  error: "bg-red-500/20 text-red-200 border border-red-500/50",
  info: "bg-blue-500/20 text-blue-200 border border-blue-500/50",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs font-bold",
  md: "px-4 py-2 text-sm font-bold",
};

export function Badge({
  label,
  variant = "default",
  size = "md",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
}
