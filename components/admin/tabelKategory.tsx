import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function TabelKategory() {
  const [kategoriList, setKategoriList] = useState<{ kategori: string }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kategori`
        );
        const data = await res.json();
        if (res.ok && data.data) setKategoriList(data.data);
      } catch {}
      setLoading(false);
    };
    fetchKategori();
  }, []);
  // Handler hapus kategori
  const handleDelete = async (kategori: string) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kategori/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kategori }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal menghapus kategori");
      setKategoriList((prev) => prev.filter((k) => k.kategori !== kategori));
      alert("Kategori berhasil dihapus!");
    } catch (err: any) {
      alert(err.message || "Gagal menghapus kategori");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-4 md:p-8 overflow-x-auto">
      <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-4">
        Tabel Kategori
      </h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full text-sm md:text-base">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="px-4 py-2 text-left rounded-tl-xl">
                Kategori Barang
              </th>
              <th className="px-4 py-2 text-center rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {kategoriList.map((row, idx) => (
              <tr
                key={row.kategori}
                className="border-b last:border-b-0 hover:bg-blue-50 transition"
              >
                <td className="px-4 py-2">{row.kategori}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold px-2"
                    title="Hapus"
                    onClick={() => handleDelete(row.kategori)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
