import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { SettingsContent } from "@/components/dashboard/SettingsContent";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const sql = neon(process.env.DATABASE_URL!);
  const userId = session.user.id;

  const [userRows, profileRows] = await Promise.all([
    sql`SELECT nickname, name, language FROM "User" WHERE id = ${userId} LIMIT 1`.catch(() => []),
    sql`SELECT "educationLevel", "learningGoals", "timeAvailable", "careerDream", interests FROM "UserProfile" WHERE "userId" = ${userId} LIMIT 1`.catch(() => []),
  ]);

  const user = userRows[0] ?? null;
  const profile = profileRows[0] ?? null;
  const lang = session.user.language ?? "en";

  return (
    <SettingsContent
      lang={lang}
      currentLanguage={(user?.language as string | null) ?? lang}
      nickname={(user?.nickname as string | null) ?? null}
      profile={profile ? {
        educationLevel: profile.educationLevel as string | null,
        learningGoals: profile.learningGoals as string | null,
        timeAvailable: profile.timeAvailable as string | null,
        careerDream: profile.careerDream as string | null,
        interests: profile.interests as string | null,
      } : null}
    />
  );
}
