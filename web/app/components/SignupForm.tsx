import { FormEvent } from "react";
import useSignup from "../hooks/useSignup";

export default function SignupForm({
  onBackToLogin,
}: {
  onBackToLogin: () => void;
}) {
  const { handleSignup, loading } = useSignup(onBackToLogin);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    void handleSignup(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <h2 className="text-xl font-semibold text-slate-900">Create account</h2>

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
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
          required
          placeholder="Create password"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl cursor-pointer bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onBackToLogin}
          className="font-medium text-slate-900 underline cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
