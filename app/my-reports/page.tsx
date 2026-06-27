"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function MyReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const getReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getReports();
  }, []);

  const statusColor: Record<string, string> = {
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    selesai: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  };

  const statusMessage: Record<string, string> = {
    approved: "Laporan sedang diproses oleh admin.",
    rejected: "Laporan ditolak karena data kurang lengkap.",
    pending: "Mohon tunggu verifikasi admin.",
    selesai: "Laporan telah selesai ditangani.",
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#161b27] border-b border-white/5">
        <h1 className="text-xl font-black text-indigo-400 tracking-tight">LAPORIN.</h1>
        <button
          onClick={() => router.push("/reports")}
          className="border border-white/10 text-slate-300 hover:bg-white/5 px-4 py-2 rounded-xl font-semibold text-sm transition"
        >
          ← Kembali
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Laporan Saya</h1>
          <p className="text-slate-400 mt-2 text-sm">Pantau perkembangan laporan yang telah kamu kirim.</p>
        </div>

        {reports.length === 0 ? (
          <div className="bg-[#161b27] border border-white/5 rounded-2xl p-16 text-center">
            <p className="text-slate-400 font-semibold">Belum ada laporan yang kamu kirim.</p>
            <button
              onClick={() => router.push("/create-report")}
              className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              Buat Laporan Pertama
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {reports.map((item: any) => (
              <div key={item.id} className="bg-[#161b27] border border-white/5 rounded-2xl overflow-hidden">
                {item.image && (
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    className="w-full h-48 object-cover"
                    alt="report"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-base font-bold text-white">{item.header}</h2>
                    <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${statusColor[item.status] || statusColor.pending}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
                  <div className="mt-5 bg-[#0f1117] border border-white/5 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-slate-400 mb-1">Respon Admin</p>
                    <p className="text-sm text-slate-300">{statusMessage[item.status] || statusMessage.pending}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
