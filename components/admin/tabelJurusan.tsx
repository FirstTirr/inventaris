import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function TabelJurusan() {
  const [jurusanList, setJurusanList] = useState<{ jurusan: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJurusan = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`
        );
        const data = await res.json();
        if (res.ok && data.data) {
          setJurusanList(data.data);
        } else {
          setJurusanList([]);
        }
      } catch (err) {
        setJurusanList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJurusan();
  }, []);

  const handleDelete = async (jurusan: string) => {
    if (!window.confirm("Yakin ingin menghapus jurusan ini?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jurusan }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal menghapus jurusan");
      setJurusanList((prev) => prev.filter((j) => j.jurusan !== jurusan));
      alert("Jurusan berhasil dihapus!");
    } catch (err: any) {
      alert(err.message || "Gagal menghapus jurusan");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-4 md:p-8 overflow-x-auto">
      <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-4">
        Tabel Jurusan
      </h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full text-sm md:text-base">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="px-4 py-2 text-left rounded-tl-xl">Jurusan</th>
              <th className="px-4 py-2 text-center rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {jurusanList.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-400">
                  Tidak ada data jurusan
                </td>
              </tr>
            ) : (
              jurusanList.map((row, idx) => (
                <tr
                  key={row.jurusan}
                  className="border-b last:border-b-0 hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-2">{row.jurusan}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="text-red-600 hover:text-red-800 font-semibold px-2"
                      title="Hapus"
                      onClick={() => handleDelete(row.jurusan)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
