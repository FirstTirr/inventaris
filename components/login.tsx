"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [nama_user, setNamaUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const togglePassword = () => setShowPassword((v) => !v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Debug: print runtime env and target URL
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_user, password }),
        credentials: "include",
      });

      // Debug: log response headers to check Set-Cookie
      for (const [k, v] of res.headers.entries())
        console.log(`RESP HEADER: ${k}: ${v}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login gagal");
      // Tidak perlu set cookie di frontend, backend sudah set cookie httponly
      // Langsung redirect ke halaman sesuai backend
      // Setelah login sukses, set cookie di browser domain frontend
      document.cookie = `user=${nama_user}; path=/; max-age=3600`;
      // Simpan juga ke localStorage
      localStorage.setItem("user", nama_user);
      console.log("Cookie user disimpan di domain frontend:", document.cookie);
      if (data.redirect_url) {
        window.location = data.redirect_url;
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      console.error("LOGIN failed:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden relative">
      {/* background image as element so we can scale it responsively */}
      <img
        src="/tefa.jpg"
        alt="background"
        className="absolute h-full items-center object-cover z-0"
      />
      {/* left/right side panels (desktop) colored #0A111B */}
      <div
        className="hidden md:block absolute inset-y-0 left-0 w-1/4"
        style={{ backgroundColor: "#0A111B", zIndex: 11 }}
      />
      <div
        className="hidden md:block absolute inset-y-0 right-0 w-1/4"
        style={{ backgroundColor: "#0A111B", zIndex: 11 }}
      />
      {/* overlay intentionally transparent so it doesn't block the background */}

      {/* Judul kiri atas */}
      <div
        className="absolute left-2 top-8 text-white text-3xl md:text-4xl font-bold leading-tight font-[Montserrat,sans-serif] text-left select-none z-20"
        style={{ letterSpacing: 0, lineHeight: "1.1" }}
      >
        SISTEM
        <br />
        PEMANTAUAN
        <br />
        LABOR
      </div>
      {/* Logo kanan atas */}
      <img
        src="/tefa.jpg"
        alt="Logo SMK"
        className="rounded-full absolute right-4 top-8 w-27 h-27 object-contain z-30 ring-2 ring-white/30"
      />
      <div className="w-full flex flex-col items-center justify-center mt-8 relative z-20">
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight text-center mb-12 font-[Montserrat,sans-serif] text-gray-200"
          style={{ letterSpacing: 0 }}
        >
          LOGIN
        </h1>
        <div className="relative w-full max-w-[380px] flex flex-col items-center rounded-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1),_inset_0_1px_0_rgba(255,255,255,0.5),_inset_0_-1px_0_rgba(255,255,255,0.1),_inset_0_0_26px_13px_rgba(255,255,255,1.3)] bg-white/15 backdrop-blur-[32px] overflow-hidden pt-6 pb-4 px-6">
          <form
            className="w-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Nama User"
              className="w-full border border-gray-400 text-gray-200 rounded-md px-4 py-4 mb-6 text-base font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 font-[Montserrat,sans-serif]"
              value={nama_user}
              onChange={(e) => setNamaUser(e.target.value)}
              required
            />
            <div className="w-full relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-400 text-gray-200 rounded-md px-4 py-4 text-base font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 font-[Montserrat,sans-serif] pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Lihat password"
                }
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1877f2] hover:bg-blue-700 text-white font-bold text-lg rounded-md py-3 mt-2 mb-6 transition-all font-[Montserrat,sans-serif]"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          </form>

          {/* Segitiga dan label bawah tombol - sekarang di dalam glassmorphism */}
          <div className="relative w-full flex flex-col items-center">
            <svg
              width="220"
              height="40"
              viewBox="0 0 220 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0H220V40L110 20L0 40V0Z" fill="url(#paint0_linear)" />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="110"
                  y1="0"
                  x2="110"
                  y2="70"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1877f2" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-200 font-[Montserrat,sans-serif] text-center">
              TEFA RPL
              <br />
              BINARY CODING SPACE
            </span>
          </div>
        </div>
      </div>
      {/* Wave bottom - enlarged and stretched */}
      <div className="absolute bottom-0 left-0 w-full h-[220px] md:h-[320px] z-20 overflow-x-hidden pointer-events-none">
        <svg
          viewBox="0 0 1920 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 110C160 165 480 220 960 220C1440 220 1760 165 1920 110V220H0V110Z"
            fill="#BFE2FF"
          />
        </svg>
      </div>
    </div>
  );
}
