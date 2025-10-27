"use client";
import React, { useState, Suspense, lazy, useCallback } from "react";
import { Flag, FolderInput } from "lucide-react";
import Logo from "../Logo";
import { clearAllCookies } from "@/lib/utils";

// Lazy load heavy components
const LaporanKerusakan = lazy(() => import("./laporanKerusakan"));
const InputKelas = lazy(() => import("./inputKelas"));

// Optimized loading component
const LoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
));

LoadingFallback.displayName = "LoadingFallback";

const NavWasapras = React.memo(() => {
  const [active, setActive] = useState("laporan kerusakan");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { key: "laporan kerusakan", label: "Laporan Kerusakan" },
    { key: "input kelas", label: "Input Kelas" },
  ];

  const handleLogout = useCallback(() => {
      try {
        // Invalidate server session if applicable
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
          method: "POST",
          credentials: "include",
        }).catch(() => {});
      } catch {}
      try {
        clearAllCookies();
      } catch {}
      try {
        localStorage.clear();
      } catch {}
      try {
        sessionStorage.clear();
      } catch {}
      window.location.href = "/";
    }, []);

  return (
    <div className="flex min-h-screen bg-[#f7f8fa] flex-col md:flex-row">
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
      <aside className="hidden md:flex fixed left-0 top-0 w-80 bg-gray-800 text-white flex-col py-8 px-8 min-h-screen shadow-lg border-r border-gray-200 z-20">
        <div className="mb-8 px-2">
          <div className="mb-8 px-2 mt-2 flex items-center gap-3">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-6">
            DASHBOARD GURU
          </h1>
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
                  onClick={() => setActive(item.key)}
                >
                  {item.key === "laporan kerusakan" && (
                    <Flag className="w-5 h-5" />
                  )}
                  {item.key === "input kelas" && (
                    <FolderInput className="w-5 h-5" />
                  )}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-gray-500 transition-all w-full justify-center mt-[3rem]"
            onClick={() => {
              try {
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
                  method: "POST",
                  credentials: "include",
                }).catch(() => {});
              } catch {}
              try {
                if (typeof document !== "undefined") {
                  const cookies = document.cookie ? document.cookie.split("; ") : [];
                  const hostname = window.location.hostname;
                  const parts = hostname.split(".");
                  const rootDomain = parts.length >= 2 ? `.${parts.slice(-2).join(".")}` : hostname;
                  const dotHostname = hostname.startsWith(".") ? hostname : `.${hostname}`;
                  for (const c of cookies) {
                    const [k] = c.split("=");
                    if (k) {
                      const name = encodeURIComponent(k);
                      // default path
                      document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
                      // explicit domain variants
                      document.cookie = `${name}=; path=/; domain=${hostname}; max-age=0; samesite=lax`;
                      document.cookie = `${name}=; path=/; domain=${dotHostname}; max-age=0; samesite=lax`;
                      document.cookie = `${name}=; path=/; domain=${rootDomain}; max-age=0; samesite=lax`;
                    }
                  }
                }
              } catch {}
              try {
                localStorage.clear();
              } catch {}
              try {
                sessionStorage.clear();
              } catch {}
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
                DASHBOARD GURU
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Tutup Sidebar"
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
                        setActive(item.key);
                        setSidebarOpen(false);
                      }}
                    >
                      {item.key === "laporan kerusakan" && (
                        <Flag className="w-5 h-5" />
                      )}
                      {item.key === "input kelas" && (
                        <FolderInput className="w-5 h-5" />
                      )}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-gray-500 transition-all w-full justify-center mt-10"
                onClick={() => {
                  try {
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
                      method: "POST",
                      credentials: "include",
                    }).catch(() => {});
                  } catch {}
                  try {
                    clearAllCookies();
                  } catch {}
                  try {
                    localStorage.clear();
                  } catch {}
                  try {
                    sessionStorage.clear();
                  } catch {}
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
                Log Out
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
            {active === "laporan kerusakan" && "LAPORAN KERUSAKAN BARANG"}
            {active === "input kelas" && "INPUT KELAS YANG MENGGUNAKAN LABOR"}
          </h2>
        </header>
        <main className="p-2 md:p-8 overflow-x-auto">
          <Suspense fallback={<LoadingFallback />}>
            {active === "laporan kerusakan" && <LaporanKerusakan />}
            {active === "input kelas" && <InputKelas />}
          </Suspense>
        </main>
      </div>
    </div>
  );
});

NavWasapras.displayName = "NavWasapras";

export default NavWasapras;
