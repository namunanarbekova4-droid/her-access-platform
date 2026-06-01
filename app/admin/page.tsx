import { prisma } from "@/lib/prisma";
import { AdminOverview } from "@/components/admin/AdminOverview";

export const metadata = { title: "Admin — Her Access" };

export default async function AdminPage() {
  const [userCount, videoCount, libraryCount, messageCount] = await Promise.all([
    prisma.user.count(),
    prisma.videoLesson.count(),
    prisma.libraryItem.count(),
    prisma.message.count(),
  ]);

  return (
    <AdminOverview
      stats={{ userCount, videoCount, libraryCount, messageCount }}
    />
  );
}
