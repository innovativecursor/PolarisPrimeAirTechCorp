/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchWithError } from "../lib/fetchData";
import endpoints from "../lib/endpoints";
import { useAuth } from "../components/auth/AuthContext";
import { useToast } from "./useToast";

type LoginResponse = {
  message: string;
  token: string;
  user?: {
    email?: string;
    name?: string;
    // add any other user fields your backend returns
  };
};

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const toast = useToast();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const email = (form.elements.namedItem("email") as HTMLInputElement)
        .value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        .value;

      const data = await fetchWithError<LoginResponse>(
        endpoints.auth.signInEmail,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      // 🔐 Save token for later API calls
      if (typeof window !== "undefined") {
        window.localStorage.setItem("authToken", data.token);
      }

      // optional: store user in context for header display
      setUser?.({
        email,
        name: data.user?.name ?? "Admin",
      });

      toast.success("Login successful! Redirecting...");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err?.message);
      toast.error(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading };
}
