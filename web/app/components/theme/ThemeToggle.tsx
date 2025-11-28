"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

type Mode = "light" | "dark" | "auto";

const STORAGE_KEY = "polaris-theme-mode";

function computeTimeBasedTheme(): "light" | "dark" {
  const hour = new Date().getHours();
  // tweak these hours as you like:
  return hour >= 19 || hour < 7 ? "dark" : "light";
}

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  // Use useSyncExternalStore to safely read from localStorage
  const mode = useSyncExternalStore(
    (callback) => {
      // Subscribe to storage events
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      // Get client-side snapshot
      return (
        (window.localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "auto"
      );
    },
    () => {
      // Get server-side snapshot
      return "auto";
    }
  );

  // Synchronize theme with external system (next-themes)
  useEffect(() => {
    if (mode === "auto") {
      setTheme(computeTimeBasedTheme());
    } else {
      setTheme(mode);
    }
  }, [setTheme, mode]);

  const handleModeChange = (nextMode: Mode) => {
    window.localStorage.setItem(STORAGE_KEY, nextMode);

    if (nextMode === "auto") {
      setTheme(computeTimeBasedTheme());
    } else {
      setTheme(nextMode);
    }

    // Trigger a re-render by dispatching a storage event
    window.dispatchEvent(new Event("storage"));
  };

  const baseButton =
    "inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors";

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 px-2 py-1 shadow-sm backdrop-blur">
      <span className="px-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
        Theme
      </span>

      <button
        type="button"
        onClick={() => handleModeChange("light")}
        className={`${baseButton} ${
          mode === "light"
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-transparent text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        Light
      </button>

      <button
        type="button"
        onClick={() => handleModeChange("dark")}
        className={`${baseButton} ${
          mode === "dark"
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-transparent text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        Dark
      </button>

      <button
        type="button"
        onClick={() => handleModeChange("auto")}
        className={`${baseButton} ${
          mode === "auto"
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-transparent text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        Auto
      </button>
    </div>
  );
}
