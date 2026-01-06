"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Customers", href: "/customers" },
  { label: "Projects", href: "/projects" },
  { label: "Sales Order", href: "/sales-orders" },
  { label: "Purchase Order", href: "/purchase-orders" },
  { label: "Warehousing", href: "/warehousing" },
  { label: "Accounts Receivable", href: "/accounts-receivable" },
  { label: "Generate Reports", href: "/generate-reports" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href === "/dashboard" && pathname === "/");

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/");
  };

  return (
    <aside className="relative flex-shrink-0">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed top-4 left-4 z-40 inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-3 py-2 text-sm shadow-lg md:hidden"
      >
        Menu
      </button>

      <div
        className={`
    fixed top-0 left-0 z-30 w-64 h-screen bg-white
    border-r border-slate-200
    transform transition-transform duration-200
    md:translate-x-0
    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 pt-6 pb-4 border-b border-slate-200">
            <div className="flex flex-col">
              <Image
                src="/polaris-logo.png"
                alt="Polaris Logo"
                width={200}
                height={200}
              />
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-4 flex-1 px-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
                className={`
                  w-full flex cursor-pointer items-center justify-start gap-2 rounded-xl px-3 py-2.5 text-sm
                  transition-colors
                  ${
                    isActive(item.href)
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="mt-auto border-t border-slate-200 px-4 py-4 space-y-2">
            <button
              type="button"
              className="w-full cursor-pointer inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-slate-800"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full cursor-pointer inline-flex items-center justify-center rounded-xl
             border border-slate-200 px-3 py-2 text-xs font-medium
             text-slate-600 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </aside>
  );
}
