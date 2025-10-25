import React, { useState, useEffect, useMemo } from "react";

const LaporanBulanan = () => {
  const [selectedJurusan, setSelectedJurusan] = useState<string>("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedBulan, setSelectedBulan] = useState<string>("");
  const [selectedTahun, setSelectedTahun] = useState<string>("");

  // Data structure untuk pembukuan: [id, tanggal, nama_perangkat, jurusan, labor, jumlah_masuk, jumlah_keluar, keterangan]
  const [data, setData] = useState<
    [number, string, string, string, string, number, number, string][]
  >([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Generate list bulan dan tahun untuk filter
  const bulanList = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const tahunList = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year.toString();
  });

  // Fetch data pembukuan (simulasi - nanti connect ke API)
  useEffect(() => {
    // Simulasi data pembukuan
    const dummyData: [
      number,
      string,
      string,
      string,
      string,
      number,
      number,
      string
    ][] = [
      [
        1,
        "2025-10-01",
        "Laptop Dell",
        "RPL",
        "Lab RPL 1",
        5,
        0,
        "Pembelian baru",
      ],
      [
        2,
        "2025-10-05",
        "Mouse Wireless",
        "TKJ",
        "Lab TKJ 1",
        0,
        3,
        "Rusak/hilang",
      ],
      [
        3,
        "2025-10-10",
        "Keyboard Mechanical",
        "BC",
        "Lab BC 1",
        10,
        0,
        "Pembelian baru",
      ],
      [4, "2025-10-15", "Monitor LED", "DKV", "Lab DKV 1", 0, 2, "Dipindahkan"],
      [
        5,
        "2025-10-20",
        "Headset Gaming",
        "RPL",
        "Lab RPL 2",
        7,
        0,
        "Pembelian baru",
      ],
    ];

    setData(dummyData);
  }, [isOnline]);

  // Daftar jurusan unik untuk dropdown
  const jurusanList = useMemo(() => {
    const set = new Set<string>();
    data.forEach(([, , , jurusan]) => set.add(jurusan));
    return Array.from(set).sort();
  }, [data]);

  // Filter dan pagination
  const { paginatedData, totalPages, filteredLength } = useMemo(() => {
    let filtered = data;

    // Filter berdasarkan jurusan
    if (selectedJurusan) {
      filtered = filtered.filter(
        ([, , , jurusan]) => jurusan === selectedJurusan
      );
    }

    // Filter berdasarkan bulan
    if (selectedBulan) {
      const bulanIndex = bulanList.indexOf(selectedBulan) + 1;
      filtered = filtered.filter(([, tanggal]) => {
        const date = new Date(tanggal);
        return date.getMonth() + 1 === bulanIndex;
      });
    }

    // Filter berdasarkan tahun
    if (selectedTahun) {
      filtered = filtered.filter(([, tanggal]) => {
        const date = new Date(tanggal);
        return date.getFullYear().toString() === selectedTahun;
      });
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    const pages = Math.ceil(filtered.length / itemsPerPage);

    return {
      paginatedData: paginated,
      totalPages: pages,
      filteredLength: filtered.length,
    };
  }, [
    data,
    page,
    itemsPerPage,
    selectedBulan,
    selectedTahun,
    bulanList,
    selectedJurusan,
  ]);

  // Statistik cards dihapus sesuai permintaan; perhitungan total tidak digunakan lagi.

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8">
      <div className="w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Pembukuan Barang</h2>
        </div>

        {/* Statistik cards dihapus */}

        {!isOnline && (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada koneksi internet. Data tidak dapat dimuat.</p>
          </div>
        )}

        {isOnline && (
          <>
            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8 w-full">
              <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                <label htmlFor="jurusanFilter" className="sr-only">
                  Filter Jurusan
                </label>
                <select
                  id="jurusanFilter"
                  value={selectedJurusan}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-sm text-gray-700 px-2"
                  aria-label="Filter jurusan"
                >
                  <option value="">Semua Jurusan</option>
                  {jurusanList.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={selectedBulan}
                  onChange={(e) => setSelectedBulan(e.target.value)}
                  className="border rounded-lg px-4 py-2 text-base font-medium bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ minWidth: 150 }}
                  aria-label="Filter by bulan"
                >
                  <option value="">Semua Bulan</option>
                  {bulanList.map((bulan) => (
                    <option key={bulan} value={bulan}>
                      {bulan}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedTahun}
                  onChange={(e) => setSelectedTahun(e.target.value)}
                  className="border rounded-lg px-4 py-2 text-base font-medium bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ minWidth: 120 }}
                  aria-label="Filter by tahun"
                >
                  <option value="">Semua Tahun</option>
                  {tahunList.map((tahun) => (
                    <option key={tahun} value={tahun}>
                      {tahun}
                    </option>
                  ))}
                </select>
                <button
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-md shadow transition-all"
                  onClick={() => {}}
                  type="button"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                    <polyline points="10 9 9 9 8 9" />
                    <line x1="16" y1="5" x2="8" y2="5" />
                    <line x1="16" y1="11" x2="8" y2="11" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Cetak Laporan
                </button>
              </div>
            </div>

            {/* Tabel Pembukuan */}
            <div className="overflow-x-auto rounded-xl bg-white shadow font-sans w-full mt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4">
                {/* Dropdown and info left */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="itemsPerPage"
                    className="text-gray-600 text-sm font-medium"
                  >
                    Show
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Select number of entries per page"
                  >
                    {[10, 20, 30, 40, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-600 text-sm font-medium">
                    entries
                  </span>
                </div>
                {/* Info center */}
                <div className="text-gray-500 text-xs md:text-sm">
                  Showing {paginatedData.length} of {filteredLength} entries
                </div>
                {/* Pagination right */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-2 py-1 border rounded text-sm text-gray-700 bg-white disabled:bg-gray-200 disabled:text-gray-400"
                      aria-label="Previous page"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-2 py-1 border rounded text-sm font-semibold transition-colors duration-150 ${
                            page === p
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                          }`}
                          aria-label={`Go to page ${p}`}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-2 py-1 border rounded text-sm text-gray-700 bg-white disabled:bg-gray-200 disabled:text-gray-400"
                      aria-label="Next page"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
              <table className="min-w-full">
                <thead>
                  <tr className="text-gray-500 text-xs font-semibold border-b">
                    <th className="py-3 px-6 text-left">Tanggal</th>
                    <th className="py-3 px-6 text-left">Nama Perangkat</th>
                    <th className="py-3 px-6 text-center">Jurusan</th>
                    <th className="py-3 px-6 text-center">Labor</th>
                    <th className="py-3 px-6 text-center">Barang Masuk</th>
                    <th className="py-3 px-6 text-center">Barang Keluar</th>
                    <th className="py-3 px-6 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(
                    (
                      [
                        id,
                        tanggal,
                        nama_perangkat,
                        jurusan,
                        labor,
                        jumlah_masuk,
                        jumlah_keluar,
                        keterangan,
                      ]: [
                        number,
                        string,
                        string,
                        string,
                        string,
                        number,
                        number,
                        string
                      ],
                      idx: number
                    ) => (
                      <tr
                        key={id}
                        className="text-gray-700 border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="py-3 px-6 text-left">
                          {new Date(tanggal).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {nama_perangkat}
                        </td>
                        <td className="py-3 px-6 text-center">{jurusan}</td>
                        <td className="py-3 px-6 text-center">{labor}</td>
                        <td className="py-3 px-6 text-center">
                          <span className="text-green-600 font-semibold">
                            {jumlah_masuk > 0 ? `+${jumlah_masuk}` : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span className="text-red-600 font-semibold">
                            {jumlah_keluar > 0 ? `-${jumlah_keluar}` : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">{keterangan}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LaporanBulanan;
