import { AdminVideos } from "@/components/admin/AdminVideos";

export const metadata = { title: "Videos — Admin" };
export const dynamic = "force-dynamic";

export default function AdminVideosPage() {
  return <AdminVideos />;
}
