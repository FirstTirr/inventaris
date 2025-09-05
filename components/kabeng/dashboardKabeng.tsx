import React from "react";
import { useRouter } from "next/navigation";

const About = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      {/* Header */}

      {/* Content */}
      <div className="px-4 sm:px-8 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-center sm:text-left">
          Dashboard Overview
        </h2>
        <p className="text-gray-500 mb-8 sm:mb-16 text-center sm:text-left">
          Monitor your labor performance
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 max-w-md sm:max-w-3xl mx-auto mt-8 sm:mt-50">
          <button
            className="w-full h-32 bg-red-700 text-white font-medium rounded-xl px-4 py-4 shadow hover:bg-red-800 transition-all text-xs sm:text-base flex flex-col items-center justify-center"
            onClick={() => router.push("/rpl")}
          >
            <span className="block leading-tight">LIHAT DAFTAR BARANG</span>
            <span className="block mt-1 text-center font-extrabold">
              JURUSAN REKAYASA PERANGKAT LUNAK
            </span>
          </button>
          <button
            className="w-full h-32 bg-gray-500 text-white font-medium rounded-xl px-4 py-4 shadow hover:bg-gray-600 transition-all text-xs sm:text-base flex flex-col items-center justify-center"
            onClick={() => router.push("/dkv")}
          >
            <span className="block leading-tight">LIHAT DAFTAR BARANG</span>
            <span className="block mt-1 text-center font-extrabold">
              JURUSAN DESAIN KOMUNIKASI VISUAL
            </span>
          </button>
          <button
            className="w-full h-32 bg-teal-500 text-black font-medium rounded-xl px-4 py-4 shadow hover:bg-teal-600 transition-all text-xs sm:text-base flex flex-col items-center justify-center"
            onClick={() => router.push("/tkj")}
          >
            <span className="block leading-tight">LIHAT DAFTAR BARANG</span>
            <span className="block mt-1 text-center font-extrabold">
              JURUSAN TEKNIK KOMPUTER DAN JARINGAN
            </span>
          </button>
          <button
            className="w-full h-32 bg-black text-white font-medium rounded-xl px-4 py-4 shadow hover:bg-gray-800 transition-all text-xs sm:text-base flex flex-col items-center justify-center"
            onClick={() => router.push("/bc")}
          >
            <span className="block leading-tight">LIHAT DAFTAR BARANG</span>
            <span className="block mt-1 text-center font-extrabold">
              JURUSAN BROADCASTING
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
