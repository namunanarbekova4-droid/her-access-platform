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

  const rows = await sql`
    SELECT
      c.id, c.title, c.description, c.category, c."totalWeeks",
      c.difficulty, c."imageEmoji", c."sortOrder", c."createdAt", c.lessons,
      (SELECT COUNT(*) FROM "LibraryItem" li WHERE li."courseId" = c.id)::int AS materials_count,
      (SELECT COUNT(*) FROM "VideoLesson" vl WHERE vl."courseId" = c.id AND vl."isPublished" = true)::int AS video_count
    FROM "Course" c
    WHERE c."isPublished" = true
    ORDER BY c."sortOrder" ASC, c."createdAt" ASC
  `.catch(() => []);

  const courses = rows.map((r) => {
    let lessonCount = 0;
    try {
      const parsed = JSON.parse((r.lessons as string) ?? "[]") as unknown[];
      lessonCount = Array.isArray(parsed) ? parsed.length : 0;
    } catch { lessonCount = 0; }

    return {
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      totalWeeks: r.totalWeeks,
      difficulty: r.difficulty,
      imageEmoji: r.imageEmoji,
      createdAt: r.createdAt,
      _count: {
        lessons: lessonCount || (r.materials_count as number) || 0,
        materials: r.materials_count as number ?? 0,
        videos: r.video_count as number ?? 0,
      },
    };
  });

  return NextResponse.json({ courses });
}
