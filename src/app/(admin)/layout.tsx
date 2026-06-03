import type { Metadata } from "next";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export const metadata: Metadata = {
  title: {
    default: "Admin — PropVista",
    template: "%s | Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}