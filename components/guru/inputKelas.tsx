"use client";
import React, { useState } from "react";

export default function InputKelas() {
  const [barang, setBarang] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [labor, setLabor] = useState("");
  const [kelas, setKelas] = useState("X TJKT 1");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Hanya izinkan huruf dan angka
  const handleBarangChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
    setBarang(value);
  };
  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
    setJumlah(value);
  };

  // Handle submit POST
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/guru/penggunaan`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_kelas: kelas,
          nama_labor: labor,
          nama_perangkat: barang,
          jumlah_pakai: jumlah,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Laporan berhasil ditambahkan");
        setBarang("");
        setJumlah("");
        setLabor("");
        setKelas("");
      } else {
        setMessage(data.detail || "Gagal mengirim data");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <main className="flex justify-center items-center min-h-[80vh] px-2">
        <form
          className="w-full max-w-md bg-white rounded-xl shadow border border-gray-200 p-8 flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-bold mb-2">Input Kelas Pengguna Labor</h2>
          {message && (
            <div
              className={`text-sm mb-2 ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Kelas :</label>
            <select
              name="Kelas"
              id="Kelas"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
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
          {/* Input Labor */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Labor :</label>
            <select
              name="id_labor"
              id="id_labor"
              value={labor}
              onChange={(e) => setLabor(e.target.value)}
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
            <label className="text-sm font-medium">
              Barang Yang Digunakan :
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Barang"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={barang}
              onChange={handleBarangChange}
              pattern="[a-zA-Z0-9 ]*"
              title="Hanya huruf dan angka"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              jumlah Yang Digunakan :
            </label>
            <input
              type="text"
              placeholder="Masukkan Jumlah"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={jumlah}
              onChange={handleJumlahChange}
              pattern="[a-zA-Z0-9 ]*"
              title="Hanya huruf dan angka"
              min={1}
              max={256}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white rounded py-2 font-medium text-base mt-2 hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim ke kabeng"}
          </button>
        </form>
      </main>
    </div>
  );
}
