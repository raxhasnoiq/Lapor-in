"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateReportPage() {
  const router = useRouter();
  const [form, setForm] = useState({ header: "", body: "", category_id: "" });
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("header", form.header);
      formData.append("body", form.body);
      formData.append("category_id", form.category_id);
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/reports", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push("/reports");
    } catch {
      setError("Gagal membuat laporan. Pastikan semua field terisi.");
    } finally {
      setLoading(false);
    }
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

      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Buat Laporan</h1>
          <p className="text-slate-400 mt-2 text-sm">Laporkan masalah lingkungan atau fasilitas umum.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#161b27] border border-white/5 p-8 rounded-2xl space-y-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-1.5">Judul Laporan</label>
            <input
              type="text"
              placeholder="Masukkan judul laporan"
              className="w-full bg-[#0f1117] border border-white/10 text-white placeholder-slate-500 p-3.5 rounded-xl outline-none focus:border-indigo-500 transition text-sm"
              onChange={(e) => setForm({ ...form, header: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-1.5">Isi Laporan</label>
            <textarea
              placeholder="Jelaskan masalah secara detail..."
              className="w-full bg-[#0f1117] border border-white/10 text-white placeholder-slate-500 p-3.5 rounded-xl outline-none focus:border-indigo-500 transition text-sm h-40 resize-none"
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-1.5">Kategori</label>
            <select
              className="w-full bg-[#0f1117] border border-white/10 text-white p-3.5 rounded-xl outline-none focus:border-indigo-500 transition text-sm"
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Pilih kategori</option>
              <option value="1">Infrastruktur</option>
              <option value="2">Keamanan</option>
              <option value="3">Kebersihan</option>
              <option value="4">Bencana Alam</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-1.5">Upload Gambar (opsional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-[#0f1117] border border-white/10 text-slate-400 p-3.5 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-xs file:font-semibold hover:file:bg-indigo-500 file:cursor-pointer"
              onChange={(e: any) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition mt-2"
          >
            {loading ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </form>
      </div>
    </div>
  );
}
