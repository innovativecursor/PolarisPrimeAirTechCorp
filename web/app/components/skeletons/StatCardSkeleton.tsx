export default function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-4 space-y-3">
      <div className="h-3 w-24 bg-slate-200 rounded" />
      <div className="h-7 w-20 bg-slate-200 rounded" />
      <div className="h-3 w-32 bg-slate-200 rounded" />
      <div className="h-3 w-16 bg-slate-200 rounded" />
    </div>
  );
}
