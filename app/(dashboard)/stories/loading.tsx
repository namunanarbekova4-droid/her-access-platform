import { Skeleton } from "@/components/ui/Skeleton";

export default function StoriesLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto pb-24 lg:pb-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2 rounded-2xl" />
        <Skeleton className="h-4 w-72 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-border overflow-hidden">
            <Skeleton className="h-32 rounded-none" />
            <div className="p-5 space-y-2">
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-full rounded-lg" />
              <Skeleton className="h-3 w-5/6 rounded-lg" />
              <Skeleton className="h-3 w-4/6 rounded-lg" />
              <div className="flex items-center gap-2 pt-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="h-3 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
