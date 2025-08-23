"use client";
import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-white border border-gray-200 flex flex-col md:flex-row relative overflow-hidden">
      {/* Logo kanan atas */}
      <img
        src="/iconsmk-4.png"
        alt="Logo SMK"
        className="absolute right-8 top-8 w-28 h-28 object-contain z-10"
      />
      {/* Kiri: Judul */}
      <div className="md:w-[45%] w-full flex flex-col justify-start px-8 pt-12">
        <h1
          className="text-3xl md:text-4xl font-bold leading-tight text-left mt-8 mb-0 font-[Montserrat,sans-serif]"
          style={{ letterSpacing: 0 }}
        >
          SISTEM
          <br />
          PEMANTAUAN
          <br />
          LABOR
        </h1>
      </div>
      {/* Kanan: Form Login - sesuai kotak merah */}
      <div className="md:w-[55%] w-full flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          <div className="flex flex-col items-start w-full">
            <h2 className="text-6xl font-bold mb-10 text-left tracking-tight font-[Montserrat,sans-serif]">
              LOGIN
            </h2>
            <input
              type="text"
              placeholder="Username , email & phone number"
              className="w-full border border-gray-400 rounded-md px-4 py-4 mb-6 text-lg font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 font-[Montserrat,sans-serif]"
            />
            <div className="w-full relative mb-6">
              <input
                type="password"
                placeholder="Masukkan Password"
                className="w-full border border-gray-400 rounded-md px-4 py-4 text-lg font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 font-[Montserrat,sans-serif]"
              />
              <span className="absolute right-2 bottom-[-22px] text-xs text-gray-500 cursor-pointer select-none font-[Montserrat,sans-serif]">
                Forgot Password ?
              </span>
            </div>
            <button className="w-full bg-[#1877f2] hover:bg-blue-700 text-white font-bold text-xl rounded-md py-3 mt-2 mb-2 transition-all font-[Montserrat,sans-serif]">
              Login
            </button>
            {/* Segitiga dan label bawah tombol */}
            <div className="relative w-full flex flex-col items-center mt-4">
              <svg
                width="220"
                height="40"
                viewBox="0 0 220 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0H220V40L110 20L0 40V0Z"
                  fill="url(#paint0_linear)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="110"
                    y1="0"
                    x2="110"
                    y2="40"
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
        </div>
      </div>
      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 w-full h-40 z-0">
        <svg
          viewBox="0 0 1440 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M0 80C120 120 360 160 720 160C1080 160 1320 120 1440 80V160H0V80Z"
            fill="#BFE2FF"
          />
        </svg>
      </div>
    </div>
  );
}
