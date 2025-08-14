"use client";
import React, { useState } from "react";
import Product from "./product";
import About from "./dashboardKabeng";
import LastUser from "@/components/lastUser";
import TerimaLaporan from "./terimaLaporan";

export default function Navbar() {
  const [active, setActive] = useState("dashboard");
  function handleChangePage(page: string) {
    setActive(page);
  }
  return (
    <>
      <header className="w-full bg-white border-b border-black/30">
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-2 gap-2">
          <div className="flex-1 flex justify-start w-full">
            <h1 className="text-lg sm:text-2xl font-semibold tracking-wide text-left">
              {active === "dashboard" && "DASHBOARD KABENG/KAPROG"}
              {active === "product" && "PRODUK MANAGEMENT"}
              {active === "user" && "LIHAT PENGGUNA LABOR TERAKHIR"}
              {active === "laporan" && "LAPORAN"}
            </h1>
          </div>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-gray-500 transition-all sm:ml-4 w-full sm:w-auto justify-center">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </div>
        <nav className="w-full border-b border-black/10 bg-white overflow-x-auto">
          <ul className="flex gap-4 sm:gap-8 py-2 text-sm sm:text-base font-medium px-4 sm:px-9 whitespace-nowrap">
            <li>
              <button
                className="hover:underline bg-transparent border-none outline-none cursor-pointer"
                onClick={() => handleChangePage("dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className="hover:underline bg-transparent border-none outline-none cursor-pointer"
                onClick={() => handleChangePage("product")}
              >
                Produk
              </button>
            </li>
            <li>
              <button
                className="hover:underline bg-transparent border-none outline-none cursor-pointer"
                onClick={() => handleChangePage("user")}
              >
                user
              </button>
            </li>
            <li>
              <button
                className="hover:underline bg-transparent border-none outline-none cursor-pointer"
                onClick={() => handleChangePage("laporan")}
              >
                laporan
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="p-4">
        {active === "dashboard" && <About/>}
        {active === "product" && <Product />}
        {active === "user" && <LastUser/>}
        {active === "laporan" && <TerimaLaporan/>}
      </main>
    </>
  );
}
