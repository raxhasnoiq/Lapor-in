"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser({
      id: localStorage.getItem("user_id"),
      username: localStorage.getItem("username"),
      role: localStorage.getItem("role"),
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  const roleColor: Record<string, string> = {
    super_admin: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    admin: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    user: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-6">
      <div className="bg-[#161b27] border border-white/5 w-full max-w-sm rounded-2xl p-8 shadow-2xl">
        {/* AVATAR */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-black">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-black text-white mt-4">{user.username}</h1>
          {user.id && <p className="text-xs text-slate-500 mt-1">ID: {user.id}</p>}
          <span className={`mt-3 px-4 py-1.5 rounded-full text-xs font-semibold border ${roleColor[user.role] || roleColor.user}`}>
            {user.role}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => router.push("/reports")}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition text-white py-3 rounded-xl font-semibold text-sm"
          >
            Kembali ke Reports
          </button>
          <button
            onClick={() => router.push("/my-reports")}
            className="w-full border border-white/10 hover:bg-white/5 transition text-slate-300 py-3 rounded-xl font-semibold text-sm"
          >
            Laporan Saya
          </button>
          <button
            onClick={logout}
            className="w-full border border-red-500/20 hover:bg-red-500/10 transition text-red-400 py-3 rounded-xl font-semibold text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
