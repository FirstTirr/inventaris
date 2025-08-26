"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BarangRusakTkj from "./barangRusakTkj";
import BarangBaikTkj from "./BarangBaikTkj";

export default function NavRpl() {
  const router = useRouter();
  const [active, setActive] = useState("barang baik");

  return (
    <>
      <nav className="relative w-full bg-white">
        <div className="flex items-center justify-between px-8 py-3">
          <h1 className="text-2xl font-bold tracking-tight text-left">
            DASHBOARD KABENG/KAPROG
          </h1>
          <button
            className="flex items-center gap-2 px-6 py-2 bg-gray-400 text-black rounded-full hover:bg-gray-500 transition-all"
            style={{ height: 40 }}
            onClick={() => router.back()}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Kembali
          </button>
        </div>
        <div className="border-b border-black/30" />
        <div className="flex items-center gap-4 px-8 py-1">
          <button
            className={`px-5 py-2 rounded-lg font-medium text-base transition border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                active === "barang baik"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black hover:bg-blue-100"
              }
            `}
            style={{
              boxShadow:
                active === "barang baik"
                  ? "0 2px 8px rgba(59,130,246,0.10)"
                  : undefined,
            }}
            onClick={() => setActive("barang baik")}
          >
            barang baik
          </button>
          <button
            className={`px-5 py-2 rounded-lg font-medium text-base transition border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                active === "barang rusak"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black hover:bg-blue-100"
              }
            `}
            style={{
              boxShadow:
                active === "barang rusak"
                  ? "0 2px 8px rgba(59,130,246,0.10)"
                  : undefined,
            }}
            onClick={() => setActive("barang rusak")}
          >
            barang rusak
          </button>
        </div>
      </nav>
      <div className="px-8 py-4">
        <h2 className="text-xl font-semibold mb-4">
          {active === "barang baik" && ""}
          {active === "barang rusak" && ""}
        </h2>
        {active === "barang baik" && <BarangBaikTkj />}
        {active === "barang rusak" && <BarangRusakTkj />}
      </div>
    </>
  );
}
