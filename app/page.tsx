"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  // Mobile menu toggle
  const [mobileOpen, setMobileOpen] = useState(false);

  // Simple AOS-like animation
  useEffect(() => {
    const setInitialAOS = () => {
      const elements = document.querySelectorAll<HTMLElement>("[data-aos]");
      elements.forEach((el) => {
        const type = el.getAttribute("data-aos");
        el.style.opacity = "0";
        if (type === "fade-up") el.style.transform = "translateY(40px)";
        else if (type === "fade-down") el.style.transform = "translateY(-40px)";
        else if (type === "fade-right")
          el.style.transform = "translateX(-40px)";
        else if (type === "fade-left") el.style.transform = "translateX(40px)";
        else if (type === "zoom-in") el.style.transform = "scale(0.8)";
      });
    };

    const animateOnScroll = () => {
      const elements = document.querySelectorAll<HTMLElement>("[data-aos]");
      const windowHeight = window.innerHeight;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 50) {
          const type = el.getAttribute("data-aos");
          const duration = Number(el.getAttribute("data-aos-duration") || 800);
          const delay = Number(el.getAttribute("data-aos-delay") || 0);
          el.style.transition = `all ${duration}ms cubic-bezier(.4,0,.2,1) ${delay}ms`;
          el.style.opacity = "1";
          if (type === "fade-up" || type === "fade-down")
            el.style.transform = "translateY(0)";
          else if (type === "fade-right" || type === "fade-left")
            el.style.transform = "translateX(0)";
          else if (type === "zoom-in") el.style.transform = "scale(1)";
        }
      });
    };

    setInitialAOS();
    animateOnScroll();
    window.addEventListener("scroll", animateOnScroll);
    return () => window.removeEventListener("scroll", animateOnScroll);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-gradient-to-br from-[#e1e7f6] via-[#f8f9fe] to-[#698ae8] min-h-screen">
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-lg border border-white/20 shadow-lg"
        data-aos="fade-down"
        data-aos-duration="800"
      >
        <header className="flex justify-between items-center px-6 md:px-20 py-3">
          {/* Logo */}
          <div className="flex items-center text-[#353ba7] font-bold text-xl">
            <span className="mr-2">✦</span>
            <img
              src="/tefa.jpg"
              alt="Logo"
              className="h-16 w-16 rounded-full"
            />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-10 ml-20 font-medium">
            <li>
              <a href="#Home" className="hover:text-[#353ba7]">
                Home
              </a>
            </li>
            <li>
              <a href="#About" className="hover:text-[#353ba7]">
                About
              </a>
            </li>
            <li>
              <a href="#perusahaan" className="hover:text-[#353ba7]">
                Fitur
              </a>
            </li>
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-4">
            <a
              href="/login"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#353ba7] via-[#698ae8] to-[#2d4286] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300 border-2 border-[#353ba7]"
            >
              Login
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl ml-4"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </header>

        {/* Mobile Menu */}
        {mobileOpen && (
          <ul className="flex flex-col space-y-4 px-6 pb-6 font-medium bg-white/80 backdrop-blur-md border-t">
            <li>
              <a
                href="#Home"
                className="hover:text-[#353ba7]"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#About"
                className="hover:text-[#353ba7]"
                onClick={() => setMobileOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#Features"
                className="hover:text-[#353ba7]"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="block w-full text-center px-6 py-2 rounded-lg bg-gradient-to-r from-[#353ba7] via-[#698ae8] to-[#2d4286] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300 border-2 border-[#353ba7]"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </a>
            </li>
          </ul>
        )}
      </nav>

      {/* Hero Section */}
      <HeroWithSlider />

      {/* Wave Divider */}
      <div className="-mt-12 mb-[-2px]">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24 md:h-32"
        >
          <path
            fill="url(#gradient)"
            fillOpacity="1"
            d="M0,32L60,37.3C120,43,240,53,360,69.3C480,85,600,107,720,106.7C840,107,960,85,1080,74.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          ></path>
          <defs>
            <linearGradient
              id="gradient"
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#e1e7f6" />
              <stop offset="0.5" stopColor="#698ae8" />
              <stop offset="1" stopColor="#353ba7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* About Section */}
      <section id="About" className="px-6 md:px-20 py-16 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image Side */}
          <div className="flex justify-center items-center">
            <img
              src="/tefa.jpg"
              alt="Siswa PKL"
              className="rounded-xl shadow-xl w-full max-w-[800px] h-[600px] object-cover object-center"
            />
          </div>
          {/* Content Side */}
          <div
            className="space-y-6"
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Solusi Cerdas untuk{" "}
              <span className="text-[#353ba7]">
                Memonitoring Fasilitas Labor
              </span>
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Sistem inventaris merupakan sebuah sistem yang dibangun oleh tim
              TeFa-BCS untuk memonitoring peralatan labor. Mulai penggunaan alat
              labor sampai kepada pemantau kerusahan alat labor. Masing-masing
              kepala bengkel, guru mapel produktif dan waka sarana memiliki
              akses untuk memonitoring
            </p>
            <div>
              <a
                href="#perusahaan"
                className="inline-block px-6 py-3 rounded-lg bg-[#353ba7] hover:bg-[#2d4286] transition duration-300 transform hover:scale-105 hover:shadow-lg text-white font-semibold text-center"
              >
                Mulai Sekarang →
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#2d4286] via-[#353ba7] to-[#698ae8] text-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 md:px-10 py-12">
          {/* Logo & About */}
          <div className="mx-auto md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-[#698ae8] p-2 rounded-lg">
                <img src="/tefa.jpg" alt="" className="h-12 w-12" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">
                TEFA RPL
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Lihat dan Cari Perusahaan Yang Anda Inginkan Sebagai tempat PKL
              Nanti
            </p>
          </div>

          {/* Product */}
          <div className="mx-auto">
            <h3 className="font-semibold text-white mb-4">Fitur</h3>
            <ul className="space-y-2">
              <li>
                <a href="#Home" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#Features" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#About" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#Contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#e1e7f6]/20 py-6 text-center text-gray-300 text-sm">
          © 2025 TEFA RPL. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function HeroWithSlider() {
  return (
    <section
      id="Home"
      className="flex flex-col md:flex-row justify-between items-center px-6 md:px-20 py-16 space-y-10 md:space-y-0"
    >
      {/* Left */}
      <div className="max-w-xl" data-aos="fade-right" data-aos-duration="1000">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          <span className="bg-gradient-to-r from-[#698ae8] via-[#353ba7] to-[#2d4286] bg-clip-text text-transparent">
            Monitoring Fasilitas
          </span>
          <br />
          Labor Anda Dengan Website Inventaris
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8">
          Anda bisa melihat penggunaan, laporan kerusakan, dan barang apa saja
          yang tersedia di labor, website ini memudahkan anda untuk memantau,
          dan mencatat fasilitas labor anda
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
          <a
            href="/login"
            className="px-6 py-3 rounded-lg bg-[#353ba7] hover:bg-[#2d4286] transition duration-300 transform hover:scale-105 hover:shadow-lg text-white font-semibold text-center"
          >
            Mulai Sekarang
          </a>
        </div>
      </div>

      {/* Right: Static Image */}
      <div className="mt-6 w-full md:w-auto flex justify-center">
        <img
          src="/tefa.jpg"
          alt="TEFA"
          className="w-full max-w-sm md:w-[460px] h-12 object-cover rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}

function CompanyCard({
  image,
  name,
  location,
  rating,
  reviews,
  quota,
  majors,
  updated,
}: {
  image: string;
  name: string;
  location: string;
  rating: string;
  reviews: string;
  quota: string;
  majors: string;
  updated: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-0 overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl w-full max-w-md mx-auto">
      <div className="relative w-full group bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <img
          src={image}
          alt={name}
          className="w-full h-[20rem] object-cover rounded-t-2xl"
        />
        <span className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {location}
        </span>
        <button
          className="absolute top-3 right-3 bg-white/90 hover:bg-blue-100 text-blue-600 rounded-full p-2 shadow transition"
          aria-label="expand"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <div className="p-4">
          <h3 className="text-base font-bold mb-1 text-gray-900 group-hover:text-blue-700 transition">
            {name}
          </h3>
          <div className="flex items-center gap-1 mb-1">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.174 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
              </svg>
              <span className="ml-1 text-blue-600 font-semibold">{rating}</span>
            </span>
            <span className="text-gray-500 text-xs">({reviews})</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 17l-4 4m0 0l-4-4m4 4V3"
              />
            </svg>
            <span className="text-gray-600 text-sm">
              Kuota:{" "}
              <span className="font-semibold text-[#353ba7]">{quota}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z"
              />
            </svg>
            <span className="text-[#353ba7] font-bold text-sm">{majors}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 17l4 4 4-4m-4-5v9"
              />
            </svg>
            {updated}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="group">
      <div className="text-3xl md:text-4xl font-bold text-[#353ba7] mb-2 group-hover:scale-110 transition-transform">
        {value}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}
