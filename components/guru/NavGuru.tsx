"use client";
import React, { useState } from "react";
import LaporanKerusakanBarang from "./laporanKerusakan";
import InputKelas from "./inputKelas";

export default function NavGuru() {
  const [active, setActive] = useState("membuat laporan");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar menu items
  const menuItems = [
    {
      key: "membuat laporan",
      label: "Membuat Laporan",
    },
    {
      key: "input kelas pengguna",
      label: "Input Kelas Pengguna",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-30 bg-blue-600 rounded-md p-2 flex flex-col gap-1 md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-80 bg-black text-white flex-col py-8 px-8 min-h-screen shadow-lg border-r border-gray-200">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold tracking-tight mb-6">
            DASHBOARD GURU
          </h1>
        </div>
        <nav className="flex-1">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                    active === item.key
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-100 text-wahite"
                  }`}
                  onClick={() => setActive(item.key)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-black rounded-md hover:bg-gray-500 transition-all w-full justify-center"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
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
          <aside className="relative w-72 max-w-[90vw] bg-black text-white flex flex-col py-8 px-6 min-h-screen shadow-lg animate-slideInLeft border-r border-gray-200">
            <div className="flex items-center justify-between mb-8 px-2">
              <h1 className="text-2xl font-bold tracking-tight">
                DASHBOARD GURU
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
                {menuItems.map((item) => (
                  <li key={item.key}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                        active === item.key
                          ? "bg-blue-600 text-black"
                          : "hover:bg-blue-100 text-white"
                      }`}
                      onClick={() => {
                        setActive(item.key);
                        setSidebarOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto pt-8">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-black rounded-md hover:bg-gray-500 transition-all w-full justify-center"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
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
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <header className="w-full bg-white border-b border-gray-400/70 px-8 py-4 md:block hidden">
          <h2 className="text-xl font-semibold tracking-wide text-left text-gray-800">
            {active === "membuat laporan" && "MEMBUAT LAPORAN"}
            {active === "input kelas pengguna" && "INPUT KELAS PENGGUNA"}
          </h2>
        </header>
        <main className="p-8">
          {active === "membuat laporan" && <LaporanKerusakanBarang />}
          {active === "input kelas pengguna" && <InputKelas />}
        </main>
      </div>
    </div>
  );
}
