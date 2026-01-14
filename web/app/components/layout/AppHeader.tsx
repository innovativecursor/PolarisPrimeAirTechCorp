import { useAuth } from "../auth/AuthContext";

export default function AppHeader() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Admin";
  const displayEmail = user?.email || "-";
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-7">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
          Supplier Purchase Orders
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-slate-900">
          Polaris Prime Air Tech Corp
        </h1>
      </div>

      <div className="text-xs text-slate-500 text-right">
        <p className="uppercase tracking-[0.16em] text-slate-400 mb-1">
          Welcome back
        </p>
        <p className="font-medium text-slate-700">{displayEmail}</p>
        <p className="font-medium text-slate-700">{displayName}</p>
      </div>
    </header>
  );
}
