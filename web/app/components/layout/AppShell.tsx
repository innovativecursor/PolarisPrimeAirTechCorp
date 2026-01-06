"use client";

import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
}
