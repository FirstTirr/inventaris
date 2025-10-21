import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CheckCheck } from "lucide-react";

// Custom hook for debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function LastUser() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300); // 300ms debounce
  type Penggunaan = {
    id_penggunaan: number;
    nama_kelas: string;
    nama_labor: string;
    nama_perangkat: string;
    jumlah_pakai: number;
    tanggal: string;
  };
  const [data, setData] = useState<Penggunaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Memoized filtered data untuk performa lebih baik
  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data;
    const s = debouncedSearch.toLowerCase();
    return data.filter(
      (item) =>
        (item.nama_labor && item.nama_labor.toLowerCase().includes(s)) ||
        (item.nama_perangkat && item.nama_perangkat.toLowerCase().includes(s))
    );
  }, [data, debouncedSearch]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page, itemsPerPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Check network status
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

  useEffect(() => {
    if (!isOnline) {
      setLoading(false);
      setError("");
      setData([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/kabeng/penggunaan`
        );
        if (!res.ok) throw new Error("Gagal mengambil data penggunaan");
        const result = await res.json();
        setData(result.data || []);
      } catch {
        setError("Gagal mengambil data penggunaan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOnline]);

  // Tambahkan fungsi hapus penggunaan dengan useCallback
  const handleDelete = useCallback(
    async (id_penggunaan: number) => {
      if (!isOnline) {
        alert("Tidak ada koneksi internet");
        return;
      }

      if (!window.confirm("Yakin ingin menghapus penggunaan ini?")) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/kabeng/penggunaan/delete`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_penggunaan }),
          }
        );
        if (!res.ok) throw new Error("Gagal menghapus penggunaan");
        // Hapus dari state jika sukses
        setData((prev) =>
          prev.filter((item) => item.id_penggunaan !== id_penggunaan)
        );
      } catch {
        alert("Gagal menghapus penggunaan");
      }
    },
    [isOnline]
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-600 text-center py-8">{error}</div>;
  if (!isOnline)
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Tidak ada koneksi internet. Data tidak dapat dimuat.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8">
      <div className="w-full mx-auto px-6 lg:px-12">
        <div className="mb-2">
          <h2 className="text-3xl font-bold mb-0">Monitoring User</h2>
          <div className="text-gray-500 text-base font-normal">
            view last users
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 mt-6">
          <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
            <input
              type="text"
              placeholder="cari labor/perangkat"
              className="flex-1 outline-none bg-transparent text-sm text-gray-500 px-2 placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="text-gray-400 hover:text-gray-600 text-base px-2"
              onClick={() => setSearch("")}
              type="button"
              aria-label="Clear search"
              tabIndex={-1}
            >
              ×
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-auto rounded-xl bg-white shadow font-sans">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="itemsPerPage"
                className="text-gray-600 text-sm font-medium"
              >
                Show
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select number of entries per page"
              >
                {[10, 20, 30, 40, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-gray-600 text-sm font-medium">entries</span>
            </div>
            <div className="text-gray-500 text-xs md:text-sm">
              Showing {paginatedData.length} of {filteredData.length} entries
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm font-semibold border-b">
                <th className="py-3 px-6 font-semibold bg-white">Kelas</th>
                <th className="py-3 px-6 font-semibold bg-white">Labor</th>
                <th className="py-3 px-6 font-semibold bg-white">Perangkat</th>
                <th className="py-3 px-6 font-semibold bg-white">
                  Jumlah Pakai
                </th>
                <th className="py-3 px-6 font-semibold bg-white">Tanggal</th>
                <th className="py-3 px-6 font-semibold bg-white text-center">
                  actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id_penggunaan || idx}
                  className="border-b last:border-b-0 text-gray-700"
                >
                  <td className="py-3 px-6">{item.nama_kelas}</td>
                  <td className="py-3 px-6">{item.nama_labor}</td>
                  <td className="py-3 px-6">{item.nama_perangkat}</td>
                  <td className="py-3 px-6">{item.jumlah_pakai}</td>
                  <td className="py-3 px-6">{item.tanggal}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="inline-flex items-center justify-center rounded-md p-2 bg-red-100 hover:bg-red-200 transition-colors"
                      onClick={() => handleDelete(item.id_penggunaan)}
                    >
                      <CheckCheck className="w-6 h-6 text-green-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm text-gray-700 bg-white disabled:bg-gray-200 disabled:text-gray-400"
                aria-label="Previous page"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded text-sm font-semibold transition-colors duration-150 ${
                    page === p
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                  }`}
                  aria-label={`Go to page ${p}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded text-sm text-gray-700 bg-white disabled:bg-gray-200 disabled:text-gray-400"
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
