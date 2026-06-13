import { Skeleton } from "@/components/ui/Skeleton";

export default function NewsLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto pb-24 lg:pb-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-44 mb-2 rounded-2xl" />
        <Skeleton className="h-4 w-64 rounded-xl" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-24 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-5 w-4/5 mb-2 rounded-lg" />
            <Skeleton className="h-3 w-full rounded-lg mb-1" />
            <Skeleton className="h-3 w-5/6 rounded-lg mb-1" />
            <Skeleton className="h-3 w-3/4 rounded-lg" />
            <div className="flex gap-3 mt-4">
              <Skeleton className="h-7 w-16 rounded-2xl" />
              <Skeleton className="h-7 w-16 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
