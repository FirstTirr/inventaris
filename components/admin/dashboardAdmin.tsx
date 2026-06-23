"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

// ─── Icon Components ───────────────────────────────────────────────
const IconLab = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const IconBox = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconClass = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

// ─── Interface Data dari Backend ──────────────────────────────────
interface Barang {
  id_barang?: number;
  id_perangkat?: number;
  nama_barang?: string;
  nama_perangkat?: string;
  kondisi?: string;
  status?: string;
  jumlah_barang?: number;
  jumlah?: number;
  nama_jurusan?: string; // "RPL" atau "TKJ"
  jurusan?: string;
  nama_labor?: string;
  labor?: string;
}

interface Kelas {
  id_kelas?: number;
}

type JurusanChartItem = {
  jurusan: string;
  baik: number;
  rusak: number;
};

// ─── Stat Card Component ───────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon,
  gradient,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}) => (
  <div
    className={`${gradient} rounded-2xl p-5 text-white relative overflow-hidden
      shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1
      animate-fade-in-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute -right-4 -top-4 opacity-20">
      <div className="w-24 h-24 rounded-full bg-white/30" />
    </div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
        {icon}
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State ringkasan kalkulasi internal data
  const [stats, setStats] = useState([
    { label: "Jumlah Barang Baik", value: 0, icon: <IconLab />, gradient: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { label: "Jumlah Kelas", value: 0, icon: <IconBox />, gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700" },
    { label: "Total Labor", value: 0, icon: <IconClass />, gradient: "bg-gradient-to-br from-purple-500 to-purple-700" },
    { label: "Barang Rusak", value: 0, icon: <AlertTriangle className="w-6 h-6" />, gradient: "bg-gradient-to-br from-rose-500 to-rose-700" },
  ]);

  const [kondisiPersen, setKondisiPersen] = useState({ baik: 0, rusak: 0 });
  const [jurusanChart, setJurusanChart] = useState<JurusanChartItem[]>([]);
  const [activeJurusanTooltip, setActiveJurusanTooltip] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      // Ekstraksi Token dari Cookie / LocalStorage secara aman
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
        if (!token && document.cookie) {
          const tokenCookie = document.cookie.split("; ").find((c) => c.startsWith("token="));
          if (tokenCookie) token = tokenCookie.split("=")[1];
        }
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      try {
        // Ambil Data Barang + Kelas dari Backend
        const [resBarang, resKelas] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang/read`, {
            method: "GET",
            headers,
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kelas`, {
            method: "GET",
            headers,
            credentials: "include",
          }),
        ]);

        if (!resBarang.ok) throw new Error("Gagal mengambil data barang dari server.");
        if (!resKelas.ok) throw new Error("Gagal mengambil data kelas dari server.");

        const [dataBarang, dataKelas] = await Promise.all([resBarang.json(), resKelas.json()]);

        // Normalisasi response array
        const list: Barang[] = Array.isArray(dataBarang?.data)
          ? dataBarang.data
          : Array.isArray(dataBarang)
          ? dataBarang
          : [];

        const kelasList: Kelas[] = Array.isArray(dataKelas?.data)
          ? dataKelas.data
          : Array.isArray(dataKelas)
          ? dataKelas
          : [];
        const totalKelas = kelasList.length;

        setBarangList(list);

        // ─── Proses Penghitungan Dinamis Rekapitulasi Data ───
        let barangRusak = 0;
        let barangBaik = 0;
        const laborSet = new Set<string>();
        const jurusanMap = new Map<string, JurusanChartItem>();

        list.forEach((b) => {
          const qty = Number(b.jumlah_barang ?? b.jumlah ?? 0) || 0;
          const jurusan = String(b.nama_jurusan ?? b.jurusan ?? "Lainnya")
            .trim()
            .toUpperCase();
          const kondisi = String(b.kondisi ?? b.status ?? "").toLowerCase();

          // Hitung Berdasarkan Kondisi
          const isBaik = kondisi.includes("baik");
          const isRusakRingan = kondisi.includes("ringan");
          const isRusak = isRusakRingan || kondisi.includes("berat") || kondisi.includes("rusak");

          if (isBaik) {
            barangBaik += qty;
          } else if (isRusakRingan || isRusak) {
            barangRusak += qty;
          }

          // Kumpulkan Nama Labor yang unik
          const namaLabor = String(b.nama_labor ?? b.labor ?? "").trim();
          if (namaLabor) laborSet.add(namaLabor);

          const prev = jurusanMap.get(jurusan) || { jurusan, baik: 0, rusak: 0 };
          if (isBaik) prev.baik += qty;
          if (isRusak) prev.rusak += qty;
          jurusanMap.set(jurusan, prev);
        });

        const totalSemuaBarang = barangBaik + barangRusak;

        // Set Persentase Kondisi
        setKondisiPersen({
          baik: totalSemuaBarang ? Math.round((barangBaik / totalSemuaBarang) * 100) : 0,
          rusak: totalSemuaBarang ? Math.round((barangRusak / totalSemuaBarang) * 100) : 0,
        });

        // Mutasi State Card Utama
        setStats([
          { label: "Jumlah Barang Baik", value: barangBaik, icon: <IconLab />, gradient: "bg-gradient-to-br from-blue-500 to-blue-700" },
          { label: "Jumlah Kelas", value: totalKelas, icon: <IconBox />, gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700" },
          { label: "Total Labor", value: laborSet.size || 0, icon: <IconClass />, gradient: "bg-gradient-to-br from-purple-500 to-purple-700" },
          { label: "Barang Rusak", value: barangRusak, icon: <AlertTriangle className="w-6 h-6" />, gradient: "bg-gradient-to-br from-rose-500 to-rose-700" },
        ]);

        setJurusanChart(
          Array.from(jurusanMap.values()).sort(
            (a, b) => b.baik + b.rusak - (a.baik + a.rusak),
          ),
        );

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Gagal memuat visualisasi data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxChart = Math.max(...jurusanChart.map((d) => d.baik + d.rusak), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600 font-medium">Memuat data inventaris...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center my-6">
        <p className="font-semibold">Terjadi Gangguan Integrasi</p>
        <p className="text-sm opacity-90">{error}</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out both;
        }
      `}</style>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">
            Data disinkronisasikan langsung dari sistem pemantauan labor aktif.
          </p>
        </div>

        {/* Dynamic Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 80} />
          ))}
        </div>

        {/* Visualisasi Grafik & Kondisi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Distribusi Inventaris per Jurusan</h3>
            <div className="flex items-end gap-4 h-52">
              {jurusanChart.map((d) => (
                <div key={d.jurusan} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full flex gap-1 items-end justify-center h-44 relative group"
                    onClick={() =>
                      setActiveJurusanTooltip((prev) =>
                        prev === d.jurusan ? null : d.jurusan,
                      )
                    }
                    onMouseLeave={() => setActiveJurusanTooltip(null)}
                  >
                    <div
                      className={`absolute -top-24 left-1/2 -translate-x-1/2 z-20 min-w-[140px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-md transition-opacity duration-200 pointer-events-none ${
                        activeJurusanTooltip === d.jurusan
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <p className="font-semibold text-slate-800">{d.jurusan}</p>
                      <p>Baik: {d.baik}</p>
                      <p>Rusak: {d.rusak}</p>
                      <p>Total: {d.baik + d.rusak}</p>
                    </div>
                    <div
                      className="w-5 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                      style={{ height: `${(d.baik / maxChart) * 100}%` }}
                      title={`Baik (${d.jurusan}): ${d.baik}`}
                    />
                    <div
                      className="w-5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-md transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500 cursor-pointer"
                      style={{ height: `${(d.rusak / maxChart) * 100}%` }}
                      title={`Rusak (${d.jurusan}): ${d.rusak}`}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{d.jurusan}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-blue-500 to-blue-400" />
                <span className="text-xs text-slate-500">Baik</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-emerald-500 to-emerald-400" />
                <span className="text-xs text-slate-500">Rusak</span>
              </div>
            </div>
            {jurusanChart.length === 0 && (
              <p className="text-sm text-slate-500 text-center mt-6">Belum ada data inventaris untuk divisualisasikan.</p>
            )}
          </div>

          {/* Real-time Kondisi Barang */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-5">Kondisi Barang</h3>
            <div className="space-y-4">
              {/* Baik */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">Baik</span>
                  <span className="text-emerald-600 font-semibold">{kondisiPersen.baik}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${kondisiPersen.baik}%` }}
                  />
                </div>
              </div>

              {/* Rusak */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">Rusak</span>
                  <span className="text-amber-600 font-semibold">{kondisiPersen.rusak}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${kondisiPersen.rusak}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Aktivitas Terkini Manual */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Aktivitas Sistem</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-600">Sistem memantau {barangList.length} entitas barang</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Baru saja</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
