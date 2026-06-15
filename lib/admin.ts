import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT "isAdmin", email FROM "User" WHERE id = ${session.user.id} LIMIT 1
  `.catch(() => []);

  const user = rows[0] ?? null;
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAllowed =
    user?.isAdmin ||
    (adminEmail && (user?.email as string)?.toLowerCase() === adminEmail.toLowerCase());

  return isAllowed ? session : null;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}
