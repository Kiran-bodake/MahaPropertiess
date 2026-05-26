"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  color?: "blue" | "green" | "purple" | "orange";
}

const iconBgClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
};

const trendClasses = {
  positive: "bg-green-50 text-green-600 border border-green-100",
  negative: "bg-red-50 text-red-600 border border-red-100",
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "blue",
}: StatCardProps) {
  const isPositive = (trend || 0) >= 0;

  return (
    <div className="
      group
      rounded-3xl
      border border-gray-100
      bg-white
      p-4
      shadow-[0_8px_30px_rgba(0,0,0,0.05)]
      transition-all duration-300
      hover:-translate-y-1
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
      min-h-[125px]
    ">

      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            {label}
          </p>

          <h3 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>
        </div>

        {icon && (
          <div
            className={`
              flex h-11 w-11 items-center justify-center
              rounded-2xl
              ${iconBgClasses[color]}
            `}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div
          className={`
            inline-flex items-center gap-2
            rounded-xl px-3 py-2
            text-sm font-medium
            ${isPositive ? trendClasses.positive : trendClasses.negative}
          `}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}

          <span>{Math.abs(trend)}%</span>

          <span className="text-xs opacity-70">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}