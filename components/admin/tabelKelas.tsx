import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function TabelKelas() {
  const [data, setData] = useState<{ kelas: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    const fetchKelas = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kelas`
        );
        const json = await res.json();
        if (res.ok && json.data) {
          const mapped = json.data.map((k: { nama_kelas: string }) => ({
            kelas: k.nama_kelas,
          }));
          setData(mapped);
        } else {
          setError(json.detail || "Gagal mengambil data kelas");
        }
      } catch {
        setError("Gagal mengambil data kelas");
      }
      setLoading(false);
    };
    fetchKelas();
  }, []);

  // Hapus kelas berdasarkan nama_kelas
  const handleDelete = async (nama_kelas: string) => {
    if (!window.confirm("Yakin ingin menghapus kelas ini?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kelas/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama_kelas }),
        }
      );
      const json = await res.json();
      if (res.ok) {
        setData((prev) => prev.filter((k) => k.kelas !== nama_kelas));
        alert(json.message || "Kelas berhasil dihapus");
      } else {
        alert(json.detail || "Gagal menghapus kelas");
      }
    } catch {
      alert("Gagal menghapus kelas");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-4 md:p-8 overflow-x-auto">
      <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-4">
        Tabel Kelas
      </h3>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
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
            <div className="text-gray-500 text-xs md:text-sm">
              Showing {paginatedData.length} of {data.length} entries
            </div>
          </div>
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="px-4 py-2 text-left rounded-tl-xl">Kelas</th>
                <th className="px-4 py-2 text-center rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-400">
                    Tidak ada data kelas
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={row.kelas + "-" + idx}
                    className="border-b last:border-b-0 hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2">{row.kelas}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="text-red-600 hover:text-red-800 font-semibold px-2"
                        title="Hapus"
                        onClick={() => handleDelete(row.kelas)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
        </>
      )}
    </div>
  );
}
