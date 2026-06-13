import { Skeleton } from "@/components/ui/Skeleton";

export default function ReviewsLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto pb-24 lg:pb-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-40 mb-2 rounded-2xl" />
        <Skeleton className="h-4 w-64 rounded-xl" />
      </div>

      {/* Write review skeleton */}
      <div className="bg-white rounded-3xl border border-border p-5 mb-6 space-y-3">
        <Skeleton className="h-5 w-36 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-7 h-7 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-9 w-28 rounded-2xl" />
      </div>

      {/* Review cards */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-border p-5 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-lg" />
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="w-4 h-4 rounded" />
                ))}
              </div>
            </div>
            <Skeleton className="h-3 w-full rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
