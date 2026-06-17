import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { CourseDetail } from "@/components/library/CourseDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { courseId: string } }) {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT title FROM "Course" WHERE id = ${params.courseId} LIMIT 1`.catch(() => []);
  const title = (rows[0]?.title as string) ?? null;
  return { title: title ? `${title} — Her Access` : "Course" };
}

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const sql = neon(process.env.DATABASE_URL!);

  const [courseRows, materialRows, videoRows] = await Promise.all([
    sql`SELECT * FROM "Course" WHERE id = ${params.courseId} AND "isPublished" = true LIMIT 1`.catch(() => []),
    sql`SELECT * FROM "LibraryItem" WHERE "courseId" = ${params.courseId} ORDER BY "weekNumber" ASC NULLS LAST, "createdAt" ASC`.catch(() => []),
    sql`SELECT * FROM "VideoLesson" WHERE "courseId" = ${params.courseId} AND "isPublished" = true ORDER BY "weekNumber" ASC NULLS LAST, "sortOrder" ASC`.catch(() => []),
  ]);

  if (!courseRows[0]) notFound();

  const dbRow = courseRows[0];
  let aiLessons: unknown[] | null = null;
  try {
    if (dbRow.lessons) aiLessons = JSON.parse(dbRow.lessons as string) as unknown[];
  } catch { /* ignore */ }

  const course = {
    id: dbRow.id as string,
    title: dbRow.title as string,
    description: dbRow.description as string,
    category: dbRow.category as string,
    totalWeeks: dbRow.totalWeeks as number,
    difficulty: dbRow.difficulty as string,
    imageEmoji: dbRow.imageEmoji as string,
    language: (dbRow.language as string) ?? "en",
    aiLessons,
    materials: materialRows as Array<{ id: string; title: string; content: string; weekNumber: number | null; type: string | null }>,
    videoLessons: videoRows as Array<{ id: string; title: string; videoUrl: string; duration: string | null; weekNumber: number | null }>,
  };

  return <CourseDetail course={course} />;
}
