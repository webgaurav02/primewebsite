interface SkeletonProps {
  className?: string;
}

/** Base shimmer block — wrap any shape with this */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2px] bg-white/[0.06] ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </div>
  );
}

/** Stack of text-line skeletons — last line is 2/3 width */
export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/** Portrait card skeleton — matches aspect-[3/4] entrepreneur grid cards */
export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div className={className} aria-hidden="true">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="p-3 flex flex-col gap-2 mt-1">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
