"use client";
import React from "react";

export default function LaporanKerusakanBarang() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <main className="flex justify-center items-center min-h-[80vh] px-2">
        <form className="w-full max-w-md bg-white rounded-xl shadow border border-gray-200 p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold mb-2">Input Kelas Pengguna Labor</h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Kelas :</label>
            <input
              type="text"
              placeholder="Masukkan Nama Labor"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Barang Yang Digunakan :</label>
            <input
              type="text"
              placeholder="Masukkan Nama Barang"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">jumlah Yang Digunakan :</label>
            <input
              type="text"
              placeholder="Masukkan Nama Barang"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white rounded py-2 font-medium text-base mt-2 hover:bg-gray-800 transition"
          >
            kirim
          </button>
        </form>
      </main>
    </div>
  );
}
