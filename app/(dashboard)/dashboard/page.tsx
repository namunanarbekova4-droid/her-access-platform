import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGreeting } from "@/lib/utils";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.userProfile.findUnique({ where: { userId: session.user.id } }),
  ]);

  const greeting = getGreeting(user?.nickname ?? user?.name ?? undefined);

  return (
    <DashboardContent
      greeting={greeting}
      hasProfile={!!profile}
      goals={profile?.learningGoals ?? null}
    />
  );
}
