import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Product } from "@/components/kabeng/product";
import { useRouter } from "next/navigation";

const NavRpl = dynamic(() => import("@/components/barangRpl/NavRpl"), {
  ssr: false,
});
const NavBc = dynamic(() => import("@/components/barangBc/NavBc"), {
  ssr: false,
});
const NavDkv = dynamic(() => import("@/components/barangDkv/NavDkv"), {
  ssr: false,
});
const NavTkj = dynamic(() => import("@/components/barangTkj/NavTkj"), {
  ssr: false,
});

const navComponents = {
  rpl: <NavRpl />,
  bc: <NavBc />,
  dkv: <NavDkv />,
  tkj: <NavTkj />,
};

const DashboardKabeng = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<"rpl" | "bc" | "dkv" | "tkj">("rpl");
  return (
    <>
      <div className="min-h-screen w-full">
        <div className="min-h-screen bg-[#f7f7f8]">
          {/* Header */}
          <div className="px-4 sm:px-8 pt-8 pb-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-left">
              Dashboard Overview
            </h2>
            <p className="text-gray-500 mb-8 text-left">
              Monitor your labor performance
            </p>
          </div>
          {/* Statistik Card Area (merah) */}
          <div className="w-full px-2 sm:px-8 py-4">
            <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
              <div className="rounded-xl shadow flex flex-col items-center justify-center py-7 px-3 bg-red-700 text-white w-full">
                <div className="text-lg font-semibold mb-1">
                  JURUSAN REKAYASA PERANGKAT LUNAK
                </div>
                <button
                  className="bg-white text-gray-700 text-xs font-semibold rounded-full px-4 py-1 shadow hover:bg-gray-100 transition flex items-center gap-2 mt-3"
                  onClick={() => router.push("/rpl")}
                >
                  LIHAT DAFTAR BARANG
                </button>
              </div>
              <div className="rounded-xl shadow flex flex-col items-center justify-center py-7 px-3 bg-gray-500 text-white w-full">
                <div className="text-lg font-semibold mb-1">
                  JURUSAN DESAIN KOMUNIKASI VISUAL
                </div>
                <button
                  className="bg-white text-gray-700 text-xs font-semibold rounded-full px-4 py-1 shadow hover:bg-gray-100 transition flex items-center gap-2 mt-3"
                  onClick={() => router.push("/dkv")}
                >
                  LIHAT DAFTAR BARANG
                </button>
              </div>
              <div className="rounded-xl shadow flex flex-col items-center justify-center py-7 px-3 bg-teal-500 text-black w-full">
                <div className="text-lg font-semibold mb-1">
                  JURUSAN TEKNIK KOMPUTER DAN JARINGAN
                </div>
                <button
                  className="bg-white text-gray-700 text-xs font-semibold rounded-full px-4 py-1 shadow hover:bg-gray-100 transition flex items-center gap-2 mt-3"
                  onClick={() => router.push("/tkj")}
                >
                  LIHAT DAFTAR BARANG
                </button>
              </div>
              <div className="rounded-xl shadow flex flex-col items-center justify-center py-7 px-3 bg-black text-white w-full">
                <div className="text-lg font-semibold mb-1">
                  JURUSAN BROADCASTING
                </div>
                <button
                  className="bg-white text-gray-700 text-xs font-semibold rounded-full px-4 py-1 shadow hover:bg-gray-100 transition flex items-center gap-2 mt-3"
                  onClick={() => router.push("/bc")}
                >
                  LIHAT DAFTAR BARANG
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-8 pt-8 pb-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-left">
              Dashboard Overview
            </h2>
            <p className="text-gray-500 mb-8 text-left">
              Monitor your labor performance
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 w-full px-2 sm:px-8 py-8">
            {/* Left: Product Table */}
            <div className="flex-1 bg-white/90 rounded-2xl p-8 shadow-xl overflow-auto border border-gray-100">
              <Product hideStats />
            </div>
            {/* Right: Tabbed Jurusan */}
            <div className="w-full max-w-lg flex flex-col gap-4">
              <div className="flex gap-2 justify-center mb-2 flex-wrap">
                <button
                  className={`px-5 py-2 rounded-lg font-semibold text-base transition border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    selected === "rpl"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setSelected("rpl")}
                >
                  RPL
                </button>
                <button
                  className={`px-5 py-2 rounded-lg font-semibold text-base transition border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    selected === "bc"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setSelected("bc")}
                >
                  BC
                </button>
                <button
                  className={`px-5 py-2 rounded-lg font-semibold text-base transition border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    selected === "dkv"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setSelected("dkv")}
                >
                  DKV
                </button>
                <button
                  className={`px-5 py-2 rounded-lg font-semibold text-base transition border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    selected === "tkj"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setSelected("tkj")}
                >
                  TKJ
                </button>
              </div>
              <div className="bg-white/90 rounded-2xl shadow-xl p-6 min-h-[320px] max-h-[70vh] overflow-auto border border-gray-100">
                {navComponents[selected]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardKabeng;
