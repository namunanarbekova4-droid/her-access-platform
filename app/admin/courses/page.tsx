import { AdminCourses } from "@/components/admin/AdminCourses";

export const metadata = { title: "Courses — Admin" };
export const dynamic = "force-dynamic";

export default function AdminCoursesPage() {
  return <AdminCourses />;
}
