import { AdminUsers } from "@/components/admin/AdminUsers";

export const metadata = { title: "Users — Admin" };
export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return <AdminUsers />;
}
