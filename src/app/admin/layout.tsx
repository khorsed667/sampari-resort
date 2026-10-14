import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

export const metadata = {
  title: "Admin Portal | Sampari Resort",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
