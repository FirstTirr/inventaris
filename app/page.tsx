"use client";

import Footer from "@/components/footer";
import NoInspect from "@/components/NoInspect";
import Link from "next/link";
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
      <NoInspect />
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
              <a href="#Features" className="hover:text-[#353ba7]">
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

      {/* About — redesigned for comfort and smoothness */}
      <section
        id="About"
        className="min-h-[70vh] flex items-center justify-center px-6 md:px-20 py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Content */}
          <div
            className="space-y-6"
            data-aos="fade-right"
            data-aos-duration="900"
          >
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Solusi Cerdas untuk
              <br />
              <span className="text-[#353ba7]">
                Memonitoring Fasilitas Labor
              </span>
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
              Inventaris Labor memudahkan Anda melihat penggunaan alat, mencatat
              laporan kerusakan, dan memonitor stok secara real-time. Dirancang
              untuk kepala bengkel, guru produktif, dan waka sarana — cepat,
              mudah, dan dapat dipercaya.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#698ae8] to-[#353ba7] text-white flex items-center justify-center text-lg">
                  ⚡
                </div>
                <div>
                  <h4 className="font-semibold">Realtime Monitoring</h4>
                  <p className="text-sm text-gray-500">
                    Laporan dan stok terlihat langsung tanpa repot.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-green-400 to-cyan-500 text-white flex items-center justify-center text-lg">
                  🛡
                </div>
                <div>
                  <h4 className="font-semibold">Akses Terkontrol</h4>
                  <p className="text-sm text-gray-500">
                    Peran terpisah untuk Kabeng, Guru, dan Waka sarana.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="#Features"
                className="inline-block px-6 py-3 rounded-lg bg-[#353ba7] hover:bg-[#2d4286] text-white font-semibold transition"
              >
                Pelajari Fitur
              </a>
              <a
                href="/login"
                className="inline-block px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Masuk
              </a>
            </div>
          </div>

          {/* Image with floating stat card */}
          <div
            className="relative flex justify-center items-center"
            data-aos="fade-left"
            data-aos-duration="900"
          >
            <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.01]">
              <img
                src="/tefa.jpg"
                alt="Siswa PKL"
                className="w-full h-[420px] object-cover object-center"
              />
            </div>

            <div className="absolute -bottom-6 left-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100 w-[260px]">
              <div className="text-xs text-gray-500">Ringkasan</div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#353ba7]">
                    500+
                  </div>
                  <div className="text-xs text-gray-500">Barang</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#353ba7]">
                    10+
                  </div>
                  <div className="text-xs text-gray-500">Jurusan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#353ba7]">
                    24/7
                  </div>
                  <div className="text-xs text-gray-500">Akses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (converted to TSX) */}
      <section
        id="Features"
        className="min-h-screen flex flex-col items-center justify-center px-6 md:px-20 py-20 bg-gradient-to-br from-[#f8f9fe] via-[#e1e7f6] to-[#698ae8]/20"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Title */}
          <div
            className="text-center mb-12"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fitur Utama <span className="text-[#353ba7]">Inventaris</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Platform lengkap untuk memonitoring dan mengelola fasilitas labor
              Anda
            </p>
          </div>

          {/* Grid 1 */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
            data-aos="zoom-in"
            data-aos-duration="500"
          >
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-left transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-300 text-white text-2xl mb-4">
                ⚡
              </div>
              <h3 className="text-lg font-bold mb-2">Cetak Laporan</h3>
              <p className="text-gray-600 text-sm">
                Setiap kepala bengkel bisa mencetak laporan barang sesuai dengan
                jurusan nya masing masing
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-left transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-green-400 to-cyan-500 text-white text-2xl mb-4">
                🛡
              </div>
              <h3 className="text-lg font-bold mb-2">Laporan Kerusakan</h3>
              <p className="text-gray-600 text-sm">
                Guru mapel produktif bisa melaporkan barang yang rusak kepada
                kepala bengkel
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-left transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl mb-4">
                📊
              </div>
              <h3 className="text-lg font-bold mb-2">
                Pemantauan Langsung Oleh Kepala Sekolah
              </h3>
              <p className="text-gray-600 text-sm">
                Kepala Sekolah bisa memantau atau melihat barang yang ada di
                semua jurusan dan semua labor yang ada
              </p>
            </div>
          </div>

          {/* Grid 2 */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
            data-aos="zoom-in"
            data-aos-duration="500"
          >
            {/* Feature 4 */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-left transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-white text-2xl mb-4">
                👥
              </div>
              <h3 className="text-lg font-bold mb-2">Pemantauan Waka Sarana</h3>
              <p className="text-gray-600 text-sm">
                Waka Sarana Prasarana juga bisa memantau atau melihat barang
                yang ada di semua jurusan dan semua labor yang ada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function HeroWithSlider() {
  const images = [
    { src: "/homepagelaptop.jpg", title: "login page Inventaris" },
    { src: "/inv-kabeng.png", title: "Dashboard Kabeng" },
    { src: "/laporan-guru.png", title: "Laporan Guru" },
  ];

  type Slide = { src: string; title: string };
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(1);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);
  const ignoreNextEffectRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  // build slides with clones [last, ...images, first]
  useEffect(() => {
    setSlides([images[images.length - 1], ...images, images[0]]);
  }, []);

  // initial position after slides are set
  useEffect(() => {
    const track = trackRef.current;
    if (!track || slides.length === 0) return;
    const slidePercent = 100 / slides.length;
    // set to first real slide without animation
    track.style.transition = "none";
    track.style.transform = `translateX(-${slidePercent}%)`;
    setCurrent(1);
  }, [slides]);

  // auto-slide
  useEffect(() => {
    if (slides.length === 0) return;
    intervalRef.current = window.setInterval(() => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setCurrent((c) => c + 1);
    }, 4000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [slides]);

  // apply transform when current changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track || slides.length === 0) return;
    const slidePercent = 100 / slides.length;
    // if we are about to snap (ignoreNextEffectRef is true) don't animate here
    if (ignoreNextEffectRef.current) {
      // next effect should be ignored once
      ignoreNextEffectRef.current = false;
      return;
    }
    track.style.transition = "transform 0.5s";
    track.style.transform = `translateX(-${current * slidePercent}%)`;
  }, [current, slides]);

  const handleTransitionEnd = () => {
    const track = trackRef.current;
    if (!track || slides.length === 0) return;
    // finished an animated move
    isAnimatingRef.current = false;

    // if we're at a cloned slide, snap without animation to the real one
    if (current === slides.length - 1) {
      // clone of first -> jump to real first (index 1)
      const slidePercent = 100 / slides.length;
      ignoreNextEffectRef.current = true;
      track.style.transition = "none";
      track.style.transform = `translateX(-${1 * slidePercent}%)`;
      setCurrent(1);
    } else if (current === 0) {
      // clone of last -> jump to last real
      const lastReal = slides.length - 2;
      const slidePercent = 100 / slides.length;
      ignoreNextEffectRef.current = true;
      track.style.transition = "none";
      track.style.transform = `translateX(-${lastReal * slidePercent}%)`;
      setCurrent(lastReal);
    }
  };

  const prev = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrent((c) => c - 1);
  };

  const next = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrent((c) => c + 1);
  };

  return (
    <section
      id="Home"
      className="min-h-screen flex flex-col md:flex-row justify-between items-center px-6 md:px-20 py-12 md:py-16 space-y-12 md:space-y-0 md:space-x-16"
    >
      {/* Left */}
      <div
        className="flex-1 max-w-2xl"
        data-aos="fade-right"
        data-aos-duration="1000"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
          <span className="bg-gradient-to-r from-[#698ae8] via-[#353ba7] to-[#2d4286] bg-clip-text text-transparent">
            Monitoring Fasilitas
          </span>
          <br />
          Labor Anda Dengan Website Inventaris
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed">
          Anda bisa melihat penggunaan, laporan kerusakan, dan barang apa saja
          yang tersedia di labor, website ini memudahkan anda untuk memantau,
          dan mencatat fasilitas labor anda
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <a
            href="/login"
            className="px-8 py-4 rounded-lg bg-[#353ba7] hover:bg-[#2d4286] transition duration-300 transform hover:scale-105 hover:shadow-lg text-white font-semibold text-center"
          >
            Mulai Sekarang
          </a>
        </div>

        {/* Quick stats under hero paragraph */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex flex-col items-start sm:items-center gap-1">
              <div className="text-2xl md:text-3xl font-bold text-[#2563EB]">
                1000+
              </div>
              <div className="text-sm text-gray-500">Barang</div>
            </div>

            <div className="flex flex-col items-start sm:items-center gap-1">
              <div className="text-2xl md:text-3xl font-bold text-green-500">
                10+
              </div>
              <div className="text-sm text-gray-500">jurusan</div>
            </div>

            <div className="flex flex-col items-start sm:items-center gap-1">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">
                92%
              </div>
              <div className="text-sm text-gray-500">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Slider */}
      <div className="flex-1 flex justify-center md:justify-end">
        <div className="relative w-full max-w-xl md:max-w-3xl">
          <div className="overflow-hidden rounded-xl shadow-lg">
            <div
              className="flex"
              ref={trackRef}
              style={{ width: `${slides.length * 100}%` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 flex flex-col items-center"
                  style={{ width: `${100 / slides.length}%` }}
                >
                  <div className="relative w-full">
                    <img
                      src={img.src}
                      alt={`Gambar ${idx + 1}`}
                      className="w-full h-[280px] md:h-[360px] lg:h-[420px] object-cover rounded-xl"
                    />
                    <div
                      className="absolute left-0 right-0 bottom-0 h-32 rounded-b-xl"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent, #000000 90%)",
                      }}
                    />
                    <div className="absolute left-0 bottom-6 flex flex-col items-start pl-6">
                      <p className="text-left text-base md:text-lg font-semibold text-white drop-shadow mr-7 hidden md:block">
                        {img.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-70 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition transform hover:scale-105 shadow-md"
            aria-label="Prev"
          >
            &#8592;
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-70 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition transform hover:scale-105 shadow-md"
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
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
