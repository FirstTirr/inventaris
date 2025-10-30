import React, { useState, useEffect, useMemo } from "react";
import { CheckCheck } from "lucide-react";

export default function TerimaLaporan() {
  interface LaporanItem {
    id_laporan: number;
    nama_labor?: string;
    nama_perangkat?: string;
    jumlah?: number;
    jenis_kerusakan?: string;
    tanggal_lapor?: string;
  }
  const [laporan, setLaporan] = useState<LaporanItem[]>([]);
  const [jurusanList, setJurusanList] = useState<string[]>([]);
  const [selectedJurusan, setSelectedJurusan] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Filter laporan by jurusan, labor and perangkat
  const filteredLaporan = useMemo(() => {
    let arr = laporan;
    if (selectedJurusan) {
      const j = selectedJurusan.toLowerCase();
      arr = arr.filter((item) =>
        Boolean(
          (item.nama_labor && item.nama_labor.toLowerCase().includes(j)) ||
            (item.nama_perangkat &&
              item.nama_perangkat.toLowerCase().includes(j))
        )
      );
    }
    if (!search) return arr;
    const s = search.toLowerCase();
    return arr.filter(
      (item: LaporanItem) =>
        (item.nama_labor && item.nama_labor.toLowerCase().includes(s)) ||
        (item.nama_perangkat && item.nama_perangkat.toLowerCase().includes(s))
    );
  }, [laporan, search, selectedJurusan]);
  const paginatedLaporan = filteredLaporan.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredLaporan.length / itemsPerPage);

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

  // Fungsi hapus laporan
  const handleDelete = async (id_laporan: number) => {
    if (!isOnline) {
      alert("Tidak ada koneksi internet");
      return;
    }

    if (
      !window.confirm(
        "Yakin ingin menyetujui laporan ini? jika sudah setuju, mohon edit jumlah dan status barang di tabel product"
      )
    )
      return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/kabeng/laporan/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_laporan }),
        }
      );
      if (!res.ok) throw new Error("Gagal menghapus laporan");
      setLaporan((prev) =>
        prev.filter((item) => item.id_laporan !== id_laporan)
      );
    } catch {
      alert("Gagal menghapus laporan");
    }
  };

  useEffect(() => {
    if (!isOnline) {
      setLoading(false);
      setError("");
      setLaporan([]);
      return;
    }

    const fetchLaporan = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/kabeng/laporan`
        );
        if (!res.ok) throw new Error("Gagal mengambil data laporan");
        const data = await res.json();
        setLaporan(data.data || []);
      } catch {
        setError("Gagal mengambil data laporan");
      } finally {
        setLoading(false);
      }
    };
    fetchLaporan();
    // fetch jurusan for filter
    (async function fetchJurusan() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil jurusan");
        const j = await res.json();
        if (j && Array.isArray(j.data))
          setJurusanList(j.data.map((x: { jurusan: string }) => x.jurusan));
      } catch (e) {
        // ignore
      }
    })();
  }, [isOnline]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <div className="mt-3">
          <button
            className="px-3 py-2 bg-gray-800 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
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
          <h2 className="text-3xl font-bold mb-0">damaged goods report</h2>
          <div className="text-gray-500 text-base font-normal">
            monitor damage to goods in the labor
          </div>
        </div>
        <div className="w-full overflow-x-auto rounded-xl bg-white shadow font-sans mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 border-b">
            <div className="flex items-center gap-2">
              <label
                htmlFor="itemsPerPage"
                className="text-gray-600 text-sm font-medium"
              >
                Show{" "}
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                {[10, 20, 30, 40, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-gray-600 text-sm font-medium">
                {" "}
                entries
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <select
                value={selectedJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
                className="border rounded px-2 py-1 text-sm mr-2"
                aria-label="Filter by jurusan"
              >
                <option value="">Semua Jurusan</option>
                {jurusanList.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Cari labor/perangkat..."
                className="w-48 outline-none bg-white border rounded px-3 py-2 text-sm text-gray-500 placeholder:text-gray-400 shadow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search labor/perangkat"
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
              <button
                onClick={async () => {
                  setLoading(true);
                  setError("");
                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/kabeng/laporan`
                    );
                    if (!res.ok)
                      throw new Error("Gagal mengambil data laporan");
                    const data = await res.json();
                    setLaporan(data.data || []);
                  } catch {
                    setError("Gagal mengambil data laporan");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="px-3 py-2 bg-white border rounded text-sm hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>
            <div className="text-gray-500 text-xs md:text-sm w-full text-center md:w-auto md:text-right">
              Showing {paginatedLaporan.length} of {filteredLaporan.length}{" "}
              entries
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm font-semibold border-b">
                <th className="py-3 px-6 font-semibold bg-white">Labor</th>
                <th className="py-3 px-6 font-semibold bg-white">Perangkat</th>
                <th className="py-3 px-6 font-semibold bg-white">Jumlah</th>
                <th className="py-3 px-6 font-semibold bg-white">
                  Jenis Kerusakan
                </th>
                <th className="py-3 px-6 font-semibold bg-white">
                  Tanggal Lapor
                </th>
                <th className="py-3 px-6 font-semibold bg-white text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLaporan.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Tidak ada laporan.
                  </td>
                </tr>
              ) : (
                paginatedLaporan.map((item: LaporanItem, idx: number) => (
                  <tr
                    key={item.id_laporan || idx}
                    className="border-b last:border-b-0 text-gray-700"
                  >
                    <td className="py-3 px-6">{item.nama_labor}</td>
                    <td className="py-3 px-6">{item.nama_perangkat}</td>
                    <td className="py-3 px-6">{item.jumlah ?? "-"}</td>
                    <td className="py-3 px-6">{item.jenis_kerusakan}</td>
                    <td className="py-3 px-6">{item.tanggal_lapor}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="inline-flex gap-2">
                        <button
                          className="inline-flex items-center justify-center rounded-md p-2 bg-green-300 hover:bg-green-400 transition-colors"
                          onClick={() => handleDelete(item.id_laporan)}
                        >
                          <CheckCheck className="w-6 h-6 text-green-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-white border rounded text-sm text-gray-700 disabled:bg-gray-200"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded text-sm ${
                    page === p
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-white border rounded text-sm text-gray-700 disabled:bg-gray-200"
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
