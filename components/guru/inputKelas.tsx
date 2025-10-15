"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";

const InputKelas = React.memo(() => {
  const [barang, setBarang] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [labor, setLabor] = useState("");
  const [kelas, setKelas] = useState("");
  const [kelasList, setKelasList] = useState<string[]>([]);
  const [laborList, setLaborList] = useState<string[]>([]);
  const [productsList, setProductsList] = useState<string[]>([]);
  type ProductRaw = {
    nama_kelas?: string;
    nama_labor?: string;
    nama_perangkat?: string;
    status?: string;
    labor?: string;
  };
  const [productsRaw, setProductsRaw] = useState<ProductRaw[]>([]);
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

  // Memoized fetch functions
  const fetchKelas = useCallback(async () => {
    if (!isOnline) return;

    // Try cache first
    const cacheKey = "input-kelas-cache";
    const timeKey = "input-kelas-cache-time";
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(timeKey);
    const now = Date.now();
    const cacheValid = cacheTime && now - parseInt(cacheTime) < 5 * 60 * 1000; // 5 minutes

    if (cachedData && cacheValid) {
      try {
        const data = JSON.parse(cachedData);
        setKelasList(data.map((k: { nama_kelas: string }) => k.nama_kelas));
        if (data.length > 0) setKelas(data[0].nama_kelas);
        return;
      } catch (err) {
        console.error("Cache parse error:", err);
      }
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kelas`
      );
      const data = await res.json();
      if (res.ok && data.data) {
        localStorage.setItem(cacheKey, JSON.stringify(data.data));
        localStorage.setItem(timeKey, now.toString());

        setKelasList(
          data.data.map((k: { nama_kelas: string }) => k.nama_kelas)
        );
        if (data.data.length > 0) setKelas(data.data[0].nama_kelas);
      }
    } catch (err) {
      console.error("Fetch kelas error:", err);
    }
  }, [isOnline]);

  const fetchLabor = useCallback(async () => {
    if (!isOnline) return;

    // Try cache first
    const cacheKey = "input-labor-cache";
    const timeKey = "input-labor-cache-time";
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(timeKey);
    const now = Date.now();
    const cacheValid = cacheTime && now - parseInt(cacheTime) < 5 * 60 * 1000; // 5 minutes

    if (cachedData && cacheValid) {
      try {
        const data = JSON.parse(cachedData);
        setLaborList(data.map((l: { nama_labor: string }) => l.nama_labor));
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

        setLaborList(
          data.data.map((l: { nama_labor: string }) => l.nama_labor)
        );
        if (data.data.length > 0) setLabor(data.data[0].nama_labor);
      }
    } catch (err) {
      console.error("Fetch labor error:", err);
    }
  }, [isOnline]);

  const fetchProducts = useCallback(async () => {
    if (!isOnline) return;

    // Try cache first
    const cacheKey = "input-products-cache";
    const timeKey = "input-products-cache-time";
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(timeKey);
    const now = Date.now();
    const cacheValid = cacheTime && now - parseInt(cacheTime) < 3 * 60 * 1000; // 3 minutes

    if (cachedData && cacheValid) {
      try {
        const data = JSON.parse(cachedData);
        setProductsRaw(data);
        // initial productsList: all good items
        const good = data.filter(
          (p: ProductRaw) => String(p.status).toUpperCase() === "BAIK"
        );
        const goodNames = good.map((p: ProductRaw) => p.nama_perangkat ?? "");
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
        // initial productsList: all good items
        const good = data.data.filter(
          (p: ProductRaw) => String(p.status).toUpperCase() === "BAIK"
        );
        const goodNames = good.map((p: ProductRaw) => p.nama_perangkat ?? "");
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

    fetchKelas();
    fetchLabor();
    fetchProducts();
  }, [isOnline, fetchKelas, fetchLabor, fetchProducts]);

  // Memoized filtered products based on labor
  const filteredProducts = useMemo(() => {
    if (!productsRaw || productsRaw.length === 0) return [];

    const selectedLabor = String(labor || "").toLowerCase();
    // Filter barang: status BAIK dan labor persis sama dengan labor yang dipilih
    const filtered = productsRaw.filter((p: ProductRaw) => {
      if (String(p.status).toUpperCase() !== "BAIK") return false;
      const prodLaborName = p.labor ? String(p.labor).toLowerCase() : "";
      return prodLaborName === selectedLabor;
    });

    // Jika tidak ada barang di labor tsb, dropdown kosong
    return filtered.map((p: ProductRaw) => p.nama_perangkat ?? "");
  }, [labor, productsRaw]);

  // Update productsList when filteredProducts change
  useEffect(() => {
    setProductsList(filteredProducts);
    if (filteredProducts.length > 0) {
      setBarang(filteredProducts[0]);
    }
  }, [filteredProducts]);

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
    setMessage("");
    // Validasi field wajib
    if (!kelas || !labor || !barang || !jumlah) {
      setMessage("Harap lengkapi semua field!");
      return;
    }
    setLoading(true);
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
        setMessage("✅ Penggunaan berhasil dicatat");
        setBarang("");
        setJumlah("");
        setLabor("");
        setKelas("");
        // Hapus cache agar data di-refresh
        localStorage.removeItem("input-kelas-cache");
        localStorage.removeItem("input-kelas-cache-time");
        localStorage.removeItem("input-labor-cache");
        localStorage.removeItem("input-labor-cache-time");
        localStorage.removeItem("input-products-cache");
        localStorage.removeItem("input-products-cache-time");
      } else {
        setMessage(data.detail || "Gagal mengirim data");
      }
    } catch {
      setMessage("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <main className="flex justify-center items-center px-2">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-none bg-white/30 backdrop-blur-[16px] rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-6 border border-white/40"
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
                  kelasList.map((k, idx) => (
                    <option key={k + "-" + idx} value={k}>
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
                  laborList.map((l, idx) => (
                    <option key={l + "-" + idx} value={l}>
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
                  productsList.map((p, idx) => (
                    <option key={p + "-" + idx} value={p}>
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
});

InputKelas.displayName = "InputKelas";

export default InputKelas;
