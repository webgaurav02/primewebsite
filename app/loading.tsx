import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

/**
 * Shown by Next.js while a page segment is streaming / hydrating.
 * Mirrors the rough layout of a typical inner page so there's no flash of blank screen.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]" aria-label="Loading page content" role="status">
      {/* Navbar skeleton */}
      <div className="sticky top-0 h-[64px] border-b border-white/[0.06] bg-[#0a0a0a] flex items-center px-6 lg:px-10">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Hero skeleton */}
      <div className="relative overflow-hidden min-h-[60vh] flex items-center px-6 lg:px-10">
        <div className="max-w-7xl mx-auto w-full py-24 space-y-8">
          <Skeleton className="h-4 w-56" />
          <div className="space-y-4">
            <Skeleton className="h-20 md:h-28 w-3/4" />
            <Skeleton className="h-20 md:h-28 w-1/2" />
            <Skeleton className="h-20 md:h-28 w-2/5" />
          </div>
          <SkeletonText lines={2} className="max-w-xs" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
      </div>

      {/* Content grid skeleton */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="space-y-4 p-6 rounded-sm bg-white/[0.03]">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-3/4" />
              <SkeletonText lines={3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
