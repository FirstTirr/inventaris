import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Trash2 } from "lucide-react";

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

const LastUser = React.memo(() => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(20);

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

    // Try cache first
    const cachedData = localStorage.getItem("lastuser-cache");
    const cacheTime = localStorage.getItem("lastuser-cache-time");
    const now = Date.now();
    const cacheValid = cacheTime && now - parseInt(cacheTime) < 2 * 60 * 1000;

    if (cachedData && cacheValid) {
      try {
        setData(JSON.parse(cachedData));
        setLoading(false);
        return;
      } catch (err) {
        console.error("Cache parse error:", err);
      }
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
        const resultData = result.data || [];

        localStorage.setItem("lastuser-cache", JSON.stringify(resultData));
        localStorage.setItem("lastuser-cache-time", Date.now().toString());
        setData(resultData);
      } catch (err) {
        setError("Gagal mengambil data penggunaan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOnline]);

  // Memoized filtered and paginated data
  const { paginatedData, totalPages } = useMemo(() => {
    let filtered = data;

    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase();
      filtered = data.filter((item) => {
        return (
          (item.nama_labor && item.nama_labor.toLowerCase().includes(s)) ||
          (item.nama_perangkat && item.nama_perangkat.toLowerCase().includes(s))
        );
      });
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    const pages = Math.ceil(filtered.length / itemsPerPage);

    return { paginatedData: paginated, totalPages: pages };
  }, [data, debouncedSearch, page, itemsPerPage]);

  // Handle delete with useCallback
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
        setData((prev) =>
          prev.filter((item) => item.id_penggunaan !== id_penggunaan)
        );
      } catch (err) {
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
          <select className="bg-white rounded-md border border-gray-200 px-4 py-2 shadow-sm text-base">
            <option>All Categories</option>
          </select>
        </div>
        <div className="w-full overflow-x-auto rounded-xl bg-white shadow font-sans">
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
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default LastUser;
