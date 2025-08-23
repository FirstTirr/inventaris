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
            <select
              name="Kelas"
              id="Kelas"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="X TJKT 1">X TJKT 1</option>
              <option value="X TJKT 2">X TJKT 2</option>
              <option value="X TJKT 3">X TJKT 3</option>
              <option value="X TJKT 4">X TJKT 4</option>
              <option value="X DKV 1">X DKV 1</option>
              <option value="X DKV 2">X DKV 2</option>
              <option value="X RPL 1">X RPL 1</option>
              <option value="X RPL 2">X RPL 2</option>
              <option value="X BC">X BC</option>
              <option value="XI TJKT 1">XI TJKT 1</option>
              <option value="XI TJKT 2">XI TJKT 2</option>
              <option value="XI TJKT 3">XI TJKT 3</option>
              <option value="XI DKV 1">XI DKV 1</option>
              <option value="XI DKV 2">XI DKV 2</option>
              <option value="XI RPL 1">XI RPL 1</option>
              <option value="XI RPL 2">XI RPL 2</option>
              <option value="XI BC">XI BC</option>
              <option value="XII TJKT 1">XII TJKT 1</option>
              <option value="XII TJKT 2">XII TJKT 2</option>
              <option value="XII TJKT 3">XII TJKT 3</option>
              <option value="XII DKV 1">XII DKV 1</option>
              <option value="XII DKV 2">XII DKV 2</option>
              <option value="XII RPL 1">XII RPL 1</option>
              <option value="XII RPL 2">XII RPL 2</option>
              <option value="XII BC">XII BC</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Barang Yang Digunakan :
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Barang"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              jumlah Yang Digunakan :
            </label>
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
