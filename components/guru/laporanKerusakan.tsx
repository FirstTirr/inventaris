"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";

const LaporanKerusakanBarang = React.memo(() => {
  const [barang, setBarang] = useState("");
  const [kerusakan, setKerusakan] = useState("");
  const [labor, setLabor] = useState("");
  const [laborList, setLaborList] = useState<string[]>([]);
  const [productsList, setProductsList] = useState<string[]>([]);
  const [productsRaw, setProductsRaw] = useState<any[]>([]);
  const [jumlah, setJumlah] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Memoized fetch functions with caching
  const fetchLabor = useCallback(async () => {
    if (!isOnline) return;

    // Try cache first
    const cacheKey = "laporan-labor-cache";
    const timeKey = "laporan-labor-cache-time";
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(timeKey);
    const now = Date.now();
    const cacheValid = cacheTime && now - parseInt(cacheTime) < 5 * 60 * 1000; // 5 minutes

    if (cachedData && cacheValid) {
      try {
        const data = JSON.parse(cachedData);
        setLaborList(data.map((l: any) => l.nama_labor));
        if (data.length > 0) setLabor(data[0].nama_labor);
        return;
      } catch (err) {
        console.error("Cache parse error:", err);
      }
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/labor`
      );
      const data = await res.json();
      if (res.ok && data.data) {
        localStorage.setItem(cacheKey, JSON.stringify(data.data));
        localStorage.setItem(timeKey, now.toString());

        setLaborList(data.data.map((l: any) => l.nama_labor));
        if (data.data.length > 0) setLabor(data.data[0].nama_labor);
      }
    } catch (err) {
      console.error("Fetch labor error:", err);
    }
  }, [isOnline]);

  const fetchProducts = useCallback(async () => {
    if (!isOnline) return;

    // Try cache first
    const cacheKey = "laporan-products-cache";
    const timeKey = "laporan-products-cache-time";
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(timeKey);
    const now = Date.now();
    const cacheValid = cacheTime && now - parseInt(cacheTime) < 3 * 60 * 1000; // 3 minutes

    if (cachedData && cacheValid) {
      try {
        const data = JSON.parse(cachedData);
        setProductsRaw(data);
        const good = data.filter(
          (p: any) => String(p.status).toUpperCase() === "BAIK"
        );
        const goodNames = good.map((p: any) => p.nama_perangkat);
        setProductsList(goodNames);
        if (goodNames.length > 0) setBarang(goodNames[0]);
        return;
      } catch (err) {
        console.error("Cache parse error:", err);
      }
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang/read`
      );
      const data = await res.json();
      if (res.ok && data.data) {
        localStorage.setItem(cacheKey, JSON.stringify(data.data));
        localStorage.setItem(timeKey, now.toString());

        setProductsRaw(data.data);
        const good = data.data.filter(
          (p: any) => String(p.status).toUpperCase() === "BAIK"
        );
        const goodNames = good.map((p: any) => p.nama_perangkat);
        setProductsList(goodNames);
        if (goodNames.length > 0) setBarang(goodNames[0]);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      setProductsList([]);
    }
  }, [isOnline]);

  // Fetch data on mount
  useEffect(() => {
    if (!isOnline) return;

    fetchLabor();
    fetchProducts();
  }, [isOnline, fetchLabor, fetchProducts]);

  // Hanya izinkan huruf dan angka
  const handleBarangSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBarang(e.target.value);
  };
  const handleKerusakanChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
    setKerusakan(value);
  };

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // allow only digits
    const value = e.target.value.replace(/[^0-9]/g, "");
    setJumlah(value);
  };

  const handleLaborChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLabor(e.target.value);
  };

  // Update productsList when labor changes to show only BAIK items in that labor
  useEffect(() => {
    if (!productsRaw || productsRaw.length === 0) return;
    const selected = String(labor || "").toLowerCase();
    const filtered = productsRaw.filter((p: any) => {
      if (String(p.status).toUpperCase() !== "BAIK") return false;
      const prodLabor =
        p.id_labor !== undefined && p.id_labor !== null
          ? String(p.id_labor).toLowerCase()
          : "";
      return prodLabor === selected;
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

  // Handle submit POST
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/laporan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama_labor: labor,
            nama_perangkat: barang,
            jumlah: jumlah,
            jenis_kerusakan: kerusakan,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Laporan berhasil ditambahkan");
        setBarang("");
        setKerusakan("");
        setLabor("");
        setJumlah("");
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
      <main className="flex justify-center items-center px-2">
        <form
          className="w-full max-w-none bg-white/30 backdrop-blur-[16px] rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-6 border border-white/40"
          onSubmit={handleSubmit}
        >
          <header className="flex items-start gap-4 pb-4 border-b">
            <div className="flex-none w-12 h-12 rounded-md bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center shadow-md">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 9v4"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17h.01"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                Laporan Kerusakan Barang
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Laporkan perangkat yang rusak agar dapat segera ditindaklanjuti
                oleh kabeng/kaprog.
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
            <label className="text-sm font-medium">Labor :</label>
            <select
              name="labor"
              id="labor"
              value={labor}
              onChange={handleLaborChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
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
            <label className="text-sm font-medium">Barang Yang Rusak :</label>
            <select
              name="nama_perangkat"
              id="nama_perangkat"
              value={barang}
              onChange={handleBarangSelect}
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Jenis Kerusakan</label>
            <textarea
              placeholder="Masukkan Jenis Kerusakan"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={kerusakan}
              onChange={handleKerusakanChange}
              title="Hanya huruf dan angka"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Jumlah (opsional)</label>
            <input
              type="number"
              min={0}
              placeholder="Masukkan Jumlah"
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={jumlah}
              onChange={handleJumlahChange}
              title="Hanya angka"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white rounded py-2 font-medium text-base mt-2 hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim ke kabeng/kaprog"}
          </button>
        </form>
      </main>
    </div>
  );
});

LaporanKerusakanBarang.displayName = "LaporanKerusakanBarang";

export default LaporanKerusakanBarang;
