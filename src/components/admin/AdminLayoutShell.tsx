"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AUTH_PATHS = [
  "/admin/login",
  "/admin/signup",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((path) => pathname?.startsWith(path));

  if (isAuthPage) {
    return <div className="min-h-screen bg-cream">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
