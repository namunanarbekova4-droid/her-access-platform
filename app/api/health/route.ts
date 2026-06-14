import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      db: "connected",
      latencyMs: Date.now() - start,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      status: "error",
      db: "unreachable",
      error: msg,
      latencyMs: Date.now() - start,
    }, { status: 500 });
  }
}
