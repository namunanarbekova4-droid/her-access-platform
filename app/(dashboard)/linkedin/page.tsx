import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LinkedInFormatter } from "@/components/linkedin/LinkedInFormatter";

export const metadata = { title: "LinkedIn Profile Builder" };

export default async function LinkedInPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return <LinkedInFormatter />;
}
