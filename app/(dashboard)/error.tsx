"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          We ran into an unexpected problem. This is on us — please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-brand-purple text-white rounded-2xl text-sm font-medium hover:bg-brand-purple-light transition-colors"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-brand-lavender-light text-brand-purple rounded-2xl text-sm font-medium hover:bg-brand-lavender transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
