type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export default function TableSkeleton({
  rows = 5,
  columns = 6,
}: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-4 rounded-2xl border border-slate-100 px-4 py-3"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, c) => (
            <div
              key={c}
              className="h-4 w-full rounded-md bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
