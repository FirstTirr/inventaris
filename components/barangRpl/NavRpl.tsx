"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BarangRusakRpl from "./barangRusakRpl";
import BarangBaikRpl from "./barangBaikRpl";

export default function NavRpl() {
  const router = useRouter();
  const [active, setActive] = useState("barang baik");

  return (
    <>
      <nav className="relative w-full bg-white">
        <div className="border-b border-black/30" />
        <div className="flex flex-col gap-2 px-8 py-2 sm:flex-row sm:items-center sm:gap-4">
          <button
            onClick={() => window.history.back()}
            className="mb-2 sm:mb-0 w-full sm:w-auto px-5 py-2 rounded-lg font-medium text-base bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm"
          >
            Kembali
          </button>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg font-medium text-base transition border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400
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
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg font-medium text-base transition border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400
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
        </div>
      </nav>
      <div className="px-8 py-4">
        <h2 className="text-xl font-semibold mb-4">
          {active === "barang baik" && ""}
          {active === "barang rusak" && ""}
        </h2>
        {active === "barang baik" && <BarangBaikRpl />}
        {active === "barang rusak" && <BarangRusakRpl />}
      </div>
    </>
  );
}
