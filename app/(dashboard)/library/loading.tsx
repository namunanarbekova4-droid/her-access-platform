import { Skeleton } from "@/components/ui/Skeleton";

export default function LibraryLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2 rounded-2xl" />
        <Skeleton className="h-4 w-80 rounded-xl" />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-border overflow-hidden">
            <Skeleton className="h-28 rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-full rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded-lg" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
