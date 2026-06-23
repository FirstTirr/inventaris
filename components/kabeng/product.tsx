// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import AddProduct from "./addProduct";
import PrintModal from "./PrintModal";
import {
  getRemoteProducts,
  deleteRemoteProduct,
  getRemoteJurusan,
} from "@/lib/api/remoteProductApi";
import { CircleArrowRight, SquarePen, Trash2 } from "lucide-react";
import { ProductData, UserMinimal } from "../../types/product";
import { parseProductCsv } from "@/lib/csv/productCsv";
import { importProductsInBulk } from "@/lib/api/productBulkImportApi";

// Custom hook for debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Product = ({
  hideStats = false,
  onlyStats = false,
  showControls = true,
  forcedJurusan = "",
}: {
  hideStats?: boolean;
  onlyStats?: boolean;
  showControls?: boolean;
  forcedJurusan?: string;
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300); // 300ms debounce
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState<ProductData | null>(null);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [jurusanList, setJurusanList] = useState<string[]>([]);
  const [selectedJurusan, setSelectedJurusan] = useState<string>("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [statsJurusanList, setStatsJurusanList] = useState<
    { jurusan: string; warna?: string }[]
  >([]);

  // Data structure: [id_perangkat, nama_perangkat, kategori, jurusan, id_labor, jumlah, status]
  const [data, setData] = useState<ProductData[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Dropdown page size
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const jurusanInsights = useMemo(() => {
    if (!forcedJurusan) return null;

    const keyJurusan = forcedJurusan.trim().toLowerCase();
    const byJurusan = data.filter(
      ([, , , jurusan]) => String(jurusan || "").trim().toLowerCase() === keyJurusan,
    );

    const totalStok = byJurusan.reduce((sum, [, , , , , jumlah]) => {
      const num = typeof jumlah === "number" ? jumlah : Number(jumlah);
      return sum + (Number.isNaN(num) ? 0 : num);
    }, 0);

    let baik = 0;
    let rusak = 0;
    const kategoriMap = new Map<string, number>();
    const laborMap = new Map<string, number>();

    byJurusan.forEach(([, , kategori, , labor, jumlah, status]) => {
      const qty = typeof jumlah === "number" ? jumlah : Number(jumlah) || 0;
      const st = String(status || "").toLowerCase();

      if (st.includes("baik")) baik += qty;
      if (st.includes("rusak")) rusak += qty;

      const keyKategori = String(kategori || "-").toUpperCase();
      kategoriMap.set(keyKategori, (kategoriMap.get(keyKategori) || 0) + qty);

      const keyLabor = String(labor || "-").toUpperCase();
      laborMap.set(keyLabor, (laborMap.get(keyLabor) || 0) + qty);
    });

    return {
      totalStok,
      totalBaris: byJurusan.length,
      baik,
      rusak,
      persenBaik: totalStok ? Math.round((baik / totalStok) * 100) : 0,
      persenRusak: totalStok ? Math.round((rusak / totalStok) * 100) : 0,
      topKategori: Array.from(kategoriMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
      topLabor: Array.from(laborMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
      barangSpesifik: byJurusan
        .map(([, nama, kategori, , labor, jumlah, status]) => ({
          nama: String(nama || "-"),
          kategori: String(kategori || "-").toUpperCase(),
          labor: String(labor || "-").toUpperCase(),
          jumlah: Number(jumlah || 0),
          status: String(status || "-").toUpperCase(),
        }))
        .sort((a, b) => b.jumlah - a.jumlah)
        .slice(0, 6),
    };
  }, [data, forcedJurusan]);

  // Check network status
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
    if (forcedJurusan) {
      setSelectedJurusan(forcedJurusan.toUpperCase());
    }
  }, [forcedJurusan]);

  // Fetch jurusan list from API
  useEffect(() => {
    if (!isOnline) return;

    const getAuthHeaders = () => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (typeof window !== "undefined") {
        const token = document.cookie
          .split("; ")
          .find((c) => c.startsWith("token="))
          ?.split("=")[1];

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      return headers;
    };

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`, {
      headers: getAuthHeaders(),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setJurusanList(data.data.map((j: { jurusan: string }) => j.jurusan));
        }
      })
      .catch(() => setJurusanList([]));
  }, [isOnline]);

  // Fetch jurusan list for statistics cards
  useEffect(() => {
    if (!isOnline) return;

    getRemoteJurusan()
      .then((data) => {
        if (Array.isArray(data.data) && data.data.length > 0) {
          const colors = [
            "bg-black",
            "bg-green-500",
            "bg-red-700",
            "bg-gray-500",
            "bg-blue-500",
            "bg-purple-500",
            "bg-yellow-500",
            "bg-pink-500",
          ];
          const jurusanWithColors = data.data.map(
            (j: { jurusan: string; warna?: string }, index: number) => ({
              ...j,
              warna: j.warna || colors[index % colors.length],
            }),
          );
          
          setStatsJurusanList(jurusanWithColors);
        } else {
          const getAuthHeaders = () => {
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
            };
            if (typeof window !== "undefined") {
              const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("token="))
                ?.split("=")[1];
              if (token) headers["Authorization"] = `Bearer ${token}`;
            }
            return headers;
          };

          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`, {
            headers: getAuthHeaders(),
            credentials: "include",
          })
            .then((res) => res.json())
            .then((directData) => {
              if (
                Array.isArray(directData.data) &&
                directData.data.length > 0
              ) {
                const colors = [
                  "bg-black",
                  "bg-green-500",
                  "bg-red-700",
                  "bg-gray-500",
                  "bg-blue-500",
                  "bg-purple-500",
                  "bg-yellow-500",
                  "bg-pink-500",
                ];
                const jurusanWithColors = directData.data.map(
                  (j: { jurusan: string; warna?: string }, index: number) => ({
                    ...j,
                    warna: j.warna || colors[index % colors.length],
                  }),
                );
                
                setStatsJurusanList(jurusanWithColors);
              } else {
                setStatsJurusanList([]);
              }
            })
            .catch(() => setStatsJurusanList([]));
        }
      })
      .catch((error) => {
        console.error("❌ getRemoteJurusan failed:", error);
        setStatsJurusanList([]);
      });
  }, [isOnline]);

  // Fetch data from API with caching
  useEffect(() => {
    const cachedData = localStorage.getItem("product-cache");
    let cacheLoaded = false;
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setData(parsed);
        cacheLoaded = true;
      } catch (err) {
        console.error("Cache parse error:", err);
      }
    }
    if (isOnline) {
      getRemoteProducts()
        .then((result) => {
          const arr = Array.isArray(result.data) ? result.data : result;
          if (Array.isArray(arr)) {
            const mappedData: ProductData[] = arr.map(
              (item: {
                id_perangkat?: number;
                nama_perangkat?: string;
                kategori?: string;
                jurusan?: string;
                labor?: string | null;
                jumlah?: number;
                status?: string;
              }) => [
                Number(item.id_perangkat ?? 0),
                String(item.nama_perangkat ?? ""),
                String(item.kategori ?? ""),
                String(item.jurusan ?? ""),
                item.labor !== undefined &&
                item.labor !== null &&
                String(item.labor).trim() !== ""
                  ? String(item.labor)
                  : "-",
                Number(item.jumlah ?? 0),
                String(item.status ?? ""),
              ],
            );
            localStorage.setItem("product-cache", JSON.stringify(mappedData));
            localStorage.setItem("product-cache-time", Date.now().toString());
            setData(mappedData);
          }
        })
        .catch((err) => {
          console.error("Gagal mengambil data produk remote:", err);
          if (cachedData && !cacheLoaded) {
            try {
              const parsed = JSON.parse(cachedData);
              setData(parsed);
            } catch {
              setData([]);
            }
          }
        });
    }
  }, [isOnline]);

  // Filter dan pagination (Kunci filter berdasarkan jurusan user jika ada)
  const { paginatedData, totalPages, filteredLength } = useMemo(() => {
    let filtered = data;
    
    // 1. Filter jurusan
    if (forcedJurusan) {
      filtered = filtered.filter(
        ([, , , jurusan]) =>
          String(jurusan || "").trim().toLowerCase() ===
          forcedJurusan.trim().toLowerCase(),
      );
    } else if (selectedJurusan) {
      // Jika admin global bebas memilih filter dropdown
      filtered = filtered.filter(
        ([, , , jurusan]) =>
          String(jurusan || "").trim().toLowerCase() ===
          selectedJurusan.trim().toLowerCase(),
      );
    }

    // 2. Filter Search Debounce
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        ([, nama_perangkat, kategori, jurusan, labor, jumlah, status]) => {
          return (
            (nama_perangkat || "").toLowerCase().includes(q) ||
            (kategori || "").toLowerCase().includes(q) ||
            (jurusan || "").toLowerCase().includes(q) ||
            (labor || "").toLowerCase().includes(q) ||
            String(jumlah).includes(q) ||
            (status || "").toLowerCase().includes(q)
          );
        },
      );
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    const pages = Math.ceil(filtered.length / itemsPerPage);
    return {
      paginatedData: paginated,
      totalPages: pages,
      filteredLength: filtered.length,
    };
  }, [
    data,
    debouncedSearch,
    page,
    itemsPerPage,
    selectedJurusan,
    forcedJurusan,
  ]);

  // Handle penambahan produk baru
  const handleAddProduct = useCallback(async () => {
    setShowAdd(false);
    try {
      const result = await getRemoteProducts();
      const arr = Array.isArray(result.data) ? result.data : result;
      if (Array.isArray(arr)) {
        const mappedData: ProductData[] = arr.map(
          (item: {
            id_perangkat?: number;
            nama_perangkat?: string;
            kategori?: string;
            jurusan?: string;
            labor?: string | null;
            jumlah?: number;
            status?: string;
          }) => [
            Number(item.id_perangkat ?? 0),
            String(item.nama_perangkat ?? ""),
            String(item.kategori ?? ""),
            String(item.jurusan ?? ""),
            item.labor !== undefined &&
            item.labor !== null &&
            String(item.labor).trim() !== ""
              ? String(item.labor)
              : "-",
            Number(item.jumlah ?? 0),
            String(item.status ?? ""),
          ],
        );
        localStorage.setItem("product-cache", JSON.stringify(mappedData));
        localStorage.setItem("product-cache-time", Date.now().toString());
        setData(mappedData);
      }
    } catch (err) {
      console.error("Gagal refresh data produk setelah tambah:", err);
    }
    setEditData(null);
  }, []);

  const refreshProductTable = useCallback(async () => {
    const result = await getRemoteProducts();
    const arr = Array.isArray(result.data) ? result.data : result;
    if (!Array.isArray(arr)) return;

    const mappedData: ProductData[] = arr.map((item: any) => [
      Number(item.id_perangkat ?? 0),
      String(item.nama_perangkat ?? item.nama_barang ?? ""),
      String(item.kategori ?? item.category ?? ""),
      String(item.jurusan ?? ""),
      item.labor !== undefined &&
      item.labor !== null &&
      String(item.labor).trim() !== ""
        ? String(item.labor)
        : "-",
      Number(item.jumlah ?? 0),
      String(item.status ?? item.kondisi ?? ""),
    ]);

    localStorage.setItem("product-cache", JSON.stringify(mappedData));
    localStorage.setItem("product-cache-time", Date.now().toString());
    setData(mappedData);
  }, []);

  const handleImportCsvClick = useCallback(() => {
    csvInputRef.current?.click();
  }, []);

  const handleImportCsvFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const csvText = await file.text();
        const parsed = parseProductCsv(csvText);

        if (parsed.errors.length > 0) {
          alert(
            `CSV tidak valid.\n\n${parsed.errors.slice(0, 8).join("\n")}${
              parsed.errors.length > 8 ? "\n..." : ""
            }`,
          );
          return;
        }

        if (parsed.rows.length === 0) {
          alert("CSV tidak punya data untuk diimport.");
          return;
        }

        const result = await importProductsInBulk(parsed.rows);
        await refreshProductTable();

        if (result.failed > 0) {
          alert(
            `Import selesai dengan catatan.\nBerhasil: ${result.success}\nGagal: ${result.failed}\n\n${result.failDetails
              .slice(0, 5)
              .join("\n")}${result.failDetails.length > 5 ? "\n..." : ""}`,
          );
          return;
        }

        alert(`Import CSV berhasil. Total data masuk: ${result.success}`);
      } catch (error) {
        console.error("Import CSV error:", error);
        alert("Terjadi kesalahan saat import CSV.");
      } finally {
        e.target.value = "";
      }
    },
    [refreshProductTable],
  );

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8">
      <div className="w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-black">
            Product Management {forcedJurusan ? `(${forcedJurusan})` : ""}
          </h2>
        </div>

        {forcedJurusan && jurusanInsights && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-800 p-6 text-white shadow-xl">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
                <p className="text-cyan-200 text-xs tracking-[0.2em]">JURUSAN</p>
                <h3 className="text-4xl font-extrabold mt-2">{forcedJurusan}</h3>
                <p className="text-cyan-100/90 text-sm mt-3">
                  Data ini khusus jurusan {forcedJurusan}. Tidak tercampur jurusan lain.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="rounded-xl bg-emerald-500/20 border border-emerald-300/30 p-3">
                    <p className="text-xs text-emerald-100">Stok Baik</p>
                    <p className="text-2xl font-bold">{jurusanInsights.baik}</p>
                    <p className="text-xs text-emerald-100/80">{jurusanInsights.persenBaik}%</p>
                  </div>
                  <div className="rounded-xl bg-rose-500/20 border border-rose-300/30 p-3">
                    <p className="text-xs text-rose-100">Stok Rusak</p>
                    <p className="text-2xl font-bold">{jurusanInsights.rusak}</p>
                    <p className="text-xs text-rose-100/80">{jurusanInsights.persenRusak}%</p>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
                  <p className="text-xs text-cyan-100">Total Unit</p>
                  <p className="text-3xl font-black mt-1">{jurusanInsights.totalStok}</p>
                  <p className="text-xs text-cyan-100/80 mt-1">Akumulasi semua barang</p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
                  <p className="text-xs text-cyan-100">Jenis Barang</p>
                  <p className="text-3xl font-black mt-1">{jurusanInsights.totalBaris}</p>
                  <p className="text-xs text-cyan-100/80 mt-1">Jumlah baris data jurusan</p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
                  <p className="text-xs text-cyan-100">Labor Utama</p>
                  <p className="text-xl font-black mt-2 truncate">
                    {jurusanInsights.topLabor[0]?.[0] || "-"}
                  </p>
                  <p className="text-xs text-cyan-100/80 mt-1">
                    {jurusanInsights.topLabor[0]?.[1] || 0} unit
                  </p>
                </div>

                <div className="md:col-span-1 rounded-2xl bg-white/10 border border-white/20 p-4">
                  <p className="text-sm font-semibold mb-2">Top Kategori</p>
                  <div className="space-y-2">
                    {jurusanInsights.topKategori.map(([namaKategori, total]) => (
                      <div key={namaKategori} className="flex items-center justify-between text-xs">
                        <span>{namaKategori}</span>
                        <span className="font-bold">{total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 rounded-2xl bg-white/10 border border-white/20 p-4">
                  <p className="text-sm font-semibold mb-2">Barang Spesifik Jurusan</p>
                  <div className="space-y-2 max-h-36 overflow-auto pr-1">
                    {jurusanInsights.barangSpesifik.map((item) => (
                      <div key={`${item.nama}-${item.kategori}-${item.labor}`} className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate">{item.nama}</span>
                        <span className="whitespace-nowrap text-cyan-100/90">
                          {item.kategori} | {item.labor} | {item.jumlah}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Statistic Cards */}
        {!hideStats && (
          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {statsJurusanList.map(({ jurusan, warna }) => {
              const total = data
                .filter(([, , , dataJurusan]) => dataJurusan === jurusan)
                .reduce((sum, [, , , , , jumlah]) => {
                  const num =
                    typeof jumlah === "number" ? jumlah : Number(jumlah);
                  return sum + (isNaN(num) ? 0 : num);
                }, 0);

              return (
                <div
                  key={jurusan}
                  className={`rounded-xl shadow flex flex-col items-center justify-center py-7 px-3 ${
                    warna || "bg-gray-500"
                  } text-white w-full`}
                >
                  <div className="text-lg font-semibold mb-1">
                    Barang {jurusan}
                  </div>
                  <div className="text-3xl font-bold">{total}</div>
                  <Link
                    href={`/admin/product/${encodeURIComponent(jurusan.toLowerCase())}`}
                    className="w-full flex justify-center mt-3"
                  >
                    <span className="bg-white text-gray-700 text-xs font-semibold rounded-full px-4 py-1 shadow hover:bg-gray-100 transition flex items-center gap-2">
                      <CircleArrowRight className="w-4 h-4" />
                      more info
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {!isOnline && (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada koneksi internet. Data tidak dapat dimuat.</p>
          </div>
        )}

        {isOnline && !onlyStats && showControls && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 w-full">
            <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
              <input
                type="text"
                placeholder="Cari perangkat atau labor..."
                className="flex-1 outline-none bg-transparent text-sm text-gray-500 px-2 placeholder:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="text-gray-400 hover:text-gray-600 text-base px-2"
                onClick={() => setSearch("")}
                type="button"
                aria-label="Clear search"
                tabIndex={-1}
              >
                ×
              </button>
            </div>

            {!forcedJurusan && (
              <div className="flex items-center">
                <select
                  value={selectedJurusan}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                  className="border rounded-lg px-4 py-2 text-base font-medium bg-white text-black shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ minWidth: 180 }}
                  aria-label="Filter by jurusan"
                >
                  <option value="">All Jurusan</option>
                  {jurusanList.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-auto">
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleImportCsvFile}
              />
              <button
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-5 py-2 rounded-md shadow transition-all"
                onClick={handleImportCsvClick}
                type="button"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import CSV
              </button>
              <button
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow transition-all"
                onClick={() => setShowPrintModal(true)}
                type="button"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                  <polyline points="10 9 9 9 8 9" />
                  <line x1="16" y1="5" x2="8" y2="5" />
                  <line x1="16" y1="11" x2="8" y2="11" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Cetak Laporan
              </button>
              <button
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow transition-all"
                onClick={() => setShowAdd(true)}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline"
                >
                  <circle cx="9" cy="9" r="8" />
                  <line x1="9" y1="5" x2="9" y2="13" />
                  <line x1="5" y1="9" x2="13" y2="9" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
        )}
        {showAdd && (
          <AddProduct
            onAddProduct={handleAddProduct}
            onCancel={() => {
              setShowAdd(false);
              setEditData(null);
            }}
            defaultValue={editData || undefined}
          />
        )}

        {isOnline && (
          <div className="overflow-x-auto rounded-xl bg-white shadow font-sans w-full mt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="itemsPerPage"
                  className="text-gray-600 text-sm font-medium"
                >
                  Show
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select number of entries per page"
                >
                  {[10, 20, 30, 40, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="text-gray-600 text-sm font-medium">
                  entries
                </span>
              </div>
              <div className="text-gray-500 text-xs md:text-sm">
                Showing {paginatedData.length} of {filteredLength} entries
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2 py-1 border rounded text-sm text-gray-700 bg-white disabled:bg-gray-200 disabled:text-gray-400"
                    aria-label="Previous page"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-2 py-1 border rounded text-sm font-semibold transition-colors duration-150 ${
                          page === p
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                        }`}
                        aria-label={`Go to page ${p}`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-2 py-1 border rounded text-sm text-gray-700 bg-white disabled:bg-gray-200 disabled:text-gray-400"
                    aria-label="Next page"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
            <table className="min-w-full">
              <thead>
                <tr className="text-gray-500 text-xs font-semibold border-b">
                  <th className="py-3 px-6 text-left">Nama Perangkat</th>
                  <th className="py-3 px-6 text-center">Kategori</th>
                  <th className="py-3 px-6 text-center">Jurusan</th>
                  <th className="py-3 px-6 text-center">Labor</th>
                  <th className="py-3 px-6 text-center">Jumlah</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(
                  (
                    [
                      id_perangkat,
                      nama_perangkat,
                      kategori,
                      jurusan,
                      labor,
                      jumlah,
                      status,
                    ]: ProductData,
                    idx: number,
                  ) => (
                    <tr
                      key={idx}
                      className="text-gray-700 border-b last:border-b-0"
                    >
                      <td className="py-3 px-6 text-left">{nama_perangkat}</td>
                      <td className="py-3 px-6 text-center">{kategori}</td>
                      <td className="py-3 px-6 text-center">{jurusan}</td>
                      <td className="py-3 px-6 text-center">
                        {typeof labor === "string" && labor.trim() !== ""
                          ? labor
                          : "-"}
                      </td>
                      <td className="py-3 px-6 text-center">{jumlah}</td>
                      <td className="py-3 px-6 text-center">{status}</td>
                      <td className="py-3 px-6 text-center">
                        <button
                          title="Hapus"
                          className="hover:text-red-600"
                          onClick={async () => {
                            try {
                              await deleteRemoteProduct(Number(id_perangkat));
                              const result = await getRemoteProducts();
                              const arr = Array.isArray(result.data)
                                ? result.data
                                : result;
                              if (Array.isArray(arr)) {
                                const mappedData: ProductData[] = arr.map(
                                  (item: any) => [
                                    Number(item.id_perangkat ?? 0),
                                    String(item.nama_perangkat ?? ""),
                                    String(item.kategori ?? ""),
                                    String(item.jurusan ?? ""),
                                    item.labor !== null &&
                                    item.labor !== undefined &&
                                    String(item.labor).trim() !== ""
                                      ? String(item.labor)
                                      : "-",
                                    Number(item.jumlah ?? 0),
                                    String(item.status ?? ""),
                                  ],
                                );
                                localStorage.setItem(
                                  "product-cache",
                                  JSON.stringify(mappedData),
                                );
                                localStorage.setItem(
                                  "product-cache-time",
                                  Date.now().toString(),
                                );
                                setData(mappedData);
                              }
                              alert("Barang berhasil dihapus!");
                            } catch (err) {
                              alert("Gagal menghapus data: " + err);
                            }
                          }}
                        >
                          <Trash2 size={22} />
                        </button>

                        <button
                          className="hover:text-green-600"
                          title="Edit"
                          onClick={() => {
                            setEditData([
                              Number(id_perangkat),
                              nama_perangkat,
                              kategori,
                              jurusan,
                              labor ?? "",
                              Number(jumlah),
                              status,
                        ]);
                            setShowAdd(true);
                          }}
                        >
                          <SquarePen size={22} />
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {isOnline && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}

        {/* Print Modal Component */}
        <PrintModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          products={data}
          initialJurusan={selectedJurusan}
        />
      </div>
    </div>
  );
};

export default Product;
