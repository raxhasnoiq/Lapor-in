"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DetailReportPage() {
  const params = useParams();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [reply, setReply] = useState("");

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    const getDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reports/${params.id}`);
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.log(err);
      }
    };

    const getReplies = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reports/${params.id}/replies`);
        const data = await res.json();
        setReplies(data);
      } catch (err) {
        console.log(err);
      }
    };

    getDetail();
    getReplies();
  }, []);

  const sendReply = async () => {
    try {
      const user_id = 1;
      await fetch(`http://localhost:5000/api/reports/${params.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply, user_id }),
      });
      const res = await fetch(`http://localhost:5000/api/reports/${params.id}/replies`);
      const data = await res.json();
      setReplies(data);
      setReply("");
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await fetch(`http://localhost:5000/api/reports/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setReport({ ...report, status });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteReport = async () => {
    if (!confirm("Yakin mau hapus laporan ini?")) return;
    try {
      await fetch(`http://localhost:5000/api/reports/${params.id}`, { method: "DELETE" });
      router.push("/reports");
    } catch (err) {
      console.log(err);
    }
  };

  const statusColor: Record<string, string> = {
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    selesai: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-slate-400 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#161b27] border-b border-white/5 sticky top-0 z-10">
        <h1 className="text-xl font-black text-indigo-400 tracking-tight">LAPORIN.</h1>
        <button
          onClick={() => router.back()}
          className="border border-white/10 text-slate-300 hover:bg-white/5 px-4 py-2 rounded-xl font-semibold text-sm transition"
        >
          ← Kembali
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* GAMBAR */}
        <div className="rounded-2xl overflow-hidden mb-6">
          {report.image ? (
            <img
              src={`http://localhost:5000/uploads/${report.image}`}
              alt="report"
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="w-full h-72 bg-[#1e2535] flex items-center justify-center text-slate-500 text-sm font-semibold">
              Tidak ada gambar
            </div>
          )}
        </div>

        {/* KONTEN */}
        <div className="bg-[#161b27] border border-white/5 rounded-2xl p-8">
          {/* BADGES */}
          <div className="flex gap-2 mb-5 flex-wrap">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold">
              {report.category_name}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor[report.status] || statusColor.pending}`}>
              {report.status}
            </span>
          </div>

          {/* JUDUL & ISI */}
          <h1 className="text-3xl font-black text-white">{report.header}</h1>
          <p className="text-slate-400 mt-4 leading-relaxed text-sm">{report.body}</p>

          {/* TOMBOL ADMIN */}
          {(role === "admin" || role === "super_admin") && (
            report.status === "selesai" ? (
              <div className="mt-8 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300">
                ✓ Laporan ini sudah selesai dan tidak dapat diubah lagi.
              </div>
            ) : (
              <div className="flex gap-3 mt-8 flex-wrap">
                <button
                  onClick={() => updateStatus("approved")}
                  className="bg-emerald-600/80 hover:bg-emerald-600 transition text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus("rejected")}
                  className="bg-amber-500/80 hover:bg-amber-500 transition text-white px-5 py-2.5 rounded-xl font-semibold text-sm"
                >
                  Reject
                </button>
                <button
                  onClick={deleteReport}
                  className="bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 transition text-red-400 px-5 py-2.5 rounded-xl font-semibold text-sm"
                >
                  Hapus
                </button>
              </div>
            )
          )}

          {/* TOMBOL USER - selesaikan laporan jika sudah approved */}
          {role === "user" && report.status === "approved" && (
            <div className="mt-8">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4 text-sm text-emerald-400">
                Laporan ini telah disetujui admin. Apakah masalah sudah terselesaikan?
              </div>
              <button
                onClick={() => updateStatus("selesai")}
                className="bg-emerald-600 hover:bg-emerald-500 transition text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
              >
                ✓ Tandai Selesai
              </button>
            </div>
          )}

          {/* INFO jika sudah selesai */}
          {report.status === "selesai" && (
            <div className="mt-8 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300">
              ✓ Laporan ini telah diselesaikan.
            </div>
          )}

          {/* PELAPOR & TANGGAL */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500">Pelapor</p>
              <p className="text-sm font-bold text-slate-200 mt-0.5">{report.username}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Tanggal</p>
              <p className="text-sm font-bold text-slate-200 mt-0.5">
                {new Date(report.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* REPLIES */}
        <div className="mt-6 bg-[#161b27] border border-white/5 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">Balasan Admin</h2>

          {(role === "admin" || role === "super_admin") && (
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Tulis balasan..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1 bg-[#0f1117] border border-white/10 text-white placeholder-slate-500 p-3.5 rounded-xl outline-none focus:border-indigo-500 transition text-sm"
              />
              <button
                onClick={sendReply}
                className="bg-indigo-600 hover:bg-indigo-500 transition text-white px-5 rounded-xl font-semibold text-sm"
              >
                Kirim
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {replies.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">Belum ada balasan.</p>
            ) : (
              replies.map((item: any) => (
                <div key={item.id} className="bg-[#0f1117] border border-white/5 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-white">{item.username}</span>
                    <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{item.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
