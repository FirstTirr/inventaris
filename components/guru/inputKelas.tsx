"use client";
import React, { useState, useEffect } from "react";

export default function InputKelas() {
  const [barang, setBarang] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [labor, setLabor] = useState("");
  const [kelas, setKelas] = useState("");
  const [kelasList, setKelasList] = useState<string[]>([]);
  const [laborList, setLaborList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Fetch kelas list from backend
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kelas`
        );
        const data = await res.json();
        if (res.ok && data.data) {
          setKelasList(data.data.map((k: any) => k.nama_kelas));
          if (data.data.length > 0) setKelas(data.data[0].nama_kelas);
        }
      } catch (err) {}
    };
    const fetchLabor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/labor`
        );
        const data = await res.json();
        if (res.ok && data.data) {
          setLaborList(data.data.map((l: any) => l.nama_labor));
          if (data.data.length > 0) setLabor(data.data[0].nama_labor);
        }
      } catch (err) {}
    };
    fetchKelas();
    fetchLabor();
  }, []);

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/guru/penggunaan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama_kelas: kelas,
            nama_labor: labor,
            nama_perangkat: barang,
            jumlah_pakai: jumlah,
          }),
        }
      );
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
              {kelasList.length === 0 ? (
                <option value="">(tidak ada data kelas)</option>
              ) : (
                kelasList.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))
              )}
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
              {laborList.length === 0 ? (
                <option value="">(tidak ada data labor)</option>
              ) : (
                laborList.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))
              )}
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
