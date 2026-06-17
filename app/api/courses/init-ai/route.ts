import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { generateCourseStubs } from "@/lib/gemini";

export const dynamic = "force-dynamic";

const CATEGORY_EMOJI: Record<string, string> = {
  "Language & Literacy": "📚",
  "Digital Skills": "💻",
  "Financial Literacy": "💰",
  "Health & Rights": "❤️",
  "Career Skills": "🚀",
};

function genId(prefix: string) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  // Ensure lessons column exists
  await sql`ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS lessons TEXT`.catch(() => null);

  // Check if courses already exist
  const existing = await sql`SELECT COUNT(*)::int AS count FROM "Course"`.catch(() => [{ count: 1 }]);
  if ((existing[0]?.count ?? 0) > 0) {
    return NextResponse.json({ ok: true, seeded: false });
  }

  const body = await req.json().catch(() => ({})) as { language?: string };
  const language = (session.user as { language?: string })?.language ?? body.language ?? "en";

  const stubs = await generateCourseStubs(language);

  const now = new Date().toISOString();
  let created = 0;

  for (let i = 0; i < stubs.length; i++) {
    const stub = stubs[i];
    if (!stub?.title) continue;
    const courseId = genId("c");
    const emoji = stub.imageEmoji || CATEGORY_EMOJI[stub.category] || "📖";
    const titles = Array.isArray(stub.lessonTitles) ? stub.lessonTitles : [];
    const lessonStubs = JSON.stringify(
      titles.map((t, idx) => ({ id: String(idx + 1), title: t, content: null }))
    );

    await sql`
      INSERT INTO "Course" (id, title, description, category, "totalWeeks", difficulty, language, "imageEmoji", "isPublished", "sortOrder", lessons, "createdAt", "updatedAt")
      VALUES (
        ${courseId}, ${stub.title}, ${stub.description ?? ""}, ${stub.category},
        ${titles.length || 3}, 'Beginner', ${language}, ${emoji},
        true, ${i}, ${lessonStubs}, ${now}::timestamp, ${now}::timestamp
      )
    `.catch(() => null);

    created++;
  }

  return NextResponse.json({ ok: true, seeded: true, created });
}
