"use client";

import React, { useState, Suspense, lazy } from "react";
import {
  Binoculars,
  ShoppingCart,
  CirclePlus,
  ChevronDown,
  Table as TableIcon,
} from "lucide-react";
import TabelDropdownNav from "./TabelDropdownNav";
import Logo from "../Logo";

// Lazy load only when needed
const CrudAKun = lazy(() => import("./crudAkun"));
const MemantauAkun = lazy(() => import("./memantauAkun"));
const Product = lazy(() => import("../kabeng/product"));
const CrudLabor = lazy(() => import("./crudLabor"));
const TabelJurusan = lazy(() => import("./tabelJurusan"));
const TabelLabor = lazy(() => import("./tabelLabor"));
const TabelKelas = lazy(() => import("./tabelKelas"));
const TabelKategory = lazy(() => import("./tabelKategory"));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);
export default function NavAdmin() {
  // Default ke menu paling ringan
  const [active, setActive] = useState("Memantau Akun");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tabelSelected, setTabelSelected] = useState("Tabel Labor");
  const [tabelDropdownOpen, setTabelDropdownOpen] = useState(false);

  const menuItems = [
    { key: "Memantau Akun", label: "Memantau Akun" },
    { key: "Product", label: "Product" },
    {
      key: "Crud Labor",
      label: "Crud Labor",
      icon: <CirclePlus className="w-5 h-5" />,
    },
    {
      key: "Tabel",
      label: "Tabel",
      icon: <CirclePlus className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f8fa] flex-col md:flex-row">
      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-30 bg-blue-600 rounded-md p-2 flex flex-col gap-1 md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Buka menu navigasi"
        tabIndex={0}
        role="button"
      >
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>

      {/* Sidebar (desktop) */}
      <aside
        className="hidden md:flex fixed left-0 top-0 w-80 bg-gray-800 text-white flex-col py-25 px-8 min-h-screen shadow-lg border-r border-gray-200 z-20"
        role="navigation"
        aria-label="Sidebar admin"
      >
        <div className="mb-8 px-2 -mt-17 flex items-center gap-3">
          <Logo size="lg" showText={true} />
        </div>
        <nav>
          <ul className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <li key={item.key} className="relative">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                    active === item.key
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-100 text-white"
                  }`}
                  onClick={() => {
                    if (item.key === "Tabel") {
                      setActive(item.key);
                      setTabelDropdownOpen((prev) => !prev);
                    } else {
                      setActive(item.key);
                      setTabelDropdownOpen(false);
                    }
                  }}
                  aria-label={item.label}
                  tabIndex={0}
                  role="menuitem"
                >
                  {item.key === "Memantau Akun" && (
                    <Binoculars className="w-5 h-5" />
                  )}
                  {item.key === "Product" && (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {item.key === "Crud Labor" && (
                    <CirclePlus className="w-5 h-5" />
                  )}
                  {item.key === "Tabel" ? (
                    <span className="flex items-center">
                      <TableIcon className="w-5 h-5 mr-2" />
                      {item.label}
                      <ChevronDown
                        className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                          tabelDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  ) : (
                    item.label
                  )}
                </button>
                {/* Dropdown for Tabel */}
                {item.key === "Tabel" && tabelDropdownOpen && (
                  <TabelDropdownNav
                    selected={tabelSelected}
                    onSelect={setTabelSelected}
                  />
                )}
              </li>
            ))}
          </ul>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-gray-500 transition-all w-full justify-center mt-[3rem]"
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
        </nav>
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
          <aside className="relative w-72 max-w-[90vw] bg-gray-800 text-white flex flex-col py-8 px-6 min-h-screen shadow-lg animate-slideInLeft border-r border-gray-200">
            <div className="flex items-center justify-between mb-8 px-2">
              <div>
                <Logo size="md" showText={false} className="px-1.5 mt-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                DASHBOARD ADMIN
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
            <nav>
              <ul className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <li key={item.key}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-left ${
                        active === item.key
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-100 text-white"
                      }`}
                      onClick={() => {
                        if (item.key === "Tabel") {
                          setActive(item.key);
                          setTabelDropdownOpen((prev) => !prev);
                        } else {
                          setActive(item.key);
                          setTabelDropdownOpen(false);
                        }
                        setSidebarOpen(false);
                      }}
                    >
                      {item.key === "Memantau Akun" && (
                        <Binoculars className="w-5 h-5" />
                      )}
                      {item.key === "Product" && (
                        <ShoppingCart className="w-5 h-5" />
                      )}
                      {item.key === "Crud Labor" && (
                        <CirclePlus className="w-5 h-5" />
                      )}
                      {item.key === "Tabel" ? (
                        <span className="flex items-center">
                          <ChevronDown
                            className={`w-5 h-5 mr-1 transition-transform duration-200 ${
                              tabelDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                          {item.label}
                        </span>
                      ) : (
                        item.label
                      )}
                    </button>
                    {/* Dropdown for Tabel */}
                    {item.key === "Tabel" && tabelDropdownOpen && (
                      <TabelDropdownNav
                        selected={tabelSelected}
                        onSelect={setTabelSelected}
                      />
                    )}
                  </li>
                ))}
              </ul>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-gray-500 transition-all w-full justify-center mt-10"
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
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full md:pl-80">
        {/* Responsive header: show on all screens, smaller padding on mobile */}
        <header className="w-full bg-white border-b border-gray-400/70 px-4 py-3 md:px-8 md:py-4">
          <h2 className="text-lg md:text-xl font-semibold tracking-wide text-left text-gray-800">
            {active === "Crud Akun" && "CRUD AKUN"}
            {active === "Memantau Akun" && "MEMANTAU AKUN"}
            {active === "Product" && "PRODUCT"}
            {active === "Crud Labor" && "CRUD LABOR"}
          </h2>
        </header>
        <main className="p-2 md:p-8 overflow-x-auto">
          <Suspense fallback={<LoadingFallback />}>
            {active === "Product" && <Product />}
            {active === "Memantau Akun" && (
              <MemantauAkun onAddAkun={() => setActive("Crud Akun")} />
            )}
            {active === "Crud Akun" && (
              <CrudAKun onCancel={() => setActive("Memantau Akun")} />
            )}
            {active === "Crud Labor" && <CrudLabor />}
            {active === "Tabel" &&
              (tabelSelected === "Tabel Labor" ? (
                <TabelLabor />
              ) : tabelSelected === "Tabel Kelas" ? (
                <TabelKelas />
              ) : tabelSelected === "Tabel Kategory" ? (
                <TabelKategory />
              ) : tabelSelected === "Tabel Jurusan" ? (
                <TabelJurusan />
              ) : null)}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
