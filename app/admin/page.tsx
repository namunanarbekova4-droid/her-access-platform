import { neon } from "@neondatabase/serverless";
import { AdminOverview } from "@/components/admin/AdminOverview";

export const metadata = { title: "Admin — Her Access" };

export default async function AdminPage() {
  const sql = neon(process.env.DATABASE_URL!);

  const [userRows, videoRows, libraryRows, messageRows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM "User"`.catch(() => [{ count: 0 }]),
    sql`SELECT COUNT(*)::int AS count FROM "VideoLesson"`.catch(() => [{ count: 0 }]),
    sql`SELECT COUNT(*)::int AS count FROM "LibraryItem"`.catch(() => [{ count: 0 }]),
    sql`SELECT COUNT(*)::int AS count FROM "Message"`.catch(() => [{ count: 0 }]),
  ]);

  return (
    <AdminOverview
      stats={{
        userCount: (userRows[0]?.count as number) ?? 0,
        videoCount: (videoRows[0]?.count as number) ?? 0,
        libraryCount: (libraryRows[0]?.count as number) ?? 0,
        messageCount: (messageRows[0]?.count as number) ?? 0,
      }}
    />
  );
}
