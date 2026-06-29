import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as { status: "APPROVED" | "REJECTED" | "PENDING" };

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const now = new Date().toISOString();
    await sql`
      UPDATE "Review" SET status = ${body.status}, "updatedAt" = ${now}::timestamp
      WHERE id = ${params.id}
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/reviews PATCH]", err);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}
