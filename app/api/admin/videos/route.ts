import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

function genId() {
  return "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function ensureTables() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS "VideoLesson" (
      id             TEXT PRIMARY KEY,
      title          TEXT NOT NULL,
      description    TEXT,
      category       TEXT NOT NULL,
      "videoUrl"     TEXT NOT NULL,
      "thumbnailUrl" TEXT,
      duration       TEXT,
      language       TEXT NOT NULL DEFAULT 'en',
      "isPublished"  BOOLEAN NOT NULL DEFAULT TRUE,
      "sortOrder"    INTEGER NOT NULL DEFAULT 0,
      "courseId"     TEXT,
      "weekNumber"   INTEGER,
      "createdAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt"    TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await ensureTables();
    const sql = neon(process.env.DATABASE_URL!);
    const videos = await sql`
      SELECT * FROM "VideoLesson" ORDER BY "sortOrder" ASC, "createdAt" DESC
    `;
    return NextResponse.json({ videos });
  } catch (err) {
    console.error("[admin/videos GET]", err);
    return NextResponse.json({ videos: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as {
    title: string;
    description?: string;
    category: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    language?: string;
    isPublished?: boolean;
    sortOrder?: number;
    courseId?: string | null;
    weekNumber?: number | null;
  };

  if (!body.title?.trim() || !body.videoUrl?.trim() || !body.category?.trim()) {
    return NextResponse.json({ error: "Title, video URL and category are required" }, { status: 400 });
  }

  try {
    await ensureTables();
    const sql = neon(process.env.DATABASE_URL!);
    const id = genId();
    const now = new Date().toISOString();

    await sql`
      INSERT INTO "VideoLesson" (
        id, title, description, category, "videoUrl", "thumbnailUrl",
        duration, language, "isPublished", "sortOrder", "courseId", "weekNumber",
        "createdAt", "updatedAt"
      ) VALUES (
        ${id},
        ${body.title.trim()},
        ${body.description?.trim() ?? null},
        ${body.category.trim()},
        ${body.videoUrl.trim()},
        ${body.thumbnailUrl?.trim() ?? null},
        ${body.duration?.trim() ?? null},
        ${body.language ?? "en"},
        ${body.isPublished ?? true},
        ${body.sortOrder ?? 0},
        ${body.courseId ?? null},
        ${body.weekNumber ?? null},
        ${now}::timestamp,
        ${now}::timestamp
      )
    `;

    return NextResponse.json({ video: { id, ...body } }, { status: 201 });
  } catch (err) {
    console.error("[admin/videos POST]", err);
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
