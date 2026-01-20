export default function ChartSkeleton({ height = "h-56" }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-100 ${height}`}
    />
  );
}
