import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { LANGUAGES } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as { language: string; nickname: string | null };

  const validCodes = LANGUAGES.map((l) => l.code as string);
  if (!validCodes.includes(body.language)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const now = new Date().toISOString();

    await sql`
      UPDATE "User"
      SET
        language    = ${body.language},
        nickname    = ${body.nickname ?? null},
        "updatedAt" = ${now}::timestamp
      WHERE id = ${session.user.id}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[user/settings PATCH]", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
