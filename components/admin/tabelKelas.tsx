import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function TabelKelas() {
  const [data, setData] = useState<{ kelas: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          const mapped = json.data.map((k: any) => ({ kelas: k.nama_kelas }));
          setData(mapped);
        } else {
          setError(json.detail || "Gagal mengambil data kelas");
        }
      } catch (err) {
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
        console.log(json.nama_kelas)
        alert(json.detail || "Gagal menghapus kelas");
        console.log(json.nama_kelas)
      }
    } catch (err) {
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
              data.map((row, idx) => (
                <tr
                  key={row.kelas + "-" + idx} // key unik
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
      )}
    </div>
  );
}
