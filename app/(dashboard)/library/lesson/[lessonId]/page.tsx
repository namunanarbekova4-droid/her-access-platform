import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VideoLessonPage } from "@/components/library/VideoLessonPage";

export default async function Page({ params }: { params: { lessonId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");
  return <VideoLessonPage lessonId={params.lessonId} />;
}
