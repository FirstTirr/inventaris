"use client";
import React, { useState } from "react";
import { ShoppingCart, User, Flag } from "lucide-react";
import { Product } from "./product";
import About from "./dashboardKabeng";
import LastUser from "@/components/kabeng/lastUser";
import TerimaLaporan from "./terimaLaporan";
import Logo from "../Logo";

export default function Navbar() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleChangePage(page: string) {
    setActive(page);
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-30 bg-black rounded-md p-2 flex flex-col gap-1 md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 w-94 bg-[#181F2A] text-white flex-col py-8 px-8 min-h-screen shadow-lg z-20">
        <div className="mb-8 px-2">
          <div className="mb-8 px-2 mt-2 flex items-center gap-3">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-6">
            KABENG/KAPROG
          </h1>
        </div>
        <nav className="flex-1">
          <ul className="flex flex-col gap-2">
            <li>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                  active === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-[#232e3c] text-gray-200"
                }`}
                onClick={() => handleChangePage("dashboard")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="align-middle"
                >
                  <path
                    d="M3 10.75L12 4l9 6.75M4.5 10.75V19a1 1 0 001 1h3.5a1 1 0 001-1v-3.5a1 1 0 011-1h2a1 1 0 011 1V19a1 1 0 001 1h3.5a1 1 0 001-1v-8.25"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                  active === "product"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-[#232e3c] text-gray-200"
                }`}
                onClick={() => handleChangePage("product")}
              >
                <ShoppingCart size={20} />
                Produk
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                  active === "user"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-[#232e3c] text-gray-200"
                }`}
                onClick={() => handleChangePage("user")}
              >
                <User size={20} />
                User
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                  active === "laporan"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-[#232e3c] text-gray-200"
                }`}
                onClick={() => handleChangePage("laporan")}
              >
                <Flag size={20} />
                Laporan
              </button>
            </li>
          </ul>
        </nav>
        <div className="mt-auto scroll-pt-80">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-gray-500 transition-all w-full justify-center"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
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
      </aside>

      {/* Sidebar Drawer (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 max-w-[90vw] bg-[#181F2A] text-white flex flex-col py-8 px-6 min-h-screen shadow-lg animate-slideInLeft">
            <div className="flex items-center justify-between mb-8 px-2">
              <div>
                <Logo size="md" showText={false} className="px-1.5 mt-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                KABENG/KAPROG
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Tutup sidebar"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1">
              <ul className="flex flex-col gap-2">
                <li>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                      active === "dashboard"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-[#232e3c] text-gray-200"
                    }`}
                    onClick={() => handleChangePage("dashboard")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="align-middle"
                    >
                      <path
                        d="M3 10.75L12 4l9 6.75M4.5 10.75V19a1 1 0 001 1h3.5a1 1 0 001-1v-3.5a1 1 0 011-1h2a1 1 0 011 1V19a1 1 0 001 1h3.5a1 1 0 001-1v-8.25"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                      active === "product"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-[#232e3c] text-gray-200"
                    }`}
                    onClick={() => handleChangePage("product")}
                  >
                    <ShoppingCart size={20} />
                    Produk
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                      active === "user"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-[#232e3c] text-gray-200"
                    }`}
                    onClick={() => handleChangePage("user")}
                  >
                    <User size={20} />
                    User
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                      active === "laporan"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-[#232e3c] text-gray-200"
                    }`}
                    onClick={() => handleChangePage("laporan")}
                  >
                    <Flag size={20} />
                    Laporan
                  </button>
                </li>
              </ul>
            </nav>
            <div className="mt-auto pt-8">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-gray-500 transition-all w-full justify-center"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
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
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full md:pl-[23.5rem]">
        {" "}
        {/* 94 * 0.25rem = 23.5rem */}
        <header>
          <h1 className="text-2xl font-semibold tracking-wide text-left text-gray-800">
            {active === "dashboard" && ""}
            {active === "product" && ""}
            {active === "user" && ""}
            {active === "laporan" && ""}
          </h1>
        </header>
        <main className="p-2 md:p-8 overflow-x-auto min-h-screen">
          {active === "dashboard" && <About />}
          {active === "product" && <Product />}
          {active === "user" && <LastUser />}
          {active === "laporan" && <TerimaLaporan />}
        </main>
      </div>
    </div>
  );
}
