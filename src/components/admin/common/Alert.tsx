"use client";

import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { ReactNode } from "react";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  message?: string;
  icon?: ReactNode;
  onClose?: () => void;
  action?: { label: string; onClick: () => void };
}

const variantConfig = {
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-900",
    titleColor: "text-blue-900",
    iconColor: "text-blue-500",
    actionColor: "hover:bg-blue-100",
    icon: Info,
  },
  success: {
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    titleColor: "text-green-900",
    iconColor: "text-green-500",
    actionColor: "hover:bg-green-100",
    icon: CheckCircle,
  },
  warning: {
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    titleColor: "text-amber-900",
    iconColor: "text-amber-500",
    actionColor: "hover:bg-amber-100",
    icon: AlertTriangle,
  },
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    titleColor: "text-red-900",
    iconColor: "text-red-500",
    actionColor: "hover:bg-red-100",
    icon: AlertCircle,
  },
};

export function Alert({
  variant = "info",
  title,
  message,
  onClose,
  action,
}: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl border ${config.bgColor} ${config.borderColor} p-6 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start gap-4">
        <Icon
          className={`h-6 w-6 ${config.iconColor} flex-shrink-0 mt-0.5`}
        />
        <div className="flex-1">
          {title && (
            <h3 className={`font-bold text-lg ${config.titleColor}`}>{title}</h3>
          )}
          {message && (
            <p className={`text-sm ${config.textColor} ${title ? "mt-2" : ""} leading-relaxed`}>
              {message}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${config.textColor} ${config.actionColor} transition-colors duration-200`}
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
