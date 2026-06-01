export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true, email: true },
  });

  // Allow if isAdmin OR email matches ADMIN_EMAIL env var
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAllowed =
    user?.isAdmin ||
    (adminEmail && user?.email?.toLowerCase() === adminEmail.toLowerCase());

  if (!isAllowed) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNav />
      <div className="flex-1 lg:pl-64">
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
