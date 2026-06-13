import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto pb-24 lg:pb-8">
      {/* Hero card */}
      <Skeleton className="h-36 mb-6 rounded-3xl" />

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-36 rounded-3xl" />
        <Skeleton className="h-36 rounded-3xl" />
      </div>

      {/* Quick actions strip */}
      <div className="mb-6">
        <Skeleton className="h-3 w-20 mb-3 rounded-full" />
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-44 rounded-3xl" />
        <Skeleton className="h-44 rounded-3xl" />
      </div>
    </div>
  );
}
