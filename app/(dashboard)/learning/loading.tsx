import { Skeleton } from "@/components/ui/Skeleton";

export default function LearningLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-8 w-56 mb-2 rounded-2xl" />
        <Skeleton className="h-4 w-72 rounded-xl" />
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-3xl border border-border p-5 mb-6">
        <div className="flex justify-between mb-3">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-4 w-12 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Week cards */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-4 flex gap-4">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <Skeleton className="h-3 w-3/4 rounded-lg" />
            </div>
            <Skeleton className="w-6 h-6 rounded-lg flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
