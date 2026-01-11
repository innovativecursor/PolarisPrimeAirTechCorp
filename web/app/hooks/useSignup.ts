/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from "react";
import { fetchWithError } from "../lib/fetchData";
import { useToast } from "./useToast";
import endpoints from "../lib/endpoints";

type SignupResponse = {
  message: string;
};

export default function useSignup(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const email = (form.elements.namedItem("email") as HTMLInputElement)
        .value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        .value;

      const res = await fetchWithError<SignupResponse>(
        endpoints.auth.signUpEmail,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      toast.success(res.message);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return { handleSignup, loading };
}
