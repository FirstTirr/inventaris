import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function LastUser() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
      } catch (err) {
        setError("Gagal mengambil data penggunaan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const s = search.toLowerCase();
    return (
      (item.nama_labor && item.nama_labor.toLowerCase().includes(s)) ||
      (item.nama_perangkat && item.nama_perangkat.toLowerCase().includes(s))
    );
  });

  // Tambahkan fungsi hapus penggunaan
  const handleDelete = async (id_penggunaan: number) => {
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
    } catch (err) {
      alert("Gagal menghapus penggunaan");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8">
      <div className="max-w-6xl mx-auto">
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
        <div className="overflow-x-auto rounded-xl bg-white shadow font-sans">
          <table className="min-w-full text-left">
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
              {filteredData.map((item, idx) => (
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
      </div>
    </div>
  );
}
