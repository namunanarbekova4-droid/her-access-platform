import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as Partial<{
    title: string;
    description: string;
    category: string;
    content: string;
    language: string;
    duration: string;
    difficulty: string;
  }>;

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const now = new Date().toISOString();

    await sql`
      UPDATE "LibraryItem" SET
        title       = COALESCE(${body.title?.trim() ?? null}, title),
        description = COALESCE(${body.description?.trim() ?? null}, description),
        category    = COALESCE(${body.category?.trim() ?? null}, category),
        content     = COALESCE(${body.content?.trim() ?? null}, content),
        language    = COALESCE(${body.language ?? null}, language),
        duration    = COALESCE(${body.duration?.trim() ?? null}, duration),
        difficulty  = COALESCE(${body.difficulty?.trim() ?? null}, difficulty),
        "updatedAt" = ${now}::timestamp
      WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/library PATCH]", err);
    const msg = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM "LibraryItem" WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/library DELETE]", err);
    return NextResponse.json({ success: true });
  }
}
