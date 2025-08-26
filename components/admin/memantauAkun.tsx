import React from "react";
import { Trash2, UserPlus } from "lucide-react";

const users = [
  { nama: "kingkabeng", password: "kabeng123" },
  { nama: "kingkabeng", password: "kabeng123" },
];

// Komponen ini sekarang hanya menampilkan tabel dan tombol Tambahkan Akun,
// tombol akan memanggil fungsi prop onAddAkun jika ada
export default function MemantauAkun({
  onAddAkun,
}: {
  onAddAkun?: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f8] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-1 mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-left font-[Montserrat,sans-serif]">
            Monitoring User
          </h1>
          <div className="flex flex-col items-end gap-2">
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow"
              onClick={onAddAkun}
            >
              <UserPlus size={20} /> Tambahkan Akun
            </button>
            {/* Tombol tutup tidak diperlukan di sini, karena tab akan berpindah */}
          </div>
        </div>
        <p className="text-gray-500 text-base font-normal mb-8 text-left font-[Montserrat,sans-serif]">
          view last users
        </p>
        {/* Card Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 rounded-xl p-6 text-white flex flex-col justify-between shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Kabeng</span>
              <span className="text-3xl font-bold">12</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              
              <span className="text-sm">TOTAL KABENG/KAPROG </span>
            </div>
          </div>
          <div className="bg-green-500 rounded-xl p-6 text-white flex flex-col justify-between shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Waka Sarana</span>
              <span className="text-3xl font-bold">8</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              
              <span className="text-sm">TOTAL WAKA SARANA</span>
            </div>
          </div>
          <div className="bg-red-500 rounded-xl p-6 text-white flex flex-col justify-between shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Guru</span>
              <span className="text-3xl font-bold">20</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              
              <span className="text-sm">TOTAL GURU</span>
            </div>
          </div>
          <div className="bg-gray-400 rounded-xl p-6 text-white flex flex-col justify-between shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Kepala Sekolah</span>
              <span className="text-3xl font-bold">3</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">TOTAL KEPALA SEKOLAH</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl bg-white shadow p-4 sm:p-8">
          <table className="min-w-full rounded-xl overflow-hidden text-xs sm:text-base">
            <thead>
              <tr>
                <th className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-xs sm:text-sm font-[Montserrat,sans-serif]">nama</th>
                <th className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-xs sm:text-sm font-[Montserrat,sans-serif]">password</th>
                <th className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-xs sm:text-sm font-[Montserrat,sans-serif]">action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx}>
                  <td className="py-4 sm:py-8 px-2 sm:px-6 text-left text-base sm:text-2xl font-bold text-black font-[Montserrat,sans-serif] border-b border-gray-300">{user.nama}</td>
                  <td className="py-4 sm:py-8 px-2 sm:px-6 text-left text-base sm:text-2xl font-bold text-black font-[Montserrat,sans-serif] border-b border-gray-300">{user.password}</td>
                  <td className="py-4 sm:py-8 px-2 sm:px-6 text-left border-b border-gray-300 align-middle">
                    <button className="hover:text-red-600">
                      <Trash2 size={20} className="sm:w-7 sm:h-7" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
