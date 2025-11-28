"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeToggle from "./ThemeToggle";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center px-4 py-8 gap-6">
        <div className="w-full max-w-5xl flex justify-end"></div>

        {/* main page content */}
        {children}
      </div>
    </NextThemesProvider>
  );
}
