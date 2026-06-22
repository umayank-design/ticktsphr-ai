"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset link sent. Please check your email.");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <form
        onSubmit={handleReset}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Forgot Password
        </h1>

        <p className="text-slate-400 mb-6">
          Enter your email address and we'll send you a reset link.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full bg-cyan-500 text-black py-3 rounded font-semibold">
          Send Reset Link
        </button>

        <Link
          href="/login"
          className="block text-center text-cyan-400 text-sm mt-6"
        >
          Back to Login
        </Link>
      </form>
    </main>
  );
}