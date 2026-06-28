import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

async function ensureTable() {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
      id          TEXT PRIMARY KEY,
      email       TEXT NOT NULL,
      token       TEXT UNIQUE NOT NULL,
      "expiresAt" TIMESTAMP NOT NULL,
      used        BOOLEAN NOT NULL DEFAULT FALSE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string };
    const email = body.email?.toLowerCase().trim();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    await ensureTable();
    const sql = neon(process.env.DATABASE_URL!);

    // Check user exists — but always return the same success message to prevent enumeration
    const rows = await sql`SELECT id FROM "User" WHERE email = ${email} LIMIT 1`;
    if (rows[0]) {
      // Delete any existing unused token for this email
      await sql`DELETE FROM "PasswordResetToken" WHERE email = ${email} AND used = FALSE`;

      const token = crypto.randomUUID().replace(/-/g, "") + Math.random().toString(36).slice(2);
      const id = "prt" + Date.now().toString(36);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await sql`
        INSERT INTO "PasswordResetToken" (id, email, token, "expiresAt")
        VALUES (${id}, ${email}, ${token}, ${expiresAt}::timestamp)
      `;

      const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const resetUrl = `${appUrl}/set-new-password?token=${token}`;

      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        const resend = new Resend(apiKey);
        const fromEmail = process.env.RESEND_FROM ?? "Her Access <noreply@heraccess.tech>";
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: "Reset your Her Access password",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
              <h2 style="color:#3B1347;margin-bottom:8px">Reset your password 🔑</h2>
              <p style="color:#555;margin-bottom:24px">
                We received a request to reset the password for your Her Access account.
                Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
              </p>
              <a href="${resetUrl}" style="display:inline-block;background:#3B1347;color:#fff;padding:12px 28px;border-radius:16px;text-decoration:none;font-weight:600">
                Reset Password
              </a>
              <p style="color:#999;font-size:12px;margin-top:24px">
                If you didn't request this, you can safely ignore this email.
                <br/>Your password will not change.
              </p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
              <p style="color:#bbb;font-size:11px">Her Access — Safe learning for every girl</p>
            </div>
          `,
        }).catch((err) => console.error("[forgot-password] email send error:", err));
      } else {
        console.log("[forgot-password] RESEND_API_KEY not set. Reset link:", resetUrl);
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
