"use client";
import React, { useState } from "react";

export default function AdminPage() {
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  // Hanya izinkan huruf dan angka
  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setNama(value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setPassword(value);
  };
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <header className="w-full border-b border-gray-300 bg-white flex items-center justify-between px-4 py-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          DASHBOARD ADMIN
        </h1>
        <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded transition font-medium">
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline"
          >
            <path d="M9 18l6-6-6-6" />
            <path d="M15 12H3" />
          </svg>
          Log out
        </button>
      </header>
      {/* Main Card */}
      <main className="flex justify-center items-center min-h-[80vh] px-2">
        <form className="w-full max-w-xl bg-white rounded-xl shadow border border-gray-200 p-10 flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-2">CRUD AKUN</h2>
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium">NAMA :</label>
            <input
              type="text"
              placeholder="NAMA"
              className="border border-gray-300 rounded px-3 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={nama}
              onChange={handleNamaChange}
              pattern="[a-zA-Z0-9]*"
              title="Hanya huruf dan angka"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium">PASSWORD:</label>
            <input
              type="password"
              placeholder="Masukkan Password"
              className="border border-gray-300 rounded px-3 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={handlePasswordChange}
              pattern="[a-zA-Z0-9]*"
              title="Hanya huruf dan angka"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium">ROLE:</label>
            <select
              className="border border-gray-300 rounded px-3 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={role}
              onChange={handleRoleChange}
              required
            >
              <option value="" disabled>
                Pilih Role
              </option>
              <option value="0">KABENG/KAPROG</option>
              <option value="1">GURU</option>
              <option value="2">WAKA SARANA</option>
              <option value="3">KEPALA SEKOLAH</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#2d2d2d] text-white rounded py-2 font-medium text-base mt-2 hover:bg-gray-800 transition"
          >
            SAVE
          </button>
        </form>
      </main>
    </div>
  );
}
