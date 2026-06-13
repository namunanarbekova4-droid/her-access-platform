import { Skeleton } from "@/components/ui/Skeleton";

export default function CirclesLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto pb-24 lg:pb-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-40 mb-2 rounded-2xl" />
        <Skeleton className="h-4 w-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-border p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-3 w-full rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-9 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
