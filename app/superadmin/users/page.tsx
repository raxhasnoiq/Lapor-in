"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["user", "admin", "super_admin"];

const roleColor: Record<string, string> = {
  super_admin: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  admin: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  user: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "super_admin") {
      router.push("/");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: number, role: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Gagal mengubah role.");
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      showToast("Role berhasil diubah.");
    } catch {
      showToast("Terjadi kesalahan.");
    } finally {
      setUpdating(null);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#161b27] border-b border-white/5 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-indigo-400 tracking-tight">LAPORIN.</h1>
          <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full font-semibold">
            Super Admin
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin")}
            className="border border-white/10 text-slate-300 hover:bg-white/5 px-4 py-2 rounded-xl font-semibold text-sm transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="border border-white/10 text-slate-400 hover:bg-white/5 px-4 py-2 rounded-xl font-semibold text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-20 right-6 bg-[#1e2535] border border-white/10 text-slate-200 px-5 py-3 rounded-xl shadow-xl text-sm z-50 transition">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Manajemen User</h1>
          <p className="text-slate-400 mt-1 text-sm">Kelola role seluruh pengguna terdaftar.</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total User", value: users.length, color: "text-white" },
            { label: "Admin", value: users.filter((u) => u.role === "admin").length, color: "text-indigo-400" },
            { label: "Super Admin", value: users.filter((u) => u.role === "super_admin").length, color: "text-purple-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#161b27] border border-white/5 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
              <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Cari username atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#161b27] border border-white/10 text-white placeholder-slate-500 p-3.5 rounded-xl outline-none focus:border-indigo-500 transition text-sm"
          />
        </div>

        {/* TABLE */}
        <div className="bg-[#161b27] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-500 text-sm">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-sm">Tidak ada user ditemukan.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">ID</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">Username</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">Role Saat Ini</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">Ubah Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                  >
                    <td className="px-6 py-4 text-sm text-slate-500">{u.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{u.username}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleColor[u.role] || roleColor.user}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {ROLES.filter((r) => r !== u.role).map((r) => (
                          <button
                            key={r}
                            disabled={updating === u.id}
                            onClick={() => updateRole(u.id, r)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-40
                              ${r === "super_admin"
                                ? "bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25"
                                : r === "admin"
                                ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25"
                                : "bg-slate-500/15 text-slate-300 border border-slate-500/30 hover:bg-slate-500/25"
                              }`}
                          >
                            {updating === u.id ? "..." : `→ ${r}`}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
