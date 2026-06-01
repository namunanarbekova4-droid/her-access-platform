import { ReviewsPage } from "@/components/reviews/ReviewsPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Reviews — Her Access" };
export const dynamic = "force-dynamic";

export default async function ReviewsRoute() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return <ReviewsPage currentUserId={session.user.id} />;
}
