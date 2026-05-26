"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
};

export function ActionButtons({
  onView,
  onEdit,
  onDelete,
  size = "md",
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button
          onClick={onView}
          className={`inline-flex items-center justify-center ${sizeClasses[size]} rounded-lg border border-white/20 bg-white/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm`}
          title="View"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className={`inline-flex items-center justify-center ${sizeClasses[size]} rounded-lg border border-white/20 bg-white/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 hover:border-amber-400/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm`}
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`inline-flex items-center justify-center ${sizeClasses[size]} rounded-lg border border-white/20 bg-white/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:border-red-400/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm`}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
