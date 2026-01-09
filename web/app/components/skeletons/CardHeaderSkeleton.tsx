export default function CardHeaderSkeleton() {
  return (
    <div className="mb-6 space-y-3">
      <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
      <div className="h-5 w-48 rounded bg-slate-300 animate-pulse" />
    </div>
  );
}
