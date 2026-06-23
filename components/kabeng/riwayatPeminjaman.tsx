"use client";
import React from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RiwayatPeminjaman({ navigateTo }: { navigateTo: (page: string) => void }) {
  
  // Data Dummy untuk riwayat (Sudah dikembalikan)
  const riwayatData = [
    { id: 1, nama: "Budi Santoso", peran: "Murid", barang: "Kabel LAN 10m", labor: "TKJ", tglPinjam: "2026-05-10", tglKembali: "2026-05-12" },
    { id: 2, nama: "Pak Hendra", peran: "Guru", barang: "Kamera Sony A7", labor: "BC", tglPinjam: "2026-06-01", tglKembali: "2026-06-03" },
    { id: 3, nama: "Siti Aminah", peran: "Murid", barang: "Wacom Pen Tablet", labor: "DKV", tglPinjam: "2026-06-15", tglKembali: "2026-06-16" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Riwayat Peminjaman</h2>
          <p className="text-slate-500 mt-1 text-sm">Daftar rekapan barang yang telah selesai dipinjam (dikembalikan).</p>
        </div>
        <button
          onClick={() => navigateTo("peminjaman")}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all shadow-md"
        >
          <ArrowLeft size={18} />
          Peminjaman Aktif
        </button>
      </div>

      {/* Tabel Riwayat */}
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
                <th className="p-4 font-semibold">Tgl Selesai</th>
                <th className="p-4 font-semibold text-center rounded-tr-xl">Keterangan</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {riwayatData.map((item) => (
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
                  <td className="p-4 text-slate-500">{item.tglKembali}</td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      <CheckCircle2 size={14} /> Dikembalikan
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