"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      alert("Reset session missing. Please open the reset link from your email again.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully.");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <form
        onSubmit={handleUpdatePassword}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Reset Password
        </h1>

        <p className="text-slate-400 mb-6">
          Enter your new password.
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-cyan-500 text-black py-3 rounded font-semibold">
          Update Password
        </button>
      </form>
    </main>
  );
}