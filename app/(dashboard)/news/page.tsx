import { NewsFeed } from "@/components/news/NewsFeed";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Announcements — Her Access" };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = user?.isAdmin || (!!adminEmail && session.user.email?.toLowerCase() === adminEmail.toLowerCase());

  return (
    <NewsFeed
      currentUserId={session.user.id}
      isAdmin={!!isAdmin}
    />
  );
}
