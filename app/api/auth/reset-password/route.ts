import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// One-time password reset endpoint protected by RESET_SECRET env var.
// Usage: POST /api/auth/reset-password
// Body: { email, newPassword, secret }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; newPassword?: string; secret?: string };
    const { email, newPassword, secret } = body;

    const adminSecret = process.env.RESET_SECRET;
    if (!adminSecret) {
      return NextResponse.json({ error: "Reset not configured. Set RESET_SECRET in Vercel env vars." }, { status: 503 });
    }
    if (secret !== adminSecret) {
      return NextResponse.json({ error: "Invalid secret." }, { status: 403 });
    }
    if (!email || !newPassword) {
      return NextResponse.json({ error: "email and newPassword are required." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`SELECT id FROM "User" WHERE email = ${email.toLowerCase().trim()} LIMIT 1`;
    if (!rows[0]) {
      return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    const now = new Date().toISOString();
    await sql`UPDATE "User" SET password = ${hashed}, "updatedAt" = ${now}::timestamp WHERE id = ${rows[0].id as string}`;

    return NextResponse.json({ ok: true, message: "Password updated. You can now sign in." });
  } catch (err) {
    console.error("[reset-password] error:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
