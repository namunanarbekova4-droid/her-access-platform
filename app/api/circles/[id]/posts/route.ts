import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

function genId() {
  return "cp" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const posts = await sql`
    SELECT id, "circleId", nickname, content, "createdAt"
    FROM "CirclePost"
    WHERE "circleId" = ${params.id}
    ORDER BY "createdAt" ASC
    LIMIT 50
  `.catch(() => []);

  return NextResponse.json({ posts });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const memberRows = await sql`
    SELECT id, nickname FROM "CircleMember"
    WHERE "circleId" = ${params.id} AND "userId" = ${session.user.id}
    LIMIT 1
  `.catch(() => []);

  if (!memberRows[0]) {
    return NextResponse.json({ error: "Not a member of this circle" }, { status: 403 });
  }

  const body = await request.json() as { content: string };
  const { content } = body;

  if (!content?.trim() || content.trim().length < 2) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }
  if (content.trim().length > 500) {
    return NextResponse.json({ error: "Message too long (max 500 chars)" }, { status: 400 });
  }

  const trimmed = content.trim();
  const postId = genId();
  const now = new Date().toISOString();

  await sql`
    INSERT INTO "CirclePost" (id, "circleId", nickname, content, "createdAt")
    VALUES (${postId}, ${params.id}, ${memberRows[0].nickname as string}, ${trimmed}, ${now}::timestamp)
  `;

  return NextResponse.json({
    post: {
      id: postId,
      circleId: params.id,
      nickname: memberRows[0].nickname,
      content: trimmed,
      createdAt: now,
    },
  });
}
