"use client";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col px-4 py-4">
      {children}
    </div>
  );
}
