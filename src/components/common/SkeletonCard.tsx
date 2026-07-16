export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-none border border-border-light bg-card p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-background-secondary" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-background-secondary" />
          <div className="h-2 w-1/4 rounded bg-background-secondary" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-3/4 rounded bg-background-secondary" />
        <div className="h-3 w-full rounded bg-background-secondary" />
        <div className="h-3 w-2/3 rounded bg-background-secondary" />
      </div>
    </div>
  );
}
