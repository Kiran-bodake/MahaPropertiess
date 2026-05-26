"use client";

import { ReactNode } from "react";
import { Bell, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-900 antialiased">

      {/* Header */}
      {(title || subtitle) && (
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-xl">

          <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between gap-10 px-6 py-5 sm:px-8 lg:px-10">

            {/* Left Side */}
            <div className="min-w-0 flex-1">

              {title && (
                <h1 className="truncate text-4xl font-bold tracking-tight text-gray-900">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">

              {/* Settings */}
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>

              {/* Notifications */}
              <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">

                <Bell className="h-5 w-5 text-gray-600" />

                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all duration-300 hover:shadow-md">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  A
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    Admin
                  </p>

                  <p className="text-xs text-gray-500">
                    Super Admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
    <main className="mx-auto w-full max-w-[1700px] px-5 py-7 sm:px-6 sm:py-8 lg:px-8 xl:px-10">

  <div className="space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
}