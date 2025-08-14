import React, { useState } from "react";

const initialData = [
  ["XI PPLG 3", "laptop gaming 10 juta", 9],
  ["X PPLG 20", "laptop gaming 10 juta", 30],
  ["X TJKT 6", "laptop gaming 10 juta", 4],
  ["XII DKV 3", "laptop gaming 10 juta", 6],
  ["X GAIB (BC)", "laptop gaming 10 juta", 99],
  ["X GAIB 3(BC)", "kamera mahal", 34],
  ["XII DKV 8", "laptop gaming 10 juta", 4],
];

export default function Home() {
  const [search, setSearch] = useState("");
  const filteredData = initialData.filter(([kelas, barang]) => {
    const s = search.toLowerCase();
    return (
      (typeof kelas === "string" && kelas.toLowerCase().includes(s)) ||
      (typeof barang === "string" && barang.toLowerCase().includes(s))
    );
  });
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
              placeholder="cari nomor komputer"
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
                <th className="py-3 px-6 font-semibold bg-white">kelas</th>
                <th className="py-3 px-6 font-semibold bg-white">
                  nama barang
                </th>
                <th className="py-3 px-6 font-semibold bg-white">jumlah</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(([kelas, barang, jumlah], idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="py-3 px-6 font-sans font-semibold text-black text-lg md:text-xl">
                    {kelas}
                  </td>
                  <td className="py-3 px-6 font-sans font-semibold text-black text-lg md:text-xl">
                    {barang}
                  </td>
                  <td className="py-3 px-6 font-sans font-bold text-black text-lg md:text-xl text-center">
                    {jumlah}
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
