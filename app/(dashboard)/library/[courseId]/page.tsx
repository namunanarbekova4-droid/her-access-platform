import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseDetail } from "@/components/library/CourseDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { courseId: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    select: { title: true },
  });
  return { title: course ? `${course.title} — Her Access` : "Course" };
}

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: params.courseId, isPublished: true },
    include: {
      materials: {
        orderBy: [{ weekNumber: "asc" }, { createdAt: "asc" }],
      },
      lessons: {
        where: { isPublished: true },
        orderBy: [{ weekNumber: "asc" }, { sortOrder: "asc" }],
      },
    },
  });

  if (!course) notFound();

  return <CourseDetail course={course} />;
}
