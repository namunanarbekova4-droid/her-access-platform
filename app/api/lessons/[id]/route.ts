import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  const rows = await sql`
    SELECT id, title, description, category, "videoUrl", "thumbnailUrl",
           duration, language, "courseId"
    FROM "VideoLesson"
    WHERE id = ${params.id} AND "isPublished" = true
    LIMIT 1
  `.catch(() => []);

  if (!rows[0]) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json({ lesson: rows[0] });
}
