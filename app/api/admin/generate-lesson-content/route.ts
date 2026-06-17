import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";
import { generateLessonContent } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as {
    libraryItemId: string;
    topic: string;
    courseTitle: string;
    weekNumber: number;
    difficulty?: string;
  };

  if (!body.libraryItemId || !body.topic || !body.courseTitle) {
    return NextResponse.json({ error: "libraryItemId, topic, courseTitle required" }, { status: 400 });
  }

  let content;
  try {
    content = await generateLessonContent(body.topic, body.courseTitle, body.weekNumber, body.difficulty);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI generation failed" },
      { status: 500 }
    );
  }

  const sql = neon(process.env.DATABASE_URL!);
  const now = new Date().toISOString();

  await sql`
    UPDATE "LibraryItem"
    SET content = ${content}, "updatedAt" = ${now}::timestamp
    WHERE id = ${body.libraryItemId}
  `;

  return NextResponse.json({ ok: true, content });
}
