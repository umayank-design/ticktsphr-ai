"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <form
        onSubmit={handleLogin}
        className="bg-slate-900 p-8 rounded-xl w-full max-w-md border border-slate-800"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Login
        </h1>

        <p className="text-cyan-400 mb-6">
          Welcome back to Ticktsphr AI
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-cyan-500 text-black py-3 rounded font-semibold hover:bg-cyan-400"
        >
          Login
        </button>

        <div className="flex justify-between text-sm mt-5">
          <Link href="/signup" className="text-cyan-400">
            Create account
          </Link>

          <Link href="/forgot-password" className="text-slate-400">
            Forgot password?
          </Link>
        </div>
      </form>
    </main>
  );
}