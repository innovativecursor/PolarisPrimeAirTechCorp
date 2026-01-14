"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type AuthUser = {
  id?: string;
  name?: string;
  email: string;
  role?: string;
};

export type MenuItem = {
  id: string;
  label: string;
  href: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  menus: MenuItem[];
  setUser: (u: AuthUser | null) => void;
  setMenus: (m: MenuItem[]) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "polaris-auth-user";
const MENUS_STORAGE_KEY = "polaris-auth-menus";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as AuthUser;
      }
    } catch {
      // ignore bad JSON
    }
    return null;
  });
  const [menus, setMenusState] = useState<MenuItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(MENUS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as MenuItem[];
      }
    } catch {
      // ignore bad JSON
    }
    return [];
  });

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
    if (typeof window === "undefined") return;

    if (u) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const setMenus = (m: MenuItem[]) => {
    setMenusState(m);
    if (typeof window === "undefined") return;

    if (m && m.length > 0) {
      window.localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify(m));
    } else {
      window.localStorage.removeItem(MENUS_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, menus, setUser, setMenus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
