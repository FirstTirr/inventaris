import React from "react";

const About = () => {
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
          <button className="bg-red-700 text-white font-medium rounded-xl px-6 sm:px-8 py-5 sm:py-6 shadow hover:bg-red-800 transition-all text-xs sm:text-base">
            LIHAT DAFTAR BARANG
            <br />
            JURUSAN REKAYASA PERANGKAT LUNAK
          </button>
          <button className="bg-gray-500 text-white font-medium rounded-xl px-6 sm:px-8 py-5 sm:py-6 shadow hover:bg-gray-600 transition-all text-xs sm:text-base">
            LIHAT DAFTAR BARANG
            <br />
            JURUSAN DESAIN KOMUNIKASI VISUAL
          </button>
          <button className="bg-teal-500 text-black font-medium rounded-xl px-6 sm:px-8 py-5 sm:py-6 shadow hover:bg-teal-600 transition-all text-xs sm:text-base">
            LIHAT DAFTAR BARANG
            <br />
            JURUSAN TEKNIK KOMPUTER DAN JARINGAN
          </button>
          <button className="bg-black text-white font-medium rounded-xl px-6 sm:px-8 py-5 sm:py-6 shadow hover:bg-gray-800 transition-all text-xs sm:text-base">
            LIHAT DAFTAR BARANG
            <br />
            JURUSAN BROADCASTING
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
