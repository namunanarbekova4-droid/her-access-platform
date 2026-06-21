import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      db: "connected",
      latencyMs: Date.now() - start,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[health] DB unreachable:", msg);
    return NextResponse.json({
      status: "error",
      db: "unreachable",
      error: msg,
      latencyMs: Date.now() - start,
    }, { status: 500 });
  }
}
