"use client";

import { ReactNode } from "react";

interface DataTableCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
}

export function DataTableCard({
  title,
  subtitle,
  children,
  action,
  footer,
}: DataTableCardProps) {
  return (
    <div className="
      overflow-hidden
      rounded-3xl
      border border-gray-100
      bg-white
      shadow-[0_8px_30px_rgba(0,0,0,0.05)]
      transition-all duration-300
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
    ">

      {/* Header */}
      <div className="border-b border-gray-100 px-7 py-6">

        <div className="flex items-center justify-between gap-6">

          <div className="flex-1 min-w-0">

            <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
              {title}
            </h3>

            {subtitle && (
              <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">

        <div className="[&_table]:w-full">
          {children}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-7 py-5">

          <div className="text-sm text-gray-600">
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}