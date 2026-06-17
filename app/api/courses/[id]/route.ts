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

  const [courseRows, materialRows, lessonRows] = await Promise.all([
    sql`SELECT * FROM "Course" WHERE id = ${params.id} LIMIT 1`.catch(() => []),
    sql`
      SELECT * FROM "LibraryItem"
      WHERE "courseId" = ${params.id}
      ORDER BY "weekNumber" ASC NULLS LAST, "createdAt" ASC
    `.catch(() => []),
    sql`
      SELECT * FROM "VideoLesson"
      WHERE "courseId" = ${params.id} AND "isPublished" = true
      ORDER BY "weekNumber" ASC NULLS LAST, "sortOrder" ASC
    `.catch(() => []),
  ]);

  if (!courseRows[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const course = {
    ...courseRows[0],
    materials: materialRows,
    lessons: lessonRows,
  };

  return NextResponse.json({ course });
}
