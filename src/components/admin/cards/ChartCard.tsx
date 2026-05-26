"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  children,
  action,
}: ChartCardProps) {
    return (
  <div className="
    rounded-3xl
    border border-gray-100
    bg-white
    p-5
    shadow-[0_8px_30px_rgba(0,0,0,0.05)]
    transition-all duration-300
    hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
  ">

    {/* Header */}
    <div className="mb-8 flex items-start justify-between gap-6">

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

    {/* Chart Content */}
    <div className="[&_svg]:rounded-2xl">
      {children}
    </div>
  </div>
);
}
