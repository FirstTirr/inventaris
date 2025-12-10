"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaUserShield,
  FaUserTie,
  FaChalkboardTeacher,
  FaCamera,
  FaFingerprint,
  FaChartPie,
  FaShieldAlt,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaBolt,
  FaClock,
  FaMobileAlt,
  FaDatabase,
} from "react-icons/fa";
import Footer from "@/components/footer";
import { useTheme } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLight } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-white"
      } selection:bg-cyan-500 selection:text-slate-900 overflow-x-hidden font-sans`}
    >
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${
            isLight ? "bg-blue-400/20" : "bg-blue-600/20"
          }`}
        />
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] ${
            isLight ? "bg-cyan-400/20" : "bg-cyan-600/20"
          }`}
        />
        <div
          className={`absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[100px] ${
            isLight ? "bg-violet-400/10" : "bg-violet-600/10"
          }`}
        />
      </div>

      {/* Floating Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-4" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`mx-auto backdrop-blur-xl border rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${
              isLight
                ? "bg-white/80 border-slate-200 shadow-sm"
                : "bg-slate-900/80 border-white/10"
            } ${scrolled ? "shadow-lg shadow-cyan-500/5" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
                <img
                  src="/tefa.jpg"
                  alt="logo"
                  className="w-10 h-10 rounded-xl shadow-lg shadow-indigo-500/20"
                />
              </div>
              <span
                className={`text-xl font-bold tracking-tight ${
                  isLight ? "text-slate-800" : "text-white"
                }`}
              >
                Inventaris<span className="text-cyan-400"> Labor</span>
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {["Tentang", "Fitur", "Cara Kerja", "Akses"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className={`text-sm font-medium transition-colors relative group ${
                    isLight
                      ? "text-slate-600 hover:text-cyan-600"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA & Theme Toggle */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/login"
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] ${
                  isLight
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-white text-slate-900 hover:bg-cyan-50"
                }`}
              >
                Login
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              className={`md:hidden p-2 ${
                isLight ? "text-slate-800" : "text-white"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`absolute top-full left-4 right-4 mt-2 p-4 backdrop-blur-xl border rounded-2xl flex flex-col gap-4 md:hidden ${
              isLight
                ? "bg-white/95 border-slate-200 shadow-xl"
                : "bg-slate-900/95 border-white/10"
            }`}
          >
            {["Tentang", "Fitur", "Cara Kerja", "Akses"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-medium ${
                  isLight
                    ? "text-slate-600 hover:text-cyan-600"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item}
              </a>
            ))}
            <div className="flex items-center justify-between border-t pt-4 border-slate-200/10">
              <span
                className={`text-sm font-medium ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                Theme
              </span>
              <ThemeToggle />
            </div>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-3 bg-cyan-500 text-white rounded-xl font-bold"
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-cyan-300 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up ${
              isLight
                ? "bg-white/50 border-slate-200 text-cyan-600"
                : "bg-white/5 border-white/10 text-cyan-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            web-based labor inventory
          </div>

          <h1
            className={`text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-tight ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Inventaris Labor <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
              Berbasis Website
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Revolusi sistem inventaris sekolah dengan teknologi Website yang
            akurat, cepat, dan aman. Hilangkan Manipulasi Data fasilitas Labor
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="#cara-kerja"
              className="group relative px-8 py-4 bg-cyan-500 text-slate-900 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                <FaCamera /> Pelajari Lebih Lanjut
              </span>
            </Link>
            <a
              href="#akses"
              className={`px-8 py-4 border rounded-2xl font-bold text-lg transition-all hover:scale-105 backdrop-blur-sm ${
                isLight
                  ? "bg-white/50 border-slate-200 text-slate-700 hover:bg-white"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              Portal Akses
            </a>
          </div>

          {/* Stats Strip */}
          <div
            className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t pt-12 ${
              isLight ? "border-slate-200" : "border-white/10"
            }`}
          >
            {[
              { label: "Akurasi Model", value: "99.9%" },
              { label: "Kecepatan Scan", value: "< 1 Detik" },
              { label: "Siswa Terdaftar", value: "1,200+" },
              { label: "Uptime Server", value: "24/7" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div
                  className={`text-3xl font-bold mb-1 ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-24 relative z-10 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-3xl border p-8 md:p-16 relative overflow-hidden ${
              isLight
                ? "bg-white border-slate-200 shadow-xl"
                : "bg-linear-to-br from-slate-900 to-slate-950 border-white/10"
            }`}
          >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <h2
                  className={`text-3xl md:text-4xl font-bold mb-6 ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  Revolusi Pencatatan Fasilitas Labor
                </h2>
                <p
                  className={`mb-6 leading-relaxed ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Sistem Inventaris Labor bukan sekadar alat pencatatan. Ini
                  adalah langkah awal menuju digitalisasi manajemen aset sekolah
                  yang menyeluruh. Kami percaya bahwa efisiensi pengelolaan
                  fasilitas akan memberikan kenyamanan lebih bagi warga sekolah
                  untuk fokus pada hal yang paling penting:
                  <span className="text-cyan-400 font-semibold">
                    {" "}
                    Mencerdaskan Bangsa.
                  </span>
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    "Digital Inventory",
                    "Asset Tracking",
                    "Smart Lab",
                    "Real-time Monitoring",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-4 py-2 rounded-full border text-sm ${
                        isLight
                          ? "bg-slate-100 border-slate-200 text-slate-600"
                          : "bg-white/5 border-white/10 text-slate-300"
                      }`}
                    >
                      # {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div
                    className={`p-6 rounded-2xl border backdrop-blur-sm ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-slate-800/50 border-white/5"
                    }`}
                  >
                    <div className="text-3xl font-bold text-cyan-400 mb-1">
                      0%
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">
                      Kecurangan
                    </div>
                  </div>
                  <div
                    className={`p-6 rounded-2xl border backdrop-blur-sm ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-slate-800/50 border-white/5"
                    }`}
                  >
                    <div className="text-3xl font-bold text-purple-400 mb-1">
                      50%
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">
                      Lebih Efisien
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div
                    className={`p-6 rounded-2xl border backdrop-blur-sm ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-slate-800/50 border-white/5"
                    }`}
                  >
                    <div className="text-3xl font-bold text-emerald-400 mb-1">
                      1k+
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">
                      Barang Terdata
                    </div>
                  </div>
                  <div
                    className={`p-6 rounded-2xl border backdrop-blur-sm ${
                      isLight
                        ? "bg-slate-50 border-slate-200"
                        : "bg-slate-800/50 border-white/5"
                    }`}
                  >
                    <div className="text-3xl font-bold text-rose-400 mb-1">
                      24h
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">
                      Monitoring
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="fitur"
        className={`py-24 relative z-10 scroll-mt-28 ${
          isLight ? "bg-slate-50/50" : "bg-slate-900/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Teknologi Masa Depan
            </h2>
            <p
              className={`max-w-2xl mx-auto ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Kami menggabungkan hardware canggih dan software cerdas untuk
              menciptakan pencatatan fasilitas labor yang sempurna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaDatabase />,
                title: "Database Terpusat",
                desc: "Sistem pencatatan barang yang terintegrasi dalam satu database pusat, memudahkan pelacakan dan pengelolaan aset laboratorium.",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/20",
              },
              {
                icon: <FaChartPie />,
                title: "Analitik Real-time",
                desc: "Dashboard interaktif untuk memantau kondisi barang (baik/rusak) dan ketersediaan alat secara real-time dengan visualisasi intuitif.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20",
              },
              {
                icon: <FaShieldAlt />,
                title: "Keamanan Data",
                desc: "Akses sistem dilindungi dengan otentikasi bertingkat, memastikan hanya pihak berwenang yang dapat mengubah data inventaris.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
              },
              {
                icon: <FaBolt />,
                title: "Efisiensi Tinggi",
                desc: "Proses input, update, dan pencarian data barang dilakukan dengan cepat, menghemat waktu administrasi pengelolaan labor.",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10",
                border: "border-yellow-500/20",
              },
              {
                icon: <FaMobileAlt />,
                title: "Akses Multi-Platform",
                desc: "Kelola inventaris dari mana saja melalui perangkat desktop, tablet, maupun smartphone dengan tampilan yang responsif.",
                color: "text-pink-400",
                bg: "bg-pink-500/10",
                border: "border-pink-500/20",
              },
              {
                icon: <FaClock />,
                title: "Riwayat Peminjaman",
                desc: "Rekam jejak peminjaman dan pengembalian barang tercatat otomatis, memudahkan penelusuran penggunaan alat.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl backdrop-blur-md border transition-all duration-300 hover:-translate-y-2 group ${
                  isLight
                    ? "bg-white border-slate-200 shadow-sm hover:shadow-md"
                    : `bg-slate-950/50 ${feature.border} hover:border-opacity-50`
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`text-xl font-bold mb-4 ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`leading-relaxed text-sm ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="cara-kerja" className="py-24 relative z-10 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Cara Kerja Sistem
              </h2>
              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Input Data Barang",
                    desc: "Admin memasukkan data lengkap barang laboratorium ke dalam sistem, termasuk spesifikasi dan kondisi awal.",
                  },
                  {
                    step: "02",
                    title: "Pelabelan Aset",
                    desc: "Setiap barang diberi label atau kode unik untuk memudahkan identifikasi dan pelacakan fisik di laboratorium.",
                  },
                  {
                    step: "03",
                    title: "Manajemen Sirkulasi",
                    desc: "Proses peminjaman dan pengembalian barang tercatat secara digital, mengubah status ketersediaan secara real-time.",
                  },
                  {
                    step: "04",
                    title: "Laporan & Evaluasi",
                    desc: "Sistem menyajikan laporan kondisi aset dan riwayat penggunaan untuk bahan evaluasi pengadaan selanjutnya.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div
                      className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        isLight
                          ? "bg-white border border-slate-200 shadow-md text-cyan-600"
                          : "bg-slate-800 border border-slate-700 text-cyan-400"
                      }`}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold mb-2 ${
                          isLight ? "text-slate-900" : "text-white"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`${
                          isLight ? "text-slate-600" : "text-slate-400"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
              <div
                className={`relative rounded-3xl p-8 shadow-2xl ${
                  isLight
                    ? "bg-slate-900 border border-slate-800"
                    : "bg-slate-900 border border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-slate-500 text-sm font-mono">
                    System Status: Online
                  </div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Initializing Dashboard...</span>
                    <span className="text-green-400">OK</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Loading Asset Data...</span>
                    <span className="text-green-400">Done (120ms)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Syncing Inventory...</span>
                    <span className="text-green-400">Synced</span>
                  </div>
                  <div className="h-px bg-slate-800 my-4" />
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                        <FaDatabase className="text-slate-400" />
                      </div>
                      <div>
                        <div className="text-white font-bold">
                          Updating Stock...
                        </div>
                        <div className="text-cyan-400 animate-pulse">
                          Processing...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access Portal (The "Anti-mainstream" part) */}
      <section id="akses" className="py-24 relative z-10 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <h2
                className={`text-4xl font-bold mb-4 ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Portal Akses
              </h2>
              <p
                className={`max-w-md ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                Pilih gerbang masuk sesuai dengan peran Anda dalam ekosistem
                sekolah.
              </p>
            </div>
            <div className="h-1 w-full md:w-1/3 bg-linear-to-r from-cyan-500/50 to-transparent rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Administrator",
                role: "System Control",
                href: "/login",
                icon: <FaUserShield />,
                gradient: "from-blue-600 to-blue-900",
                accent: "border-blue-500/30",
              },
              {
                title: "Waka Sarana",
                role: "Student Monitor",
                href: "/login",
                icon: <FaUserTie />,
                gradient: "from-violet-600 to-violet-900",
                accent: "border-violet-500/30",
              },
              {
                title: "Kepala Sekolah",
                role: "Executive View",
                href: "/login",
                icon: <FaChalkboardTeacher />,
                gradient: "from-emerald-600 to-emerald-900",
                accent: "border-emerald-500/30",
              },
              {
                title: "Kepala Bengkel",
                role: "AI Terminal",
                href: "/login",
                icon: <FaCamera />,
                gradient: "from-rose-600 to-rose-900",
                accent: "border-rose-500/30",
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`group relative h-80 rounded-3xl overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:shadow-${
                  item.gradient.split("-")[1]
                }-500/20 ${
                  isLight ? "border-slate-200 shadow-lg" : item.accent
                }`}
              >
                {/* Card Background with Gradient */}
                <div
                  className={`absolute inset-0 bg-linear-to-b ${
                    item.gradient
                  } ${
                    isLight
                      ? "opacity-10 group-hover:opacity-20"
                      : "opacity-20 group-hover:opacity-40"
                  } transition-opacity duration-500`}
                />
                <div
                  className={`absolute inset-0 transition-colors duration-500 ${
                    isLight
                      ? "bg-white/80 group-hover:bg-white/60"
                      : "bg-slate-950/80 group-hover:bg-slate-950/60"
                  }`}
                />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div
                      className={`p-3 rounded-2xl backdrop-blur-md text-2xl group-hover:scale-110 transition-transform duration-300 ${
                        isLight
                          ? "bg-white shadow-sm text-slate-700"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                        isLight
                          ? "border-slate-300 group-hover:bg-slate-900 group-hover:text-white"
                          : "border-white/20 group-hover:bg-white group-hover:text-slate-900"
                      }`}
                    >
                      <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>

                  <div>
                    <p
                      className={`text-xs font-bold tracking-widest uppercase mb-2 ${
                        isLight ? "text-slate-500" : "text-white/50"
                      }`}
                    >
                      {item.role}
                    </p>
                    <h3
                      className={`text-2xl font-bold group-hover:translate-x-2 transition-transform duration-300 ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
}
