"use client";

import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1 min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
