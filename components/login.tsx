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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_user, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login gagal");
      // Redirect manual ke frontend route
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
        return;
      }
      alert("Login berhasil!");
      // Simpan token/user ke localStorage atau state jika perlu
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-cover">
      {/* Judul kiri atas */}
      <div
        className="absolute left-2 top-8 text-black text-3xl md:text-4xl font-bold leading-tight font-[Montserrat,sans-serif] text-left select-none"
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
        src="/iconsmk-4.png"
        alt="Logo SMK"
        className="absolute right-2 top-8 w-24 h-24 object-contain z-10"
      />
      <div className="w-full flex flex-col items-center justify-center mt-8">
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight text-center mb-12 font-[Montserrat,sans-serif]"
          style={{ letterSpacing: 0 }}
        >
          LOGIN
        </h1>
        <form
          className="w-full max-w-[380px] flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Nama User"
            className="w-full border border-gray-400 rounded-md px-4 py-4 mb-6 text-base font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 font-[Montserrat,sans-serif]"
            value={nama_user}
            onChange={(e) => setNamaUser(e.target.value)}
            required
          />
          <div className="w-full relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-400 rounded-md px-4 py-4 text-base font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 font-[Montserrat,sans-serif] pr-12"
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
            <span className="absolute right-2 bottom-[-22px] text-xs text-gray-500 cursor-pointer select-none font-[Montserrat,sans-serif]">
              Forgot Password ?
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-[#1877f2] hover:bg-blue-700 text-white font-bold text-lg rounded-md py-3 mt-2 mb-2 transition-all font-[Montserrat,sans-serif]"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        </form>
        {/* Segitiga dan label bawah tombol */}
        <div className="relative w-full flex flex-col items-center mt-4">
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
          <span className="absolute top-3 left-1/2 -translate-x-1/2 text-sm font-semibold text-black font-[Montserrat,sans-serif]">
            SMK NEGERI 4<br />
            PAYAKUMBUH
          </span>
        </div>
      </div>
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 w-full h-52 z-0 overflow-x-hidden">
        <svg
          viewBox="0 0 1920 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 64C160 96 480 128 960 128C1440 128 1760 96 1920 64V128H0V64Z"
            fill="#BFE2FF"
          />
        </svg>
      </div>
    </div>
  );
}
