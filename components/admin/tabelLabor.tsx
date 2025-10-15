import { Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function TabelLabor() {
  const [laborList, setLaborList] = useState<{ nama_labor: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const paginatedLabor = laborList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(laborList.length / itemsPerPage);
  const fetchLabor = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/labor`
      );
      const data = await res.json();
      if (res.ok && data.data) setLaborList(data.data);
    } catch {}
    setLoading(false);
  };
  useEffect(() => {
    fetchLabor();
  }, []);

  const handleDelete = async (nama_labor: string) => {
    if (!window.confirm(`Hapus labor '${nama_labor}'?`)) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/labor/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama_labor }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal menghapus labor");
      setLaborList((prev) => prev.filter((l) => l.nama_labor !== nama_labor));
      alert("Labor berhasil dihapus!");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message || "Gagal menghapus labor");
      } else {
        alert("Gagal menghapus labor");
      }
    }
  };
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-4 md:p-8 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-2xl font-bold text-gray-700">
          Tabel Labor
        </h3>
      </div>
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
          <span className="text-gray-600 text-sm font-medium"> entries</span>
        </div>
        <div className="text-gray-500 text-xs md:text-sm">
          Showing {paginatedLabor.length} of {laborList.length} entries
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className="min-w-full text-sm md:text-base">
              <thead>
                <tr className="bg-blue-100 text-gray-700">
                  <th className="px-4 py-2 text-left rounded-tl-xl">
                    Nama Labor
                  </th>
                  <th className="px-4 py-2 text-center rounded-tr-xl">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLabor.map((row) => (
                  <tr
                    key={row.nama_labor}
                    className="border-b last:border-b-0 hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2">{row.nama_labor}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="text-red-600 hover:bg-red-200 font-semibold px-2 rounded-full"
                        onClick={() => handleDelete(row.nama_labor)}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
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
                  )
                )}
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
    </div>
  );
}
// ...existing code...
