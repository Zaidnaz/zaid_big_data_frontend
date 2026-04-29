import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Healthcare Analytics",
  description: "Interactive dashboard for healthcare data analysis.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* We will build out the header and main content area here */}
      <main>{children}</main>
    </div>
  );
}
