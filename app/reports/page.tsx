"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    router.push("/login");
  };

  useEffect(() => {
    const getReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports");
        const data = await res.json();
        if (Array.isArray(data)) setReports(data);
      } catch (err) {
        console.log(err);
      }
    };
    getReports();
  }, []);

  const filteredReports = reports.filter((item: any) =>
    item.header.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    selesai: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#161b27] border-b border-white/5 sticky top-0 z-10">
        <h1 className="text-xl font-black text-indigo-400 tracking-tight">LAPORIN.</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/create-report")}
            className="bg-indigo-600 hover:bg-indigo-500 transition text-white px-4 py-2 rounded-xl font-semibold text-sm"
          >
            + Buat Laporan
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="border border-white/10 text-slate-300 hover:bg-white/5 px-4 py-2 rounded-xl font-semibold text-sm transition"
          >
            Profile
          </button>
          <button
            onClick={logout}
            className="border border-white/10 text-slate-400 hover:bg-white/5 px-4 py-2 rounded-xl font-semibold text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white">Laporan Masyarakat</h1>
          <p className="text-slate-400 mt-2">Seluruh laporan masyarakat terbaru</p>
        </div>

        {/* SEARCH */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#161b27] border border-white/10 text-white placeholder-slate-500 p-4 rounded-xl outline-none focus:border-indigo-500 transition text-sm"
          />
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-5">
          {filteredReports.map((item: any) => (
            <div
              key={item.id}
              className="bg-[#161b27] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition"
            >
              {item.image ? (
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt="report"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-[#1e2535] flex items-center justify-center text-slate-600 text-sm font-semibold">
                  Tidak ada gambar
                </div>
              )}

              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                    {item.category_name}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor[item.status] || statusColor.pending}`}>
                    {item.status}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white">{item.header}</h2>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed line-clamp-3">{item.body}</p>

                <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-xs text-slate-500">Pelapor</p>
                    <p className="text-sm font-semibold text-slate-300">{item.username}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/reports/${item.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-500 transition text-white px-4 py-2 rounded-xl font-semibold text-sm"
                  >
                    Detail →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg font-semibold">Tidak ada laporan ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
