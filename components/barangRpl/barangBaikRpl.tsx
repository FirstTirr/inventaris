import React, { useEffect, useState, useMemo } from "react";
import type { ReactElement } from "react";
import { getRemoteProducts } from "@/lib/api/remoteProductApi";

const iconMap: Record<string, ReactElement> = {
  laptop: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="12" fill="#377DFF" />
      <path
        d="M6 17h12M7 7h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
        stroke="#222"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 14h6" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  mouse: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="12" fill="#00C9A7" />
      <path
        d="M8 17V7h8v10M8 17h8M8 7h8M12 17v-2"
        stroke="#222"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  keyboard: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#888" />
      <rect x="7" y="10" width="10" height="4" rx="1" fill="#fff" />
      <rect x="9" y="12" width="2" height="1" rx="0.5" fill="#888" />
      <rect x="13" y="12" width="2" height="1" rx="0.5" fill="#888" />
    </svg>
  ),
  kipas: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#00f" />
    </svg>
  ),
};

// Memoized fallback icon
const FallbackIcon = React.memo(() => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#ccc" />
  </svg>
));

FallbackIcon.displayName = "FallbackIcon";

// Memoized total icon
const TotalIcon = React.memo(() => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#00f" />
  </svg>
));

TotalIcon.displayName = "TotalIcon";

// Memoized stat card
const StatCard = React.memo(
  ({
    item,
    index,
  }: {
    item: { label: string; value: number; icon: ReactElement };
    index: number;
  }) => (
    <div
      key={index}
      className="bg-white rounded-2xl shadow flex flex-col items-center py-8 px-6 min-w-[180px]"
    >
      <div className="mb-2">{item.icon}</div>
      <div
        className="text-sm font-medium text-gray-700 mb-1"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        {item.label}
      </div>
      <div
        className="text-3xl font-bold text-black"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        {item.value}
      </div>
    </div>
  )
);

StatCard.displayName = "StatCard";

const BarangBaik = React.memo(() => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setLoading(false);
      return;
    }

    // Try cache first
    const cacheKey = "rpl-barang-baik-cache";
    const timeKey = "rpl-barang-baik-cache-time";
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(timeKey);
    const now = Date.now();
    const cacheValid = cacheTime && now - parseInt(cacheTime) < 3 * 60 * 1000; // 3 minutes

    if (cachedData && cacheValid) {
      try {
        setData(JSON.parse(cachedData));
        setLoading(false);
        return;
      } catch (err) {
        console.error("Cache parse error:", err);
      }
    }

    setLoading(true);
    getRemoteProducts()
      .then((result) => {
        try {
          const arr = Array.isArray(result.data) ? result.data : result;

          // Cache the data
          localStorage.setItem(cacheKey, JSON.stringify(arr));
          localStorage.setItem(timeKey, now.toString());

          setData(arr);
        } catch (err) {
          console.error("Data processing error:", err);
          setData([]);
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setData([]);
        setLoading(false);
      });
  }, [isOnline]);

  // Memoized items calculation
  const items = useMemo(() => {
    if (!data.length) return [];

    // Filter jurusan 'rpl' dan status 'baik'
    const filtered = data.filter(
      (item: any) =>
        item.jurusan?.toLowerCase() === "rpl" &&
        item.status?.toLowerCase() === "baik"
    );

    // Group by nama_perangkat
    const grouped: Record<string, number> = {};
    filtered.forEach((item: any) => {
      const key = item.nama_perangkat?.toLowerCase();
      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += Number(item.jumlah) || 0;
    });

    // Build items array
    const itemsArr = Object.entries(grouped).map(([key, value]) => ({
      label: `total ${key} baik`,
      value,
      icon: iconMap[key] || <FallbackIcon />,
    }));

    // Total semua barang baik
    const total = itemsArr.reduce((sum, i) => sum + i.value, 0);
    itemsArr.push({
      label: "total semua barang baik",
      value: total,
      icon: <TotalIcon />,
    });

    return itemsArr;
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#f7f7f8] px-4 pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-1 text-left"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Dashboard RPL (barang baik)
          </h2>
          <p className="text-gray-500 text-base font-normal mb-8 text-left">
            Monitor your labor performance
          </p>
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="min-h-[60vh] bg-[#f7f7f8] px-4 pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-1 text-left"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Dashboard RPL (barang baik)
          </h2>
          <p className="text-gray-500 text-base font-normal mb-8 text-left">
            Monitor your labor performance
          </p>
          <div className="text-center py-16 text-gray-500">
            <p>Tidak ada koneksi internet. Data tidak dapat dimuat.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-[#f7f7f8] px-4 pt-8 pb-4">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-1 text-left"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Dashboard RPL (barang baik)
        </h2>
        <p className="text-gray-500 text-base font-normal mb-8 text-left">
          Monitor your labor performance
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl mx-auto mt-8">
          {items.map((item, idx) => (
            <StatCard key={idx} item={item} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
});

BarangBaik.displayName = "BarangBaik";

export default BarangBaik;
