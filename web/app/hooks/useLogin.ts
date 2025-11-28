"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      //
      // const form = e.currentTarget;
      // const email = (form.elements.namedItem("email") as HTMLInputElement).value;
      // const password = (form.elements.namedItem("password") as HTMLInputElement).value;
      //
      // const res = await fetch("/api/auth/signin", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      //
      // if (!res.ok) throw new Error("Login failed");
      // const data = await res.json();
      // // save token, etc.

      // Fake tiny delay so the loading state is visible
      await new Promise((resolve) => setTimeout(resolve, 400));

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading };
}
