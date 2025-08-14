import React, { useState } from "react";

const initialData = [
  ["laptop 10 juta", "labor pk", "mati total", "10-15-2025"],
  [
    "kamera 13 juta",
    "labor broadcasting",
    "lensa kamera pecah dikit",
    "27-07-2025",
  ],
  [
    "Pc gaming RTX 5090 25 juta",
    "labor rpl (labor peak)",
    "meledak karena di geber",
    "22-02-22",
  ],
  [
    "laptop thinkpad (laptop peak)",
    "labor rpl (labor peak)",
    "install linux malah cernel panic",
    "27-07-20",
  ],
];

export default function TerimaLaporan() {
  const [search, setSearch] = useState("");
  const filteredData = initialData.filter(([barang, labor]) => {
    const s = search.toLowerCase();
    return (
      (typeof barang === "string" && barang.toLowerCase().includes(s)) ||
      (typeof labor === "string" && labor.toLowerCase().includes(s))
    );
  });
  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-2">
          <h2 className="text-3xl font-bold mb-0">damaged goods report</h2>
          <div className="text-gray-500 text-base font-normal">
            monitor damage to goods in the labor
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 mt-6">
          <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
            <input
              type="text"
              placeholder="cari barang"
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
                <th className="py-3 px-6 font-semibold bg-white">
                  nama barang
                </th>
                <th className="py-3 px-6 font-semibold bg-white">labor</th>
                <th className="py-3 px-6 font-semibold bg-white">
                  jenis kerusakan
                </th>
                <th className="py-3 px-6 font-semibold bg-white">
                  tanggal pelaporan
                </th>
                <th className="py-3 px-6 font-semibold bg-white">actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(([barang, labor, kerusakan, tanggal], idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="py-3 px-6 font-sans font-semibold text-black text-lg md:text-xl">
                    {barang}
                  </td>
                  <td className="py-3 px-6 font-sans font-semibold text-black text-lg md:text-xl">
                    {labor}
                  </td>
                  <td className="py-3 px-6 font-sans font-semibold text-black text-lg md:text-xl">
                    {kerusakan}
                  </td>
                  <td className="py-3 px-6 font-sans font-semibold text-black text-lg md:text-xl">
                    {tanggal}
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="12" fill="#22C55E" />
                        <path
                          d="M8 12.5l3 3 5-5"
                          stroke="#fff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
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
