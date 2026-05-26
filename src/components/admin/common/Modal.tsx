"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className={`w-full rounded-xl bg-white shadow-2xl transform transition-all animate-scale-in ${sizeClasses[size]}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-8 py-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-base text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 inline-flex items-center justify-center h-10 w-10 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200 flex-shrink-0"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/50 px-8 py-6 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
