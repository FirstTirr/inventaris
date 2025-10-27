import React, { useState, useEffect, useMemo, useCallback } from "react";
import AddProduct from "./addProduct";
import {
  getRemoteProducts,
  deleteRemoteProduct,
  getRemoteJurusan,
} from "@/lib/api/remoteProductApi";
import { CircleArrowRight, SquarePen, Trash2 } from "lucide-react";

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
}: {
  hideStats?: boolean;
  onlyStats?: boolean;
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300); // 300ms debounce
  const [showAdd, setShowAdd] = useState(false);
  // Removed unused editIdx per lint warning
  const [editData, setEditData] = useState<
    [string, string, string, string, string, number, string] | null
  >(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [jurusanList, setJurusanList] = useState<string[]>([]);
  const [selectedJurusan, setSelectedJurusan] = useState<string>("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printJurusanList, setPrintJurusanList] = useState<string[]>([]);
  const [selectedPrintJurusan, setSelectedPrintJurusan] = useState<string>("");
  const [selectedPrintMonth, setSelectedPrintMonth] = useState<string>("");
  const [printLaborList, setPrintLaborList] = useState<string[]>([]);
  const [selectedPrintLabor, setSelectedPrintLabor] = useState<string>("");
  const [statsJurusanList, setStatsJurusanList] = useState<
    { jurusan: string; warna?: string }[]
  >([]);

  // Data structure: [id_perangkat, nama_perangkat, kategori, jurusan, id_labor, jumlah, status]
  const [data, setData] = useState<
    [number, string, string, string, string, number, string][]
  >([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Dropdown page size

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

  // Fetch jurusan list from API
  useEffect(() => {
    if (!isOnline) return;

    // Get auth headers
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

    console.log("🔄 Fetching jurusan data from API...");

    // Method 1: Try getRemoteJurusan first
    getRemoteJurusan()
      .then((data) => {
        console.log("✅ Success! Received jurusan data:", data);
        if (Array.isArray(data.data) && data.data.length > 0) {
          // Assign colors to jurusan dynamically
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
              warna: j.warna || colors[index % colors.length], // Use warna from API or fallback to predefined colors
            })
          );
          console.log("🎨 Setting statsJurusanList:", jurusanWithColors);
          setStatsJurusanList(jurusanWithColors);
        } else {
          console.log("⚠️ Data kosong atau format tidak valid");
          // Method 2: Try direct fetch as backup
          console.log("🔄 Trying direct fetch as backup...");

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
            .then((res) => {
              console.log(
                "📡 Direct fetch response:",
                res.status,
                res.statusText
              );
              return res.json();
            })
            .then((directData) => {
              console.log("📦 Direct fetch data:", directData);
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
                  })
                );
                console.log(
                  "🎨 Direct fetch success, setting statsJurusanList:",
                  jurusanWithColors
                );
                setStatsJurusanList(jurusanWithColors);
              } else {
                throw new Error("Direct fetch also returned empty data");
              }
            })
            .catch((directError) => {
              console.error("❌ Direct fetch also failed:", directError);
              // Jangan pakai data dummy; kosongkan daftar agar murni dari API
              setStatsJurusanList([]);
            });
        }
      })
      .catch((error) => {
        console.error("❌ getRemoteJurusan failed:", error);
        // Jangan pakai data dummy; kosongkan daftar agar murni dari API
        setStatsJurusanList([]);
      });
  }, [isOnline]);

  // Fetch jurusan list for print modal
  const fetchJurusanForPrint = useCallback(async () => {
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

    try {
      // Fetch jurusan data
      const jurusanResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`,
        {
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      const jurusanData = await jurusanResponse.json();
      if (Array.isArray(jurusanData.data)) {
        setPrintJurusanList(
          jurusanData.data.map((j: { jurusan: string }) => j.jurusan)
        );
      }

      // Fetch labor data
      const laborResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/labor`,
        {
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      const laborData = await laborResponse.json();
      if (Array.isArray(laborData.data)) {
        setPrintLaborList(
          laborData.data.map((l: { nama_labor: string }) => l.nama_labor)
        );
      }
    } catch (error) {
      console.error("Error fetching data for print:", error);
      setPrintJurusanList([]);
      setPrintLaborList([]);
    }
  }, [isOnline]);

  // Fetch data from API only when online dengan caching
  useEffect(() => {
    // Always try to load from cache first
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
            const mappedData: [
              number,
              string,
              string,
              string,
              string,
              number,
              string
            ][] = arr.map(
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
              ]
            );
            localStorage.setItem("product-cache", JSON.stringify(mappedData));
            localStorage.setItem("product-cache-time", Date.now().toString());
            setData(mappedData);
          }
        })
        .catch((err) => {
          console.error("Gagal mengambil data produk remote:", err);
          // If API fails, keep showing cache
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

  // Filter dan pagination untuk mengurangi DOM nodes
  const { paginatedData, totalPages, filteredLength } = useMemo(() => {
    let filtered = data;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        ([, nama_perangkat, kategori, jurusan, labor, jumlah, status]) => {
          return (
            nama_perangkat.toLowerCase().includes(q) ||
            kategori.toLowerCase().includes(q) ||
            jurusan.toLowerCase().includes(q) ||
            labor.toLowerCase().includes(q) ||
            String(jumlah).includes(q) ||
            status.toLowerCase().includes(q)
          );
        }
      );
    }
    if (selectedJurusan) {
      filtered = filtered.filter(
        ([, , , jurusan]) => jurusan === selectedJurusan
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
  }, [data, debouncedSearch, page, itemsPerPage, selectedJurusan]);

  // Handle penambahan produk baru dengan useCallback
  const handleAddProduct = useCallback(async () => {
    setShowAdd(false);
    try {
      const result = await getRemoteProducts();
      const arr = Array.isArray(result.data) ? result.data : result;
      if (Array.isArray(arr)) {
        const mappedData: [
          number,
          string,
          string,
          string,
          string,
          number,
          string
        ][] = arr.map(
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
          ]
        );
        localStorage.setItem("product-cache", JSON.stringify(mappedData));
        localStorage.setItem("product-cache-time", Date.now().toString());
        setData(mappedData);
      } else {
        // If API fails, keep showing cache
        const cachedData = localStorage.getItem("product-cache");
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            setData(parsed);
          } catch {
            setData([]);
          }
        }
      }
    } catch (err) {
      console.error("Gagal refresh data produk setelah tambah:", err);
      // If API fails, keep showing cache
      const cachedData = localStorage.getItem("product-cache");
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          setData(parsed);
        } catch {
          setData([]);
        }
      }
    }
    // Removed setEditIdx (no longer used)
    setEditData(null);
  }, []);

  // Handle print modal
  const handleOpenPrintModal = () => {
    setShowPrintModal(true);
    fetchJurusanForPrint();
  };

  const handleClosePrintModal = () => {
    setShowPrintModal(false);
    setSelectedPrintJurusan("");
    setSelectedPrintMonth("");
    setSelectedPrintLabor("");
  };

  const handlePrintReport = () => {
    if (!selectedPrintJurusan) {
      alert("Pilih jurusan terlebih dahulu!");
      return;
    }

    if (!selectedPrintMonth) {
      alert("Pilih bulan terlebih dahulu!");
      return;
    }

    if (!selectedPrintLabor) {
      alert("Pilih labor terlebih dahulu!");
      return;
    }

    // TODO: Implement actual printing logic here
    console.log(
      "Printing report for jurusan:",
      selectedPrintJurusan,
      "month:",
      selectedPrintMonth,
      "labor:",
      selectedPrintLabor
    );
    alert(
      `Mencetak laporan untuk jurusan: ${selectedPrintJurusan}, bulan: ${selectedPrintMonth}, labor: ${selectedPrintLabor}`
    );

    // Close modal after printing
    handleClosePrintModal();
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8">
      <div className="w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Product Management</h2>
        </div>

        {/* Dashboard Statistic Cards - Responsive */}
        {!hideStats && (
          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {statsJurusanList.map(({ jurusan, warna }) => {
              // Calculate total items per jurusan from API data
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
                  <a
                    href={`/${jurusan.toLowerCase()}`}
                    className="w-full flex justify-center mt-3"
                  >
                    <button className="bg-white text-gray-700 text-xs font-semibold rounded-full px-4 py-1 shadow hover:bg-gray-100 transition flex items-center gap-2">
                      <CircleArrowRight className="w-4 h-4" />
                      more info
                    </button>
                  </a>
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

        {isOnline && !onlyStats && (
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
            <div className="flex items-center">
              <select
                value={selectedJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
                className="border rounded-lg px-4 py-2 text-base font-medium bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minWidth: 180 }}
                aria-label="Filter by jurusan"
              >
                <option value="">Jurusan</option>
                {jurusanList.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-auto">
              <button
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow transition-all"
                onClick={handleOpenPrintModal}
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
            {...(editData ? { defaultValue: editData } : {})}
          />
        )}

        {isOnline && (
          <div className="overflow-x-auto rounded-xl bg-white shadow font-sans w-full mt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4">
              {/* Dropdown and info left */}
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
              {/* Info center */}
              <div className="text-gray-500 text-xs md:text-sm">
                Showing {paginatedData.length} of {filteredLength} entries
              </div>
              {/* Pagination right */}
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
                    )
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
                    ]: [number, string, string, string, string, number, string],
                    idx: number
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
                            console.log(
                              "Mau hapus ID:",
                              id_perangkat,
                              typeof id_perangkat
                            );
                            try {
                              await deleteRemoteProduct(id_perangkat);
                              // Refresh data
                              const result = await getRemoteProducts();
                              const arr = Array.isArray(result.data)
                                ? result.data
                                : result;
                              if (Array.isArray(arr)) {
                                const mappedData: [
                                  number,
                                  string,
                                  string,
                                  string,
                                  string,
                                  number,
                                  string
                                ][] = arr.map(
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
                                  ]
                                );
                                localStorage.setItem(
                                  "product-cache",
                                  JSON.stringify(mappedData)
                                );
                                localStorage.setItem(
                                  "product-cache-time",
                                  Date.now().toString()
                                );
                                setData(mappedData);
                              } else {
                                // If API fails, keep showing cache
                                const cachedData =
                                  localStorage.getItem("product-cache");
                                if (cachedData) {
                                  try {
                                    const parsed = JSON.parse(cachedData);
                                    setData(parsed);
                                  } catch {
                                    setData([]);
                                  }
                                }
                              }
                              alert("Barang berhasil dihapus!");
                            } catch (err) {
                              alert("Gagal menghapus data: " + err);
                              // If API fails, keep showing cache
                              const cachedData =
                                localStorage.getItem("product-cache");
                              if (cachedData) {
                                try {
                                  const parsed = JSON.parse(cachedData);
                                  setData(parsed);
                                } catch {
                                  setData([]);
                                }
                              }
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
                              String(id_perangkat),
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
                  )
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

        {/* Print Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pilih Jurusan untuk Cetak Laporan
                </h3>
                <button
                  onClick={handleClosePrintModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurusan:
                </label>
                <select
                  value={selectedPrintJurusan}
                  onChange={(e) => setSelectedPrintJurusan(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Jurusan --</option>
                  {printJurusanList.map((jurusan) => (
                    <option key={jurusan} value={jurusan}>
                      {jurusan}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan:
                </label>
                <select
                  value={selectedPrintMonth}
                  onChange={(e) => setSelectedPrintMonth(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Bulan --</option>
                  <option value="01">Januari</option>
                  <option value="02">Februari</option>
                  <option value="03">Maret</option>
                  <option value="04">April</option>
                  <option value="05">Mei</option>
                  <option value="06">Juni</option>
                  <option value="07">Juli</option>
                  <option value="08">Agustus</option>
                  <option value="09">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labor:
                </label>
                <select
                  value={selectedPrintLabor}
                  onChange={(e) => setSelectedPrintLabor(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Labor --</option>
                  {printLaborList.map((labor) => (
                    <option key={labor} value={labor}>
                      {labor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 text-center">
                  <span className="font-medium">⚠️ Peringatan:</span>
                  <br />
                  Apakah Anda yakin mencetak laporan ini? Mohon cek lagi jika
                  tidak yakin.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleClosePrintModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handlePrintReport}
                  disabled={
                    !selectedPrintJurusan ||
                    !selectedPrintMonth ||
                    !selectedPrintLabor
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                    <polyline points="10 9 9 9 8 9" />
                    <line x1="16" y1="5" x2="8" y2="5" />
                    <line x1="16" y1="11" x2="8" y2="11" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Cetak Laporan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
