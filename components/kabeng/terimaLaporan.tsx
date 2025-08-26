import React, { useState, useEffect } from "react";

export default function TerimaLaporan() {
  const [laporan, setLaporan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLaporan = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/kabeng/laporan`);
        if (!res.ok) throw new Error("Gagal mengambil data laporan");
        const data = await res.json();
        setLaporan(data.data || []);
      } catch (err) {
        setError("Gagal mengambil data laporan");
      } finally {
        setLoading(false);
      }
    };
    fetchLaporan();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-2">
          <h2 className="text-3xl font-bold mb-0">damaged goods report</h2>
          <div className="text-gray-500 text-base font-normal">
            monitor damage to goods in the labor
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl bg-white shadow font-sans mt-6">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm font-semibold border-b">
                <th className="py-3 px-6 font-semibold bg-white">Labor</th>
                <th className="py-3 px-6 font-semibold bg-white">Perangkat</th>
                <th className="py-3 px-6 font-semibold bg-white">
                  Jenis Kerusakan
                </th>
                <th className="py-3 px-6 font-semibold bg-white">
                  Tanggal Lapor
                </th>
              </tr>
            </thead>
            <tbody>
              {laporan.map((item: any, idx: number) => (
                <tr
                  key={item.id_laporan || idx}
                  className="border-b last:border-b-0"
                >
                  <td className="py-3 px-6">{item.nama_labor}</td>
                  <td className="py-3 px-6">{item.nama_perangkat}</td>
                  <td className="py-3 px-6">{item.jenis_kerusakan}</td>
                  <td className="py-3 px-6">{item.tanggal_lapor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
