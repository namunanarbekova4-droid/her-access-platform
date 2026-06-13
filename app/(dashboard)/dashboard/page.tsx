import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGreeting } from "@/lib/utils";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const DAY_MS = 86400000;
  const normalize = (d: Date) => {
    const n = new Date(d);
    n.setHours(0, 0, 0, 0);
    return n.getTime();
  };

  const daySet = new Set(dates.map(normalize));
  const today = normalize(new Date());
  const yesterday = today - DAY_MS;

  const start = daySet.has(today) ? today : daySet.has(yesterday) ? yesterday : null;
  if (!start) return 0;

  let streak = 0;
  let check = start;
  while (daySet.has(check)) {
    streak++;
    check -= DAY_MS;
  }
  return streak;
}

const MILESTONES = [1, 5, 10, 25, 50, 100, 250, 500];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [user, profile, messageDates] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { nickname: true, name: true } }),
    prisma.userProfile.findUnique({ where: { userId: session.user.id }, select: { learningGoals: true } }),
    prisma.message.findMany({
      where: { userId: session.user.id, role: "user" },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 365,
    }),
  ]);

  const messageCount = messageDates.length;
  const streak = computeStreak(messageDates.map((m) => m.createdAt));
  const latestMilestone = [...MILESTONES].reverse().find((m) => messageCount >= m) ?? null;

  const displayName = user?.nickname ?? user?.name;
  const greeting = getGreeting(displayName ?? undefined);

  return (
    <DashboardContent
      greeting={greeting}
      hasProfile={!!profile}
      goals={profile?.learningGoals ?? null}
      name={displayName ?? null}
      messageCount={messageCount}
      streak={streak}
      latestMilestone={latestMilestone}
    />
  );
}
