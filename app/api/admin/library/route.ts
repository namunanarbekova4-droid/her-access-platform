import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

function genId() {
  return "li" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function ensureTables() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS "LibraryItem" (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category    TEXT NOT NULL,
      content     TEXT NOT NULL,
      language    TEXT NOT NULL DEFAULT 'en',
      duration    TEXT,
      difficulty  TEXT,
      "courseId"  TEXT,
      "weekNumber" INTEGER,
      type        TEXT DEFAULT 'reading',
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await ensureTables();
    const sql = neon(process.env.DATABASE_URL!);
    const items = await sql`
      SELECT * FROM "LibraryItem" ORDER BY "createdAt" DESC
    `;
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[admin/library GET]", err);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as {
    title: string;
    description?: string;
    category: string;
    content: string;
    language?: string;
    duration?: string;
    difficulty?: string;
  };

  if (!body.title?.trim() || !body.category?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: "Title, category and content are required" }, { status: 400 });
  }

  try {
    await ensureTables();
    const sql = neon(process.env.DATABASE_URL!);
    const id = genId();
    const now = new Date().toISOString();

    await sql`
      INSERT INTO "LibraryItem" (id, title, description, category, content, language, duration, difficulty, type, "createdAt", "updatedAt")
      VALUES (
        ${id}, ${body.title.trim()}, ${body.description?.trim() ?? ""},
        ${body.category.trim()}, ${body.content.trim()},
        ${body.language ?? "en"}, ${body.duration?.trim() ?? null},
        ${body.difficulty?.trim() ?? null}, 'reading',
        ${now}::timestamp, ${now}::timestamp
      )
    `;

    return NextResponse.json({ item: { id, ...body } }, { status: 201 });
  } catch (err) {
    console.error("[admin/library POST]", err);
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
