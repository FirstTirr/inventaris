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

  // Fungsi helper frontend untuk membedah klaim di dalam token JWT buatan backend
  const decodeJwtPayload = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Gagal melakukan decode JWT token:", e);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_user, password }),
      });

      const rawText = await res.text();
      let data: any = {};
      
      try {
        data = JSON.parse(rawText);
      } catch (jsonErr) {
        if (res.ok && rawText.split('.').length === 3) {
          data = { fallback_token: rawText };
        } else {
          throw new Error("Respon dari server tidak valid (Bukan JSON).");
        }
      }

      if (!res.ok) throw new Error(data.detail || "Login gagal");

      try {
        const maxAge = 60 * 60; // 1 jam

        // Memindai token dari respon backend
        const token = 
          data.access_token || 
          data.token || 
          data.access || 
          data.fallback_token ||
          (data.data && (data.data.token || data.data.access_token));

        if (token) {
          // Simpan token di localStorage agar dibaca oleh interceptor API Axios/Fetch Bearer
          localStorage.setItem("token", String(token));
          // Set cookie token agar terdeteksi secara fisik di tab storage browser kamu
          document.cookie = `token=${token}; path=/; max-age=${maxAge}; samesite=Lax`;

          // Ekstrak data role langsung dari isi enkripsi token JWT milik backend
          const decoded = decodeJwtPayload(String(token));
          const currentRole = data.role || (decoded && decoded.role);

          if (currentRole) {
            localStorage.setItem("user_role", String(currentRole));
          }
        }

        // Set cookie 'user' pada origin frontend
        document.cookie = `user=${encodeURIComponent(
          nama_user,
        )}; path=/; max-age=${maxAge}; samesite=Lax`;

        localStorage.setItem("user", nama_user);
        localStorage.removeItem("user_jurusan");

        // Keperluan UI & Validasi Cetak Laporan
        sessionStorage.setItem("displayName", nama_user);
        sessionStorage.setItem("userPassword", password);

      } catch (errSet) {
        console.error("Gagal menyimpan session/cookie user:", errSet);
      }

      // Redirect berdasarkan instruksi backend atau fallback ke root
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

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto px-4 mt-20 sm:mt-12 md:mt-0">
        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl sm:rounded-2xl md:rounded-3xl blur-xl -z-10"></div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r rounded-2xl mb-4 shadow-lg">
              <Image
                src="/tefa.jpg"
                alt="Logo SMK"
                width={96}
                height={96}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-blue-200 shadow-lg ring-2 ring-blue-100"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Welcome
            </h1>
            <p className="text-gray-600 text-sm sm:text-base font-semibold uppercase tracking-wider">
              SISTEM PEMANTAUAN <span className="text-blue-600">LABOR</span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50 text-base"
                  value={nama_user}
                  onChange={(e) => setNamaUser(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
              <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50 pr-12 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center text-sm mt-2 animate-shake">
                <svg
                  className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">
                  TEFA RPL • Binary Coding Space
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decorative */}
      <div className="absolute bottom-0 left-0 w-full h-32 z-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#dbeafe"
            opacity="0.5"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
