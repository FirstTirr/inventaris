"use client";
import React, { useState } from "react";

export default function LaporanKerusakanBarang() {
  const [barang, setBarang] = useState("");
  const [kerusakan, setKerusakan] = useState("");
  // Hanya izinkan huruf dan angka
  const handleBarangChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
    setBarang(value);
  };
  const handleKerusakanChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
    setKerusakan(value);
  };
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <main className="flex justify-center items-center min-h-[80vh] px-2">
        <form className="w-full max-w-md bg-white rounded-xl shadow border border-gray-200 p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold mb-2">Laporan Kerusakan Barang</h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Labor :</label>
            <select
              name="labor"
              id="labor"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Pilih Labor</option>
              <option value="LABOR PK">LABOR PK</option>
              <option value="LABOR RPL">LABOR RPL</option>
              <option value="LABOR BC">LABOR BC</option>
              <option value="LABOR 1 DKV">LABOR 1 DKV</option>
              <option value="LABOR 2 DKV">LABOR 2 DKV</option>
              <option value="LABOR 1 TKJ">LABOR 1 TKJ</option>
              <option value="LABOR 2 TKJ">LABOR 2 TKJ</option>
              <option value="LABOR 3 TKJ">LABOR 3 TKJ</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Barang Yang Rusak :</label>
            <input
              type="text"
              placeholder="Masukkan Nama Barang"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={barang}
              onChange={handleBarangChange}
              pattern="[a-zA-Z0-9 ]*"
              title="Hanya huruf dan angka"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Jenis Kerusakan</label>
            <textarea
              placeholder="Masukkan Jenis Kerusakan"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={kerusakan}
              onChange={handleKerusakanChange}
              title="Hanya huruf dan angka"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white rounded py-2 font-medium text-base mt-2 hover:bg-gray-800 transition"
          >
            kirim ke kabeng/kaprog
          </button>
        </form>
      </main>
    </div>
  );
}
