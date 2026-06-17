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
      c.difficulty, c."imageEmoji", c."sortOrder", c."createdAt",
      (SELECT COUNT(*) FROM "LibraryItem" li WHERE li."courseId" = c.id)::int AS materials_count,
      (SELECT COUNT(*) FROM "VideoLesson" vl WHERE vl."courseId" = c.id AND vl."isPublished" = true)::int AS lessons_count
    FROM "Course" c
    WHERE c."isPublished" = true
    ORDER BY c."sortOrder" ASC, c."createdAt" ASC
  `.catch(() => []);

  const courses = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    totalWeeks: r.totalWeeks,
    difficulty: r.difficulty,
    imageEmoji: r.imageEmoji,
    _count: {
      materials: r.materials_count ?? 0,
      lessons: r.lessons_count ?? 0,
    },
  }));

  return NextResponse.json({ courses });
}
