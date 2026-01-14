"use client";

import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden ">
      <Sidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 overflow-y-auto">
        <AppHeader />
        {children}
      </main>
    </div>
  );
}
