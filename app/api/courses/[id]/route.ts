import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const [courseRows, materialRows, videoRows] = await Promise.all([
    sql`SELECT * FROM "Course" WHERE id = ${params.id} LIMIT 1`.catch(() => []),
    sql`
      SELECT * FROM "LibraryItem"
      WHERE "courseId" = ${params.id}
      ORDER BY "weekNumber" ASC NULLS LAST, "createdAt" ASC
    `.catch(() => []),
    sql`
      SELECT * FROM "VideoLesson"
      WHERE "courseId" = ${params.id} AND "isPublished" = true
      ORDER BY "weekNumber" ASC NULLS LAST, "sortOrder" ASC
    `.catch(() => []),
  ]);

  if (!courseRows[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const dbRow = courseRows[0];

  let aiLessons: unknown[] | null = null;
  try {
    if (dbRow.lessons) {
      aiLessons = JSON.parse(dbRow.lessons as string) as unknown[];
    }
  } catch { aiLessons = null; }

  const course = {
    id: dbRow.id,
    title: dbRow.title,
    description: dbRow.description,
    category: dbRow.category,
    totalWeeks: dbRow.totalWeeks,
    difficulty: dbRow.difficulty,
    imageEmoji: dbRow.imageEmoji,
    language: dbRow.language ?? "en",
    aiLessons,
    materials: materialRows,
    videoLessons: videoRows,
  };

  return NextResponse.json({ course });
}
