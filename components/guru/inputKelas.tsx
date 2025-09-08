"use client";
import React, { useState, useEffect } from "react";

export default function InputKelas() {
  const [barang, setBarang] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [labor, setLabor] = useState("");
  const [kelas, setKelas] = useState("");
  const [kelasList, setKelasList] = useState<string[]>([]);
  const [laborList, setLaborList] = useState<string[]>([]);
  const [productsList, setProductsList] = useState<string[]>([]);
  const [productsRaw, setProductsRaw] = useState<any[]>([]);
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
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang/read`
        );
        const data = await res.json();
        if (res.ok && data.data) {
          setProductsRaw(data.data);
          // initial productsList: all good items
          const good = data.data.filter(
            (p: any) => String(p.status).toUpperCase() === "BAIK"
          );
          const goodNames = good.map((p: any) => p.nama_perangkat);
          setProductsList(goodNames);
          if (goodNames.length > 0) setBarang(goodNames[0]);
        }
      } catch (err) {
        setProductsList([]);
      }
    };
    fetchKelas();
    fetchLabor();
    fetchProducts();
  }, []);

  // When labor changes, filter productsRaw to only items that belong to that labor
  useEffect(() => {
    if (!productsRaw || productsRaw.length === 0) return;
    const selected = String(labor || "").toLowerCase();
    const filtered = productsRaw.filter((p: any) => {
      // match status and labor (flexible matching)
      if (String(p.status).toUpperCase() !== "BAIK") return false;
      const prodLabor =
        p.id_labor !== undefined && p.id_labor !== null
          ? String(p.id_labor).toLowerCase()
          : "";
      // match by name or id string
      return (
        prodLabor === selected || prodLabor === String(labor).toLowerCase()
      );
    });
    const names = filtered.map((p: any) => p.nama_perangkat);
    if (names.length > 0) {
      setProductsList(names);
      setBarang(names[0]);
    } else {
      // fallback to all good items
      const goodAll = productsRaw.filter(
        (p: any) => String(p.status).toUpperCase() === "BAIK"
      );
      const goodNames = goodAll.map((p: any) => p.nama_perangkat);
      setProductsList(goodNames);
      if (goodNames.length > 0) setBarang(goodNames[0]);
    }
  }, [labor, productsRaw]);

  // Hanya izinkan huruf dan angka
  const handleBarangSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBarang(e.target.value);
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
          className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <header className="flex items-start gap-4 pb-4 border-b">
            <div className="flex-none w-12 h-12 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 3v4"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                Input Kelas Pengguna Labor
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Catat pemakaian perangkat oleh kelas. Pilih labor, perangkat,
                dan jumlah penggunaan.
              </p>
            </div>
          </header>
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
                  <path
                    d="M4 7h16M4 12h8M4 17h16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <select
                name="Kelas"
                id="Kelas"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="border border-gray-300 rounded pl-10 pr-3 py-2 text-sm bg-gray-50 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
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
          </div>
          {/* Input Labor */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Labor :</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
                  <path
                    d="M12 2v4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 7h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <select
                name="id_labor"
                id="id_labor"
                value={labor}
                onChange={(e) => setLabor(e.target.value)}
                className="border border-gray-300 rounded pl-10 pr-3 py-2 text-sm bg-gray-50 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
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
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Barang Yang Digunakan :
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
                  <path
                    d="M3 7h18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 7v10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <select
                name="nama_perangkat"
                id="nama_perangkat"
                value={barang}
                onChange={handleBarangSelect}
                className="border border-gray-300 rounded pl-10 pr-3 py-2 text-sm bg-gray-50 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              >
                {productsList.length === 0 ? (
                  <option value="">(tidak ada data barang baik)</option>
                ) : (
                  productsList.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))
                )}
              </select>
            </div>
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
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded py-2 font-semibold text-base mt-2 hover:from-indigo-700 hover:to-blue-700 shadow-md transition"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim ke kabeng"}
          </button>
        </form>
      </main>
    </div>
  );
}
