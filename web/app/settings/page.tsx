"use client";

import { useState } from "react";
import { Users, UserCheck, Shield } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import UserDirectory from "./components/userdirectory/UserDirectory";
import AccessControl from "./components/accesscontrol/AccessControl";
import RoleDirectory from "./components/roledirectory/RoleDirectory";

type Section = null | "user-directory" | "access-control" | "role-directory";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>(null);

  const settingsCards = [
    {
      key: "user-directory",
      title: "User Directory",
      desc: "View all registered users in the system",
      icon: Users,
      component: <UserDirectory />,
    },
    {
      key: "access-control",
      title: "Access Control",
      desc: "Approve, reject, or deactivate user accounts",
      icon: UserCheck,
      component: <AccessControl />,
    },
    {
      key: "role-directory",
      title: "Role Directory",
      desc: "View and manage roles & permissions",
      icon: Shield,
      component: <RoleDirectory />,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <section className=" bg-white border border-slate-200  md:rounded-[32px] rounded-md md:px-8 px-4 py-8 space-y-10">
          {activeSection === null ? (
            <>
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400">
                  Administration
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  User & Role Management
                </h2>
              </div>

              {/* Cards */}
              <div className="space-y-6">
                {settingsCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.key}
                      onClick={() => setActiveSection(item.key as Section)}
                      className="flex items-center justify-between rounded-[18px]
                       border cursor-pointer border-slate-300 bg-white px-6 md:py-6 py-4 hover:shadow-lg transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="md:h-10 md:w-10 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700">
                          <Icon size={18} />
                        </div>

                        <div>
                          <h3 className="md:text-xl font-semibold text-slate-900">
                            {item.title}
                          </h3>
                          <p className="md:text-sm text-xs mt-1 text-slate-600">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveSection(null)}
                className="mb-6 w-full md:text-start text-center text-sm font-medium cursor-pointer text-slate-600 hover:text-slate-900"
              >
                ← Back to Settings
              </button>

              {settingsCards.find((c) => c.key === activeSection)?.component}
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
