import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { token?: string; newPassword?: string };
    const { token, newPassword } = body;

    if (!token) return NextResponse.json({ error: "Reset token is missing." }, { status: 400 });
    if (!newPassword || newPassword.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

    const sql = neon(process.env.DATABASE_URL!);

    const rows = await sql`
      SELECT id, email, "expiresAt", used
      FROM "PasswordResetToken"
      WHERE token = ${token}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
    if (row.used) return NextResponse.json({ error: "This reset link has already been used." }, { status: 400 });
    if (new Date(row.expiresAt as string) < new Date())
      return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    const now = new Date().toISOString();

    await sql`UPDATE "User" SET password = ${hashed}, "updatedAt" = ${now}::timestamp WHERE email = ${row.email as string}`;
    await sql`UPDATE "PasswordResetToken" SET used = TRUE WHERE id = ${row.id as string}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[set-new-password]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
