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
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editData, setEditData] = useState<
    [string, string, string, string, number, string] | null
  >(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Data structure: [id_perangkat, nama_perangkat, kategori, jurusan, id_labor, jumlah, status]
  const [data, setData] = useState<
    [number, string, string, string, string, number, string][]
  >([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(50); // Pagination untuk mengurangi DOM nodes

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

  // Fetch data from API only when online dengan caching
  useEffect(() => {
    if (!isOnline) return;

    // Try to load from cache first
    const cachedData = localStorage.getItem("product-cache");
    const cacheTime = localStorage.getItem("product-cache-time");
    const now = Date.now();
    const cacheValid = cacheTime && now - parseInt(cacheTime) < 5 * 60 * 1000; // 5 minutes

    if (cachedData && cacheValid) {
      try {
        const parsed = JSON.parse(cachedData);
        setData(parsed);
        return;
      } catch (err) {
        console.error("Cache parse error:", err);
      }
    }

    getRemoteProducts()
      .then((result) => {
        const arr = Array.isArray(result.data) ? result.data : result;
        console.log("HASIL DARI API:", arr);
        if (Array.isArray(arr)) {
          const mappedData = arr.map(
            (item: {
              id_perangkat: string | number;
              nama_perangkat: string;
              kategori: string;
              jurusan: string;
              id_labor: string;
              jumlah: string | number;
              status: string;
            }) =>
              [
                Number(item.id_perangkat),
                item.nama_perangkat,
                item.kategori,
                item.jurusan,
                item.id_labor,
                Number(item.jumlah),
                item.status,
              ] as [number, string, string, string, string, number, string]
          );

          // Cache the data
          localStorage.setItem("product-cache", JSON.stringify(mappedData));
          localStorage.setItem("product-cache-time", Date.now().toString());
          setData(mappedData);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data produk remote:", err);
      });
  }, [isOnline]);

  // Filter dan pagination untuk mengurangi DOM nodes
  const { paginatedData, totalPages } = useMemo(() => {
    let filtered = data;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = data.filter(
        ([, nama_perangkat, kategori, jurusan, id_labor, jumlah, status]) => {
          return (
            nama_perangkat.toLowerCase().includes(q) ||
            kategori.toLowerCase().includes(q) ||
            jurusan.toLowerCase().includes(q) ||
            id_labor.toLowerCase().includes(q) ||
            String(jumlah).includes(q) ||
            status.toLowerCase().includes(q)
          );
        }
      );
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    const pages = Math.ceil(filtered.length / itemsPerPage);

    return { paginatedData: paginated, totalPages: pages };
  }, [data, debouncedSearch, page, itemsPerPage]);

  // Handle penambahan produk baru dengan useCallback
  const handleAddProduct = useCallback(
    async (produkBaru: [string, string, string, string, number, string]) => {
      setShowAdd(false);
      try {
        const result = await getRemoteProducts();
        const arr = Array.isArray(result.data) ? result.data : result;
        if (Array.isArray(arr)) {
          setData(
            arr.map((item) => [
              Number(item.id_perangkat),
              item.nama_perangkat,
              item.kategori,
              item.jurusan,
              item.id_labor,
              Number(item.jumlah),
              item.status,
            ])
          );
        }
      } catch (err) {
        console.error("Gagal refresh data produk setelah tambah:", err);
      }
      setEditIdx(null);
      setEditData(null);
    },
    []
  );

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
                  .reduce((sum, [, , , , , jumlah]) => sum + Number(jumlah), 0);
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
                placeholder="Cari perangkat..."
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
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow transition-all ml-auto"
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
        )}
        {showAdd && (
          <AddProduct
            onAddProduct={handleAddProduct}
            onCancel={() => {
              setShowAdd(false);
              setEditIdx(null);
              setEditData(null);
            }}
            {...(editData ? { defaultValue: editData } : {})}
          />
        )}

        {isOnline && (
          <div className="overflow-x-auto rounded-xl bg-white shadow font-sans w-full mt-2">
            <table className="min-w-full">
              <thead>
                <tr className="text-gray-500 text-xs font-semibold border-b">
                  <th className="py-3 px-6 text-left">Nama Perangkat</th>
                  <th className="py-3 px-6 text-center">Kategori</th>
                  <th className="py-3 px-6 text-center">Jurusan</th>
                  <th className="py-3 px-6 text-center">ID Labor</th>
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
                      id_labor,
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
                      <td className="py-3 px-6 text-center">{id_labor}</td>
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
                                setData(
                                  arr.map(
                                    (item: {
                                      id_perangkat: string | number;
                                      nama_perangkat: string;
                                      kategori: string;
                                      jurusan: string;
                                      id_labor: string;
                                      jumlah: string | number;
                                      status: string;
                                    }) => [
                                      Number(item.id_perangkat),
                                      item.nama_perangkat,
                                      item.kategori,
                                      item.jurusan,
                                      item.id_labor,
                                      Number(item.jumlah),
                                      item.status,
                                    ]
                                  )
                                );
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
                            setEditIdx(idx);
                            setEditData([
                              String(id_perangkat),
                              nama_perangkat,
                              kategori,
                              jurusan,
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
