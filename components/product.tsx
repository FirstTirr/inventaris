"use client";
import React from "react";
import { useState } from "react";

const initialData = [
  ["Laptop ThinkPad T470p", "009"],
  ["Laptop ThinkPad T470p", "012"],
  ["Laptop ThinkPad T470p", "010"],
  ["Laptop ThinkPad T470p", "010"],
  ["Laptop ThinkPad T470p", "010"],
  ["Laptop ThinkPad T470p", "010"],
  ["Laptop ThinkPad T470p", "010"],
  ["Laptop ThinkPad T470p", "010"],
];

const Product = () => {
  const [search, setSearch] = useState("");
  const filteredData = initialData.filter(
    ([, barang]) =>
      typeof barang === "string" &&
      barang.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Product Management</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
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
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow transition-all ml-auto">
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
              <circle cx="9" cy="9" r="8" />
              <line x1="9" y1="5" x2="9" y2="13" />
              <line x1="5" y1="9" x2="13" y2="9" />
            </svg>
            Add Product
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl bg-white shadow font-sans">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs font-semibold border-b">
                <th className="py-3 px-6 font-semibold bg-white">produk</th>
                <th className="py-3 px-6 font-semibold bg-white">nomor</th>
                <th className="py-3 px-6 font-semibold bg-white">actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(([produk, nomor], idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="py-3 px-6 font-bold">{produk}</td>
                  <td className="py-3 px-6 font-bold">{nomor}</td>
                  <td className="py-3 px-6">
                    <button className="inline-block mr-2" title="Edit">
                      {/* Ikon pensil tebal, warna hitam */}
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="black"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M16.474 5.474a2.121 2.121 0 1 1 3 3L8.5 19.448l-4 1 1-4 10.974-10.974z" />
                      </svg>
                    </button>
                    <button className="inline-block" title="Delete">
                      {/* Ikon trash tebal, warna hitam */}
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="black"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="3 6 21 6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <rect x="5" y="6" width="14" height="14" rx="2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="py-3 px-6 font-bold" colSpan={3}>
                  seterusnya
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Product;
