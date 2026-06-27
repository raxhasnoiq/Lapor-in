"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
      if (response.data.role === "admin" || response.data.role === "super_admin") {
        router.push("/admin");
      } else {
        router.push("/reports");
      }
    } catch {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-indigo-400 tracking-tight">LAPORIN.</h1>
          <p className="text-slate-400 mt-2 text-sm">Masuk ke akun Anda</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-[#161b27] border border-white/5 p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Login</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-semibold text-slate-300 block mb-1.5">Email</label>
            <input
              type="email"
              placeholder="email@contoh.com"
              className="w-full bg-[#0f1117] border border-white/10 text-white placeholder-slate-500 p-3.5 rounded-xl outline-none focus:border-indigo-500 transition text-sm"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-300 block mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#0f1117] border border-white/10 text-white placeholder-slate-500 p-3.5 rounded-xl outline-none focus:border-indigo-500 transition text-sm"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>

          <p className="text-center text-slate-500 mt-5 text-sm">
            Belum punya akun?{" "}
            <a href="/register" className="text-indigo-400 font-semibold hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
