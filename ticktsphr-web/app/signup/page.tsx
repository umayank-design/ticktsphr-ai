"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully. Please login.");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <form
        onSubmit={handleSignup}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Create Ticktsphr Account
        </h1>

        <p className="text-slate-400 mb-6">
          Start building your AI incident workspace.
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

        <button className="w-full bg-cyan-500 text-black py-3 rounded font-semibold">
          Create Account
        </button>

        <p className="text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}