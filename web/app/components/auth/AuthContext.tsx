"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type AuthUser = {
  id?: string;
  name?: string;
  email: string;
  role?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "polaris-auth-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  // hydrate from localStorage on client using lazy initializer
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

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
    if (typeof window === "undefined") return;

    if (u) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
