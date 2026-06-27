"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    router.push("/login");
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin" && role !== "super_admin") {
      router.push("/");
      return;
    }

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

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteReport = async (id: number) => {
    if (!confirm("Yakin mau hapus laporan ini?")) return;
    try {
      await fetch(`http://localhost:5000/api/reports/${id}`, { method: "DELETE" });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const pending = reports.filter((r) => r.status === "pending");
  const approved = reports.filter((r) => r.status === "approved");
  const rejected = reports.filter((r) => r.status === "rejected");
  const selesai = reports.filter((r) => r.status === "selesai");

  const statusColor: Record<string, string> = {
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    selesai: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  };

  const renderCard = (item: any) => (
    <div
      key={item.id}
      className="bg-[#1e2535] border border-white/5 rounded-2xl p-6 flex justify-between items-start gap-6 hover:border-white/10 transition"
    >
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold">
            {item.category_name}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor[item.status] || statusColor.pending}`}>
            {item.status}
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">{item.header}</h2>
        <p className="mt-2 text-slate-400 text-sm leading-relaxed line-clamp-2">{item.body}</p>
        <p className="mt-3 text-xs text-slate-500">
          Pelapor: <span className="text-slate-300 font-semibold">{item.username}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={() => router.push(`/reports/${item.id}`)}
          className="bg-indigo-600 hover:bg-indigo-500 transition text-white px-4 py-2 rounded-xl font-semibold text-xs"
        >
          Detail
        </button>
        {item.status !== "selesai" && (
          <>
            <button
              onClick={() => updateStatus(item.id, "approved")}
              className="bg-emerald-600/80 hover:bg-emerald-600 transition text-white px-4 py-2 rounded-xl font-semibold text-xs"
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus(item.id, "rejected")}
              className="bg-amber-500/80 hover:bg-amber-500 transition text-white px-4 py-2 rounded-xl font-semibold text-xs"
            >
              Reject
            </button>
            <button
              onClick={() => deleteReport(item.id)}
              className="bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 transition text-red-400 px-4 py-2 rounded-xl font-semibold text-xs"
            >
              Hapus
            </button>
          </>
        )}
      </div>
    </div>
  );

  const Section = ({ title, color, items }: { title: string; color: string; items: any[] }) => (
    <div className="mt-10">
      <h2 className={`text-lg font-bold mb-4 ${color}`}>
        {title} <span className="text-slate-500 font-normal">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <div className="bg-[#161b27] border border-white/5 rounded-2xl p-8 text-center text-slate-500 text-sm">
          Tidak ada laporan.
        </div>
      ) : (
        <div className="flex flex-col gap-3">{items.map(renderCard)}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#161b27] border-b border-white/5 sticky top-0 z-10">
        <h1 className="text-xl font-black text-indigo-400 tracking-tight">LAPORIN. <span className="text-slate-500 font-normal text-sm">Admin</span></h1>
        <div className="flex gap-3">
          {typeof window !== "undefined" && localStorage.getItem("role") === "super_admin" && (
            <button
              onClick={() => router.push("/superadmin/users")}
              className="bg-purple-500/15 border border-purple-500/30 text-purple-400 hover:bg-purple-500/25 px-4 py-2 rounded-xl font-semibold text-sm transition"
            >
              Manajemen User
            </button>
          )}
          <button
            onClick={logout}
            className="border border-white/10 text-slate-400 hover:bg-white/5 px-4 py-2 rounded-xl font-semibold text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Dashboard Admin</h1>
          <p className="text-slate-400 mt-1 text-sm">Kelola seluruh laporan masyarakat.</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Total", value: reports.length, color: "text-white" },
            { label: "Pending", value: pending.length, color: "text-amber-400" },
            { label: "Approved", value: approved.length, color: "text-emerald-400" },
            { label: "Rejected", value: rejected.length, color: "text-red-400" },
            { label: "Selesai", value: selesai.length, color: "text-indigo-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#161b27] border border-white/5 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
              <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <Section title="Pending" color="text-amber-400" items={pending} />
        <Section title="Approved" color="text-emerald-400" items={approved} />
        <Section title="Rejected" color="text-red-400" items={rejected} />
        <Section title="Selesai" color="text-indigo-400" items={selesai} />
      </div>
    </div>
  );
}
