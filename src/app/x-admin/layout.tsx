"use client";

import { usePathname } from "next/navigation";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/x-admin/login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      <div className="flex min-h-screen">

        {!isLoginPage && <AdminSidebar />}

        <div className="flex flex-1 flex-col overflow-hidden">

          {!isLoginPage && <AdminNavbar />}

          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10">
            <div className="mx-auto max-w-[1600px]">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}