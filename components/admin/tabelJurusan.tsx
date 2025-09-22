import React, { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";

const TabelJurusan = React.memo(() => {
  const [jurusanList, setJurusanList] = useState<{ jurusan: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status detection
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
      return;
    }

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
  }, [isOnline]);

  const handleDelete = useCallback(
    async (jurusan: string) => {
      if (!isOnline) {
        alert("Tidak ada koneksi internet");
        return;
      }

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
    },
    [isOnline]
  );

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm p-4 md:p-8 overflow-x-auto">
        <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-4">
          Tabel Jurusan
        </h3>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm p-4 md:p-8 overflow-x-auto">
        <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-4">
          Tabel Jurusan
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>Tidak ada koneksi internet. Data tidak dapat dimuat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-4 md:p-8 overflow-x-auto">
      <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-4">
        Tabel Jurusan
      </h3>
      {jurusanList.length === 0 ? (
        <div className="text-center py-4 text-gray-400">
          Tidak ada data jurusan
        </div>
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
});

TabelJurusan.displayName = "TabelJurusan";

export default TabelJurusan;
