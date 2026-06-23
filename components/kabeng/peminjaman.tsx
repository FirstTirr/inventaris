"use client";
import React, { useState } from "react";
import { History, PlusCircle, X, Clock } from "lucide-react";

export default function Peminjaman({ navigateTo }: { navigateTo: (page: string) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    namaPeminjam: "",
    peran: "Murid",
    tanggalMulai: "",
    tanggalSelesai: "",
    barang: "",
    labor: "RPL",
  });

  // Data Dummy untuk peminjaman aktif (Belum dikembalikan)
  const activeData = [
    { id: 1, nama: "Ahmad Fauzi", peran: "Murid", barang: "Proyektor Epson", labor: "RPL", tglPinjam: "2026-06-23", tglKembali: "2026-06-25" },
    { id: 2, nama: "Bu Rina", peran: "Guru", barang: "Kamera Lumix", labor: "BC", tglPinjam: "2026-06-22", tglKembali: "2026-06-24" },
  ];

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Data Peminjaman Berhasil Disimpan!");
    setShowForm(false); // Tutup form setelah submit
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Peminjaman Aktif</h2>
          <p className="text-slate-500 mt-1 text-sm">Daftar barang yang sedang dipinjam dan belum dikembalikan.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md"
          >
            {showForm ? <X size={18} /> : <PlusCircle size={18} />}
            {showForm ? "Batal" : "Tambah Peminjaman"}
          </button>
          <button
            onClick={() => navigateTo("riwayat")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
          >
            <History size={18} />
            Riwayat
          </button>
        </div>
      </div>

      {/* Form Input (Muncul jika showForm == true) */}
      {showForm && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-blue-100 animate-slideDown mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Form Input Peminjaman Baru</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Nama Peminjam</label>
              <input type="text" name="namaPeminjam" required value={formData.namaPeminjam} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all" placeholder="Masukkan nama lengkap" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Status Peminjam</label>
              <select name="peran" value={formData.peran} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all">
                <option value="Murid">Murid (Siswa)</option>
                <option value="Guru">Guru / Instruktur</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-600">Barang yang Dipinjam</label>
              <input type="text" name="barang" required value={formData.barang} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all" placeholder="Contoh: Kamera Canon DSLR, Kabel LAN 5m, dll" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Asal Labor (Jurusan)</label>
              <select name="labor" value={formData.labor} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all">
                <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                <option value="DKV">Desain Komunikasi Visual (DKV)</option>
                <option value="TKJ">Teknik Komputer & Jaringan (TKJ)</option>
                <option value="BC">Broadcasting (BC)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 space-y-0">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Tanggal Pinjam</label>
                <input type="date" name="tanggalMulai" required value={formData.tanggalMulai} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Tanggal Kembali</label>
                <input type="date" name="tanggalSelesai" required value={formData.tanggalSelesai} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50" />
              </div>
            </div>
            <div className="md:col-span-2 pt-4">
              <button type="submit" className="w-full px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md">Simpan Data Peminjaman</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Peminjaman Aktif */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold rounded-tl-xl">Peminjam</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Barang</th>
                <th className="p-4 font-semibold">Labor</th>
                <th className="p-4 font-semibold">Tgl Pinjam</th>
                <th className="p-4 font-semibold">Batas Kembali</th>
                <th className="p-4 font-semibold text-center rounded-tr-xl">Status Pinjam</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {activeData.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{item.nama}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.peran === 'Guru' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.peran}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{item.barang}</td>
                  <td className="p-4 text-slate-500 font-semibold">{item.labor}</td>
                  <td className="p-4 text-slate-500">{item.tglPinjam}</td>
                  <td className="p-4 text-slate-500 font-medium text-red-500">{item.tglKembali}</td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                      <Clock size={14} /> Belum Kembali
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}