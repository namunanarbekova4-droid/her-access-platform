export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT "isAdmin", email FROM "User" WHERE id = ${session.user.id} LIMIT 1
  `.catch(() => []);

  const user = rows[0] ?? null;
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAllowed =
    user?.isAdmin ||
    (adminEmail && (user?.email as string)?.toLowerCase() === adminEmail.toLowerCase());

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
