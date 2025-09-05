"use client";
import React, { useState } from "react";
import { House, User } from "lucide-react";
import DashboardKabeng from "../kabeng/dashboardKabeng";
import LastUser from "../kabeng/lastUser";

export default function NavKepsek() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "user", label: "User" },
  ];

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
          <h1 className="text-2xl font-bold tracking-tight mb-6">
            DASHBOARD WAKA SARANA
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
                  {item.key === "dashboard" && <House className="w-5 h-5" />}
                  {item.key === "user" && <User className="w-5 h-5" />}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div>
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
          <aside className="relative w-72 max-w-[90vw] bg-gray-800 text-white flex flex-col py-8 px-6 min-h-screen shadow-lg animate-slideInLeft border-r border-gray-200">
            <div className="flex items-center justify-between mb-8 px-2">
              <h1 className="text-2xl font-bold tracking-tight">
                DASHBOARD KEPSEK
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
                        setActive(item.key);
                        setSidebarOpen(false);
                      }}
                    >
                      {item.key === "dashboard" && (
                        <House className="w-5 h-5" />
                      )}
                      {item.key === "user" && <User className="w-5 h-5" />}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
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
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full md:pl-80">
        <header className="w-full bg-white border-b border-gray-400/70 px-4 py-3 md:px-8 md:py-4">
          <h2 className="text-lg font-semibold tracking-wide text-left text-gray-800">
            {active === "dashboard" && "DASHBOARD"}
            {active === "user" && "USER"}
          </h2>
        </header>
        <main className="p-8">
          {active === "dashboard" && <DashboardKabeng />}
          {active === "user" && <LastUser />}
        </main>
      </div>
    </div>
  );
}
