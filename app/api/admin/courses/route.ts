import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function genId() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sql = neon(process.env.DATABASE_URL!);
  const courses = await sql`
    SELECT id, title, "totalWeeks", category, difficulty, language, "isPublished", "sortOrder"
    FROM "Course" ORDER BY "sortOrder" ASC, "createdAt" ASC
  `.catch(() => []);

  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as {
    title: string;
    description: string;
    category: string;
    totalWeeks: number;
    difficulty?: string;
    language?: string;
    imageEmoji?: string;
    isPublished?: boolean;
    sortOrder?: number;
  };

  if (!body.title || !body.category || !body.totalWeeks) {
    return NextResponse.json({ error: "title, category, totalWeeks required" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  const id = genId();
  const now = new Date().toISOString();

  await sql`
    INSERT INTO "Course" (id, title, description, category, "totalWeeks", difficulty, language, "imageEmoji", "isPublished", "sortOrder", "createdAt", "updatedAt")
    VALUES (
      ${id}, ${body.title}, ${body.description ?? ""}, ${body.category},
      ${Number(body.totalWeeks)}, ${body.difficulty ?? "Beginner"},
      ${body.language ?? "en"}, ${body.imageEmoji ?? "📚"},
      ${body.isPublished ?? true}, ${body.sortOrder ?? 0},
      ${now}::timestamp, ${now}::timestamp
    )
  `;

  return NextResponse.json({ course: { id, ...body } }, { status: 201 });
}
