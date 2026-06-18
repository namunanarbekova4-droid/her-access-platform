import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    CREATE TABLE IF NOT EXISTS "LessonProgress" (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "lessonId" TEXT NOT NULL,
      completed BOOLEAN DEFAULT false,
      "completedAt" TIMESTAMP,
      UNIQUE("userId", "lessonId")
    )
  `.catch(() => null);

  const videos = await sql`
    SELECT id, title, description, category, "videoUrl", "thumbnailUrl",
           duration, language, "sortOrder", "courseId"
    FROM "VideoLesson"
    WHERE "isPublished" = true
    ORDER BY "sortOrder" ASC, "createdAt" DESC
  `.catch(() => []);

  if (videos.length === 0) {
    return NextResponse.json({ videos: [] });
  }

  const videoIds = videos.map((v) => v.id as string);

  const completions = await sql`
    SELECT "lessonId" FROM "LessonProgress"
    WHERE "userId" = ${session.user.id}
      AND "lessonId" = ANY(${videoIds})
      AND completed = true
  `.catch(() => []);

  const completedSet = new Set(completions.map((c) => c.lessonId as string));

  return NextResponse.json({
    videos: videos.map((v) => ({ ...v, completed: completedSet.has(v.id as string) })),
  });
}
