export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardNav } from "@/components/layout/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      {/* Content area — offset for desktop sidebar */}
      <div className="lg:pl-64">
        <main className="min-h-screen pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
