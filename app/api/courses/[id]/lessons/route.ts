import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { generateCourseLessonsContent } from "@/lib/gemini";

export const dynamic = "force-dynamic";

interface LessonStub {
  id: string;
  title: string;
  content: string | null;
}

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const rows = await sql`SELECT * FROM "Course" WHERE id = ${params.id} LIMIT 1`.catch(() => []);
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const course = rows[0];
  const language = (session.user as { language?: string })?.language ?? (course.language as string) ?? "en";

  let stubs: LessonStub[] = [];
  try {
    const parsed = JSON.parse((course.lessons as string) ?? "[]") as LessonStub[];
    // If content is already generated, return as-is
    if (parsed.length > 0 && parsed[0]?.content != null) {
      return NextResponse.json({ ok: true, lessons: parsed });
    }
    stubs = parsed;
  } catch {
    stubs = [];
  }

  const lessonTitles = stubs.length > 0
    ? stubs.map((s) => s.title)
    : ["Lesson 1", "Lesson 2", "Lesson 3"];

  const lessons = await generateCourseLessonsContent(
    course.title as string,
    course.category as string,
    lessonTitles,
    language
  );

  const now = new Date().toISOString();
  const lessonsJson = JSON.stringify(lessons);

  await sql`
    UPDATE "Course" SET lessons = ${lessonsJson}, "updatedAt" = ${now}::timestamp
    WHERE id = ${params.id}
  `.catch(() => null);

  return NextResponse.json({ ok: true, lessons });
}
