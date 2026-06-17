import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const b = await req.json() as Record<string, unknown>;
  const sql = neon(process.env.DATABASE_URL!);
  const now = new Date().toISOString();

  await sql`
    UPDATE "Course" SET
      title        = COALESCE(${b.title as string ?? null}, title),
      description  = COALESCE(${b.description as string ?? null}, description),
      category     = COALESCE(${b.category as string ?? null}, category),
      "totalWeeks" = COALESCE(${b.totalWeeks != null ? Number(b.totalWeeks) : null}, "totalWeeks"),
      difficulty   = COALESCE(${b.difficulty as string ?? null}, difficulty),
      language     = COALESCE(${b.language as string ?? null}, language),
      "imageEmoji" = COALESCE(${b.imageEmoji as string ?? null}, "imageEmoji"),
      "isPublished"= COALESCE(${b.isPublished != null ? Boolean(b.isPublished) : null}, "isPublished"),
      "sortOrder"  = COALESCE(${b.sortOrder != null ? Number(b.sortOrder) : null}, "sortOrder"),
      "updatedAt"  = ${now}::timestamp
    WHERE id = ${params.id}
  `;

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM "LibraryItem" WHERE "courseId" = ${params.id}`;
  await sql`DELETE FROM "VideoLesson" WHERE "courseId" = ${params.id}`;
  await sql`DELETE FROM "Course" WHERE id = ${params.id}`;

  return NextResponse.json({ ok: true });
}
