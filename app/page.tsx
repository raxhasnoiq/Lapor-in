"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1117]">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-5 bg-[#161b27] border-b border-white/5 shadow-lg">
        <h1 className="text-2xl font-black text-indigo-400 tracking-tight">
          LAPORIN.
        </h1>
        <div className="flex gap-3">
          <Link href="/login">
            <button className="px-5 py-2.5 rounded-xl border border-indigo-500/50 text-indigo-400 font-semibold hover:bg-indigo-500/10 transition text-sm">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition text-sm">
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-10 py-24 max-w-5xl mx-auto">
        <div className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Platform Pengaduan Digital
        </div>
        <h1 className="text-6xl font-black text-white leading-tight">
          Suara Anda,<br />
          <span className="text-indigo-400">Kami Dengar.</span>
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
          Platform pelaporan masyarakat modern untuk menyampaikan
          keluhan, kerusakan, dan permasalahan lingkungan secara cepat dan transparan.
        </p>
        <div className="flex gap-4 mt-10">
          <Link href="/create-report">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition">
              Buat Laporan
            </button>
          </Link>
          <Link href="/reports">
            <button className="border border-white/10 text-slate-300 hover:bg-white/5 px-8 py-4 rounded-2xl transition font-semibold">
              Lihat Laporan
            </button>
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-5 mt-20">
          {[
            { label: "Laporan Masuk", value: "1.2K+" },
            { label: "Ditangani", value: "89%" },
            { label: "Kategori", value: "4" },
          ].map((s) => (
            <div key={s.label} className="bg-[#161b27] border border-white/5 rounded-2xl p-6">
              <p className="text-3xl font-black text-indigo-400">{s.value}</p>
              <p className="text-slate-400 mt-1 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
