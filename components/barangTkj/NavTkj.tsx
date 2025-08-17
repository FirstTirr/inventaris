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
        <div className="flex items-center gap-8 px-8 py-1">
          <button
            className={`text-black font-medium text-base hover:underline ${
              active === "barang baik" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setActive("barang baik")}
          >
            barang baik
          </button>
          <button
            className={`text-black font-medium text-base hover:underline ${
              active === "barang rusak" ? "border-b-2 border-black" : ""
            }`}
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
