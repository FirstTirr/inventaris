import React, { useState, useEffect, useMemo, useCallback } from "react";
import AddProduct from "./addProduct";
import {
  getRemoteProducts,
  deleteRemoteProduct,
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
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setJurusanList(data.data.map((j: { jurusan: string }) => j.jurusan));
        }
      })
      .catch(() => setJurusanList([]));
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

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-8">
      <div className="w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Product Management</h2>
        </div>

        {/* Dashboard Statistic Cards - Responsive */}
        {!hideStats && (
          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {(() => {
              // Calculate total items per jurusan (BC, TKJ, RPL, DKV)
              const jurusanList = [
                { key: "BC", label: "Barang BC", color: "bg-black" },
                { key: "TKJ", label: "Barang TKJ", color: "bg-green-500" },
                { key: "RPL", label: "Barang RPL", color: "bg-red-700" },
                { key: "DKV", label: "Barang DKV", color: "bg-gray-500" },
              ];
              return jurusanList.map(({ key, label, color }) => {
                const total = data
                  .filter(([, , , jurusan]) => jurusan === key)
                  .reduce((sum, [, , , , , jumlah]) => {
                    const num =
                      typeof jumlah === "number" ? jumlah : Number(jumlah);
                    return sum + (isNaN(num) ? 0 : num);
                  }, 0);
                return (
                  <div
                    key={key}
                    className={`rounded-xl shadow flex flex-col items-center justify-center py-7 px-3 ${color} text-white w-full`}
                  >
                    <div className="text-lg font-semibold mb-1">{label}</div>
                    <div className="text-3xl font-bold">{total}</div>
                    <a
                      href={`/${key.toLowerCase()}`}
                      className="w-full flex justify-center mt-3"
                    >
                      <button className="bg-white text-gray-700 text-xs font-semibold rounded-full px-4 py-1 shadow hover:bg-gray-100 transition flex items-center gap-2">
                        <CircleArrowRight className="w-4 h-4" />
                        more info
                      </button>
                    </a>
                  </div>
                );
              });
            })()}
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
                <option value="">All Jurusan</option>
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
                onClick={() => {}}
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
      </div>
    </div>
  );
};

export default Product;
