import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGreeting } from "@/lib/utils";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [user, profile, messageCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { nickname: true, name: true } }),
    prisma.userProfile.findUnique({ where: { userId: session.user.id }, select: { learningGoals: true } }),
    prisma.message.count({ where: { userId: session.user.id, role: "user" } }),
  ]);

  const displayName = user?.nickname ?? user?.name;
  const greeting = getGreeting(displayName ?? undefined);

  return (
    <DashboardContent
      greeting={greeting}
      hasProfile={!!profile}
      goals={profile?.learningGoals ?? null}
      name={displayName ?? null}
      messageCount={messageCount}
    />
  );
}
