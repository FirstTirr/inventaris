"use client";

import React, { useState } from "react";
import Image from "next/image";
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
    setError("");``
    try {
      // Debug: print runtime env and target URL
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`;
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

      // Set cookie dan localStorage setelah login sukses
      try {
        document.cookie = `user=${nama_user}; path=/; max-age=3600`;
        localStorage.setItem("user", nama_user);
        console.log(
          "Cookie user disimpan di domain frontend:",
          document.cookie
        );
      } catch (errSet) {
        console.error("Gagal set cookie/localStorage:", errSet);
      }

      // Redirect setelah penyimpanan
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("LOGIN failed:", err);
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-indigo-50/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
      </div>

      {/* Header */}
      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto px-2 sm:px-4 md:px-6 mt-20 sm:mt-12 md:mt-0">
        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-3 sm:p-8 md:p-10 relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl sm:rounded-2xl md:rounded-3xl blur-xl -z-10"></div>

          {/* Header */}
          <div className="text-center mb-4 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r rounded-xl sm:rounded-2xl md:rounded-3xl mb-2 sm:mb-6 md:mb-8 shadow-lg">
              <Image
                src="/tefa.jpg"
                alt="Logo SMK"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow-lg ring-1 md:ring-2 ring-blue-100"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3">
              Welcome
            </h1>
            <p className="text-gray-600 text-xs sm:text-base md:text-lg font-semibold">
              SISTEM PEMANTAUAN <span className="text-blue-600">LABOR</span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4 sm:space-y-7" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-gray-700 block uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-lg sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50 text-base sm:text-lg"
                  value={nama_user}
                  onChange={(e) => setNamaUser(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-6">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-gray-700 block uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-lg sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50 pr-8 sm:pr-16 text-base sm:text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-6 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-2 flex items-center text-xs sm:text-sm mt-1">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 sm:py-5 rounded-lg sm:rounded-2xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl text-base sm:text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 sm:h-6 sm:w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <span className="text-sm font-bold text-blue-700 tracking-wide">
                  TEFA RPL • Binary Coding Space
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full blur-xl opacity-70"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-100 rounded-full blur-xl opacity-70"></div>
      <div className="absolute top-1/2 left-0 w-16 h-16 bg-purple-100 rounded-full blur-xl opacity-50"></div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full h-40 z-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="50%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
