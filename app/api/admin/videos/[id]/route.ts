import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const b = await request.json() as {
    title?: string;
    description?: string;
    category?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    duration?: string;
    language?: string;
    isPublished?: boolean;
    sortOrder?: number;
    courseId?: string | null;
    weekNumber?: number | null;
  };

  const sql = neon(process.env.DATABASE_URL!);
  const now = new Date().toISOString();

  await sql`
    UPDATE "VideoLesson" SET
      title        = ${b.title?.trim() ?? ""},
      description  = ${b.description?.trim() ?? null},
      category     = ${b.category?.trim() ?? ""},
      "videoUrl"   = ${b.videoUrl?.trim() ?? ""},
      "thumbnailUrl" = ${b.thumbnailUrl?.trim() ?? null},
      duration     = ${b.duration?.trim() ?? null},
      language     = ${b.language ?? "en"},
      "isPublished" = ${b.isPublished ?? true},
      "sortOrder"  = ${b.sortOrder ?? 0},
      "courseId"   = ${b.courseId ?? null},
      "weekNumber" = ${b.weekNumber ?? null},
      "updatedAt"  = ${now}::timestamp
    WHERE id = ${params.id}
  `;

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM "VideoLesson" WHERE id = ${params.id}`;

  return NextResponse.json({ success: true });
}
