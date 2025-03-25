"use client";

import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
