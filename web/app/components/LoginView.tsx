"use client";

import { FormEvent } from "react";
import useLogin from "../hooks/useLogin";

export default function LoginView() {
  const { handleLogin, loading } = useLogin();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    void handleLogin(e);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
        <div className="grid gap-y-8 md:grid-cols-2">
          {/* Left panel */}
          <section className="bg-slate-50 px-7 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 flex flex-col justify-center">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase mb-6">
              Polaris Prime Air Tech Corp
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold leading-tight text-slate-900 mb-4">
              End-to-end visibility
              <span className="block">for every air conditioner</span>
              <span className="block">in your network.</span>
            </h1>

            <p className="text-sm sm:text-[15px] text-slate-500 max-w-md mb-8">
              Track procurement, warehouse levels, and service inventory from
              one secure workspace designed for HVAC distributors.
            </p>

            <div className="mt-auto">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-sm">
                <p className="font-semibold text-slate-900 mb-1">
                  Need access?
                </p>
                <p className="text-slate-500">
                  Contact the Polaris administrator to activate your user
                  profile.
                </p>
              </div>
            </div>
          </section>

          {/* Right panel */}
          <section
            aria-labelledby="login-heading"
            className="px-7 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 flex flex-col justify-center bg-white"
          >
            <div className="mb-8">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-slate-300 uppercase mb-2">
                User login
              </p>
              <h2
                id="login-heading"
                className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1"
              >
                Welcome back
              </h2>
              <p className="text-sm text-slate-400">
                Sign in with your Polaris Air Tech email to manage inventory.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              autoComplete="on"
              className="space-y-5"
              noValidate
            >
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Corporate email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="captain@polarisairtech.com"
                  defaultValue="vaishnav.parte@gmail.com"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  defaultValue="Admin@123"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-[13px]">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span>Keep me signed in</span>
                </label>

                <button
                  type="button"
                  className="self-start text-slate-500 hover:text-slate-900 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-[11px] sm:text-xs leading-relaxed text-slate-400">
              By continuing you agree to Polaris Air Tech&apos;s{" "}
              <span className="text-slate-500 font-medium">
                security policy
              </span>{" "}
              and{" "}
              <span className="text-slate-500 font-medium">
                compliance standards.
              </span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
