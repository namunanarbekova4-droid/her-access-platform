import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";
import { generateCourseWithAI } from "@/lib/gemini";

export const dynamic = "force-dynamic";

function genId(prefix: string) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as {
    topic: string;
    category?: string;
    difficulty?: string;
    language?: string;
    weeks?: number;
  };

  if (!body.topic?.trim()) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  let courseData;
  try {
    courseData = await generateCourseWithAI(body.topic.trim(), {
      category: body.category,
      difficulty: body.difficulty,
      language: body.language,
      weeks: body.weeks ?? 4,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI generation failed" },
      { status: 500 }
    );
  }

  const sql = neon(process.env.DATABASE_URL!);
  const courseId = genId("c");
  const now = new Date().toISOString();

  await sql`
    INSERT INTO "Course" (id, title, description, category, "totalWeeks", difficulty, language, "imageEmoji", "isPublished", "sortOrder", "createdAt", "updatedAt")
    VALUES (
      ${courseId}, ${courseData.title}, ${courseData.description}, ${courseData.category},
      ${courseData.totalWeeks}, ${courseData.difficulty}, ${courseData.language ?? "en"},
      ${courseData.imageEmoji ?? "📚"}, true, 0,
      ${now}::timestamp, ${now}::timestamp
    )
  `;

  for (const week of courseData.weeks) {
    const liId = genId("li");
    await sql`
      INSERT INTO "LibraryItem" (id, title, description, category, content, difficulty, type, "weekNumber", "courseId", "createdAt", "updatedAt")
      VALUES (
        ${liId},
        ${`Week ${week.week}: ${week.title}`},
        ${`Week ${week.week} of ${courseData.title}`},
        ${courseData.category},
        ${week.content},
        ${courseData.difficulty},
        'reading',
        ${week.week},
        ${courseId},
        ${now}::timestamp,
        ${now}::timestamp
      )
    `;

    if (week.videoUrl) {
      const vlId = genId("vl");
      await sql`
        INSERT INTO "VideoLesson" (id, title, description, category, "videoUrl", language, "isPublished", "sortOrder", "courseId", "weekNumber", "createdAt", "updatedAt")
        VALUES (
          ${vlId},
          ${`Week ${week.week}: ${week.videoTitle}`},
          ${`Video for Week ${week.week}`},
          ${courseData.category},
          ${week.videoUrl},
          ${courseData.language ?? "en"},
          true,
          ${week.week},
          ${courseId},
          ${week.week},
          ${now}::timestamp,
          ${now}::timestamp
        )
      `;
    }
  }

  return NextResponse.json({
    ok: true,
    courseId,
    title: courseData.title,
    weeks: courseData.weeks.length,
    message: `Created "${courseData.title}" with ${courseData.weeks.length} weeks`,
  });
}
