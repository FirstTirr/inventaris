"use client";
import React, { useState, useEffect } from "react";
import { Wrench, PlusCircle, X, Receipt, Calendar, User as UserIcon } from "lucide-react";

export default function Perbaikan() {
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState("Memuat...");
  const [formData, setFormData] = useState({
    barang: "",
    tanggalPerbaikan: "",
    biaya: "",
  });

  // Ambil data username yang sedang login saat komponen dimuat
  useEffect(() => {
    // Menyesuaikan dengan key di local storage Anda (biasanya 'user' atau ambil dari decode token)
    const storedUser = localStorage.getItem("user") || "User Tidak Diketahui";
    setCurrentUser(storedUser);
  }, []);

  // Data Dummy untuk tabel perbaikan (Nanti diganti dengan fetch API)
  const [dataPerbaikan, setDataPerbaikan] = useState([
    { id: 1, barang: "Proyektor Epson L310", penginput: "kabeng", tgl: "2026-06-20", biaya: 350000 },
    { id: 2, barang: "Komputer Lab TKJ (PC-05)", penginput: "admin", tgl: "2026-06-22", biaya: 120000 },
  ]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // Logika simpan data ke API nantinya di sini
    const newData = {
      id: Math.random(),
      barang: formData.barang,
      penginput: currentUser,
      tgl: formData.tanggalPerbaikan,
      biaya: parseInt(formData.biaya),
    };

    setDataPerbaikan([newData, ...dataPerbaikan]);
    alert("Data Perbaikan Berhasil Disimpan!");
    
    // Reset form dan tutup
    setFormData({ barang: "", tanggalPerbaikan: "", biaya: "" });
    setShowForm(false);
  };

  // Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <Wrench className="text-blue-600" size={32} />
            Data Perbaikan
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Catat dan pantau riwayat perbaikan barang beserta biayanya.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md"
        >
          {showForm ? <X size={18} /> : <PlusCircle size={18} />}
          {showForm ? "Batal" : "Tambah Perbaikan"}
        </button>
      </div>

      {/* Form Input (Muncul jika showForm == true) */}
      {showForm && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-blue-100 animate-slideDown mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
            Form Input Perbaikan
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nama Barang */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-600">Barang yang Diperbaiki</label>
              <input 
                type="text" 
                name="barang" 
                required 
                value={formData.barang} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all" 
                placeholder="Contoh: Monitor PC 05 Lab RPL" 
              />
            </div>

            {/* Tanggal Perbaikan */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" /> Tanggal Perbaikan
              </label>
              <input 
                type="date" 
                name="tanggalPerbaikan" 
                required 
                value={formData.tanggalPerbaikan} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all" 
              />
            </div>

            {/* Biaya Perbaikan */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <Receipt size={16} className="text-slate-400" /> Biaya Perbaikan (Rp)
              </label>
              <input 
                type="number" 
                name="biaya" 
                required 
                min="0"
                value={formData.biaya} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all" 
                placeholder="Contoh: 150000" 
              />
            </div>

            {/* Penginput (Read-Only) */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <UserIcon size={16} className="text-slate-400" /> Penginput Data
              </label>
              <input 
                type="text" 
                readOnly 
                value={currentUser} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium uppercase" 
              />
              <p className="text-xs text-slate-400 mt-1">*Nama penginput diambil otomatis dari akun yang sedang login.</p>
            </div>

            <div className="md:col-span-2 pt-4">
              <button type="submit" className="w-full px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md">
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data Perbaikan */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold rounded-tl-xl">Tgl Perbaikan</th>
                <th className="p-4 font-semibold">Nama Barang</th>
                <th className="p-4 font-semibold">Biaya</th>
                <th className="p-4 font-semibold rounded-tr-xl">Diinput Oleh</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {dataPerbaikan.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">Belum ada data perbaikan.</td>
                </tr>
              ) : (
                dataPerbaikan.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-500 font-medium">{item.tgl}</td>
                    <td className="p-4 font-bold text-slate-800">{item.barang}</td>
                    <td className="p-4 font-bold text-red-600">{formatRupiah(item.biaya)}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide border border-slate-200">
                        {item.penginput}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}