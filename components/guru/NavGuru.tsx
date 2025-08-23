"use client";
import React, { useState } from "react";
import LaporanKerusakanBarang from "./laporanKerusakan";
import InputKelas from "./inputKelas";

export default function NavGuru() {
  const [active, setActive] = useState("membuat laporan");

  return (
    <>
      <header className="w-full bg-white border-b border-gray-400/70">
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <h1 className="text-xl font-semibold font-sans tracking-wide text-left">
            DASHBOARD GURU
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-black rounded-md hover:bg-gray-500 transition-all">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-log-out"
              viewBox="0 0 24 24"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            Log out
          </button>
        </div>
        <nav className="w-full border-b border-gray-400/70 bg-white overflow-x-auto">
          <ul className="flex gap-8 pl-6 py-2 text-base font-medium font-sans whitespace-nowrap">
            <li>
              <button
                className={`cursor-pointer bg-transparent border-none outline-none ${
                  active === "membuat laporan" ? "underline" : ""
                }`}
                onClick={() => setActive("membuat laporan")}
              >
                Membuat Laporan
              </button>
            </li>
            <li>
              <button
                className={`cursor-pointer bg-transparent border-none outline-none ${
                  active === "input kelas pengguna" ? "underline" : ""
                }`}
                onClick={() => setActive("input kelas pengguna")}
              >
                Input Kelas Pengguna
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <div className="px-8 py-4">
        <h2 className="text-xl font-semibold mb-4">
          {active === "membuat laporan" && ""}
          {active === "input kelas pengguna" && ""}
        </h2>
        {active === "membuat laporan" && <LaporanKerusakanBarang />}
        {active === "input kelas pengguna" && <InputKelas />}
      </div>
    </>
  );
}
