import { Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function TabelLabor() {
  const [laborList, setLaborList] = useState<{ nama_labor: string }[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch (err: any) {
      alert(err.message || "Gagal menghapus labor");
    }
  };
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-4 md:p-8 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-2xl font-bold text-gray-700">
          Tabel Labor
        </h3>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="px-4 py-2 text-left rounded-tl-xl">
                  Nama Labor
                </th>
                <th className="px-4 py-2 text-center rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {laborList.map((row) => (
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
        )}
      </div>
    </div>
  );
}
// ...existing code...
