import { Skeleton } from "@/components/ui/Skeleton";

export default function MentorLoading() {
  return (
    <div className="flex flex-col h-screen lg:h-[calc(100vh-0px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-white">
        <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-28 rounded-lg" />
          <Skeleton className="h-3 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-28 rounded-2xl" />
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* AI message */}
        <div className="flex gap-3 max-w-md">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full rounded-xl" />
            <Skeleton className="h-4 w-4/5 rounded-xl" />
            <Skeleton className="h-4 w-3/5 rounded-xl" />
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="flex gap-2 flex-wrap mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-36 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-border p-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}
