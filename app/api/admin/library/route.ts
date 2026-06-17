import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

function genId() {
  return "li" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sql = neon(process.env.DATABASE_URL!);
  const items = await sql`
    SELECT * FROM "LibraryItem" ORDER BY "createdAt" DESC
  `.catch(() => []);

  return NextResponse.json({ items });
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
}
