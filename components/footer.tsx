import Link from "next/link";
import React from "react";
import Wm from "./wm";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-24 pt-12 pb-6 px-4 md:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-12 md:gap-0">
        <div className="flex flex-col gap-4 md:w-1/3">
          <div className="flex items-center gap-3">
            <img
              src="/tefa.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-full object-contain border-2 border-blue-500"
            />
            <span className="text-2xl font-bold text-white tracking-wide">
              Inventaris Labor
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-xs">
            Solusi Cerdas untuk Memonitoring Fasilitas Labor
          </p>
          <div className="flex gap-3 mt-2">
            <a
              href="https://instagram.com/rpl_centerofexcellent"
              className="hover:text-blue-400"
              aria-label="Instagram"
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-400" aria-label="Facebook">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M18 2h-3a4 4 0 0 0-4 4v3H7v4h4v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-400" aria-label="YouTube">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M22.54 6.42A2.78 2.78 0 0 0 20.7 4.6C19.13 4 12 4 12 4s-7.13 0-8.7.6A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.3 19.4c1.57.6 8.7.6 8.7.6s7.13 0 8.7-.6a2.78 2.78 0 0 0 1.84-1.82A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
              </svg>
            </a>
          </div>
          <div>
            <p className="text-sm">&copy; powered by TeFa RPL</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:w-1/3">
          <span className="text-lg font-semibold text-white mb-2">
            Navigasi Cepat
          </span>
          <a href="#slider-section" className="hover:text-blue-400">
            Home
          </a>
          <a href="#about-section" className="hover:text-blue-400">
            About
          </a>
          <a href="#berita-section" className="hover:text-blue-400">
            Berita
          </a>
        </div>
        <div className="flex flex-col gap-2 md:w-1/3">
          <span className="text-lg font-semibold text-white mb-2">Kontak</span>
          <span className="text-gray-400">TeFa RPL • Binary Coding Space</span>
          <span className="text-gray-400">
            Labor PK, Jl. Muchtar Latief, Padang Sikabu, Kec. Lamposi Tigo
            Nagori, Kota Payakumbuh, Sumatera Barat 26219
          </span>
          <span className="text-blue-500 hover:text-blue-700">
            <Link href="https://tefa-bcs.org">Website TeFa RPL</Link>
          </span>
          <span className="text-blue-500 hover:text-blue-700">
            <Link href="https://wa.me/6282284492933">Contact</Link>
          </span>
        </div>
      </div>
      <Wm/>
    </footer>
  );
}
