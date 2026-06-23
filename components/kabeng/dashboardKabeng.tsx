"use client";
import React, { useState, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Package, ClipboardList, Activity } from "lucide-react";

// Komponen lama Anda
const Product = dynamic(() => import("@/components/kabeng/product"), {
  loading: () => <div className="text-center py-8">Loading data produk...</div>,
  ssr: false,
});
const NavRpl = dynamic(() => import("@/components/barangRpl/NavRpl"), {
  loading: () => <div className="text-center py-8">Loading RPL...</div>,
  ssr: false,
});
const NavBc = dynamic(() => import("@/components/barangBc/NavBc"), {
  loading: () => <div className="text-center py-8">Loading BC...</div>,
  ssr: false,
});
const NavDkv = dynamic(() => import("@/components/barangDkv/NavDkv"), {
  loading: () => <div className="text-center py-8">Loading DKV...</div>,
  ssr: false,
});
const NavTkj = dynamic(() => import("@/components/barangTkj/NavTkj"), {
  loading: () => <div className="text-center py-8">Loading TKJ...</div>,
  ssr: false,
});

const navComponents = {
  rpl: NavRpl,
  bc: NavBc,
  dkv: NavDkv,
  tkj: NavTkj,
};

const DashboardKabeng = ({ hideControls = false }: { hideControls?: boolean }) => {
  const router = useRouter();
  const [selected, setSelected] = useState<"rpl" | "bc" | "dkv" | "tkj">("rpl");
  
  const [stats, setStats] = useState({ totalBarang: 0, totalPeminjaman: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let token = localStorage.getItem("token")?.replace(/^"|"$/g, '');
        const fetchOptions: RequestInit = {
          headers: { "Authorization": token ? `Bearer ${token}` : "" },
        };

        const resBarang = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang/read`, fetchOptions).catch(() => null);
        const dataBarang = (resBarang && resBarang.ok) ? await resBarang.json() : [];
        const barangList = Array.isArray(dataBarang) ? dataBarang : (dataBarang?.data || []);
        
        const resPinjam = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/peminjaman`, fetchOptions).catch(() => null);
        const dataPinjamRaw = (resPinjam && resPinjam.ok) ? await resPinjam.json() : [];
        const dataPinjam = Array.isArray(dataPinjamRaw) ? dataPinjamRaw : (dataPinjamRaw?.data || []);

        setStats({ totalBarang: barangList.length, totalPeminjaman: dataPinjam.length });

        // Proses data gabungan untuk 6 bulan terakhir
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
        const combinedData = monthNames.map((name, i) => ({
          name,
          peminjaman: 0,
          input: 0
        }));

        // Hitung peminjaman
        dataPinjam.forEach((item: any) => {
          const date = new Date(item.tanggal_pinjam || item.created_at || new Date());
          const monthIndex = date.getMonth();
          if (monthIndex < 6) combinedData[monthIndex].peminjaman += 1;
        });

        // Hitung input barang
        barangList.forEach((item: any) => {
          const date = new Date(item.created_at || item.tanggal_masuk || new Date());
          const monthIndex = date.getMonth();
          if (monthIndex < 6) combinedData[monthIndex].input += 1;
        });

        setChartData(combinedData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f7f8fa] pb-12">
      <div className="px-4 sm:px-8 pt-8 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Overview</h2>
      </div>

      {/* Cards */}
      <div className="w-full px-4 sm:px-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase">Total Barang</p>
            <h3 className="text-5xl font-black text-slate-800">{stats.totalBarang}</h3>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><Package size={32}/></div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase">Total Peminjaman</p>
            <h3 className="text-5xl font-black text-slate-800">{stats.totalPeminjaman}</h3>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><ClipboardList size={32}/></div>
        </div>
      </div>

      {/* DUAL CHART AREA */}
      <div className="w-full px-4 sm:px-8 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-indigo-600" /> Analisis Tren Peminjaman & Input Barang
          </h3>
          <div style={{ width: '100%', height: '350px', position: 'relative' }}>
            <ResponsiveContainer width="99%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" name="Peminjaman" dataKey="peminjaman" stroke="#4f46e5" strokeWidth={4} />
                <Line type="monotone" name="Input Barang" dataKey="input" stroke="#10b981" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Existing Components... */}
    </div>
  );
};

export default DashboardKabeng;