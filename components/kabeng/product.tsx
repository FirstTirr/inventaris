import React, { useState, useEffect, useMemo, useCallback } from "react";
import AddProduct from "./addProduct";
import {
  getRemoteProducts,
  deleteRemoteProduct,
  getRemoteJurusan,
  getRemoteUsers,
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
  type UserMinimal = {
    id_user?: number;
    nama?: string;
    password?: string;
    id_role?: number;
  };

  const [usersForPrint, setUsersForPrint] = useState<UserMinimal[]>([]);
  const [kabengForJurusan, setKabengForJurusan] = useState<UserMinimal | null>(
    null
  );
  const [selectedPrintPassword, setSelectedPrintPassword] = useState("");
  const [statsJurusanList, setStatsJurusanList] = useState<
    { jurusan: string; warna?: string }[]
  >([]);

  // Derive logged-in username and corresponding admin user record (if any)
  const loggedUsernameRaw =
    (typeof window !== "undefined" &&
      (localStorage.getItem("user") ||
        sessionStorage.getItem("displayName") ||
        (document.cookie || "")
          .split("; ")
          .find((c) => c.startsWith("user="))
          ?.split("=")[1])) ||
    "";
  const loggedUsername =
    typeof loggedUsernameRaw === "string"
      ? decodeURIComponent(loggedUsernameRaw)
      : "";
  const loggedUserRecord = usersForPrint.find(
    (u) => String(u.nama) === String(loggedUsername)
  );

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

      // Fetch users so we can validate Kabeng password per jurusan
      try {
        const usersRes = await getRemoteUsers();
        const uArr = Array.isArray(usersRes.data) ? usersRes.data : [];
        setUsersForPrint(uArr);
      } catch (err) {
        console.error("Gagal mengambil users untuk print:", err);
        setUsersForPrint([]);
      }
    } catch (error) {
      console.error("Error fetching data for print:", error);
      setPrintJurusanList([]);
      setPrintLaborList([]);
    }
  }, [isOnline]);

  // When jurusan selection changes, pick kabeng account for that jurusan
  useEffect(() => {
    if (!selectedPrintJurusan) {
      setKabengForJurusan(null);
      return;
    }

    // Try to find a kabeng (id_role === 0) whose name contains the jurusan name (case-insensitive)
    const found = usersForPrint.find((u) => {
      try {
        return (
          Number(u.id_role) === 0 &&
          typeof u.nama === "string" &&
          u.nama.toLowerCase().includes(selectedPrintJurusan.toLowerCase())
        );
      } catch {
        return false;
      }
    });

    if (found) {
      setKabengForJurusan(found);
    } else {
      // fallback: first kabeng user if any
      const fallback =
        usersForPrint.find((u) => Number(u.id_role) === 0) || null;
      setKabengForJurusan(fallback);
    }
  }, [selectedPrintJurusan, usersForPrint]);

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
    setSelectedPrintPassword("");
    setKabengForJurusan(null);
  };

  const handlePrintReport = async () => {
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

    // Validate kabeng password for the selected jurusan
    if (!kabengForJurusan) {
      alert(
        "Tidak dapat menemukan akun Kabeng yang cocok untuk jurusan ini. Cek konfigurasi akun admin."
      );
      return;
    }

    // Prefer using the logged-in user's password from the admin table.
    const loggedUsernameRaw =
      (typeof window !== "undefined" &&
        (localStorage.getItem("user") ||
          sessionStorage.getItem("displayName") ||
          (document.cookie || "")
            .split("; ")
            .find((c) => c.startsWith("user="))
            ?.split("=")[1])) ||
      "";

    const loggedUsername =
      typeof loggedUsernameRaw === "string"
        ? decodeURIComponent(loggedUsernameRaw)
        : "";

    const loggedUser = usersForPrint.find(
      (u) => String(u.nama) === String(loggedUsername)
    );

    const loginPassword =
      typeof window !== "undefined"
        ? sessionStorage.getItem("userPassword")
        : null;

    // Determine expected password: prefer the admin-table password for the logged-in user,
    // otherwise fall back to the kabengForJurusan record.
    let expected = "";
    if (loggedUser && loggedUser.password) {
      expected = String(loggedUser.password);
    } else if (kabengForJurusan && kabengForJurusan.password) {
      expected = String(kabengForJurusan.password);
    }

    // If we have loginPassword from the current session, prefer that when the loggedUser exists.
    if (loggedUser && loginPassword) {
      expected = loginPassword;
    }

    if (!expected) {
      alert("Tidak ada informasi password untuk divalidasi. Cetak dibatalkan.");
      return;
    }

    if (String(selectedPrintPassword) !== String(expected)) {
      alert("Password Kabeng salah. Cetak dibatalkan.");
      return;
    }

    // Build product list for the selected jurusan. We prefer to use the
    // already-fetched `data` state (mapped array), falling back to remote
    // fetch if it's empty.
    const buildProductsForJurusan = async () => {
      // data is [[id, name, kategori, jurusan, labor, jumlah, status], ...]
      let products: Array<{
        id: number;
        nama: string;
        kategori: string;
        jurusan: string;
        labor: string;
        jumlah: number;
        status: string;
      }> = [];

      try {
        if (Array.isArray(data) && data.length > 0) {
          products = data
            .map((row) => ({
              id: Number(row[0] ?? 0),
              nama: String(row[1] ?? ""),
              kategori: String(row[2] ?? ""),
              jurusan: String(row[3] ?? ""),
              labor: String(row[4] ?? ""),
              jumlah: Number(row[5] ?? 0),
              status: String(row[6] ?? ""),
            }))
            .filter((p) => p.jurusan === selectedPrintJurusan);
        }

        if (!products.length) {
          // fallback to fetching remote
          const res = await getRemoteProducts();
          const arr = Array.isArray(res.data) ? res.data : res;
          products = (arr || [])
            .map((item: any) => ({
              id: Number(item.id_perangkat ?? 0),
              nama: String(item.nama_perangkat ?? ""),
              kategori: String(item.kategori ?? ""),
              jurusan: String(item.jurusan ?? ""),
              labor: String(item.labor ?? ""),
              jumlah: Number(item.jumlah ?? 0),
              status: String(item.status ?? ""),
            }))
            .filter((p: any) => p.jurusan === selectedPrintJurusan);
        }
      } catch (err) {
        console.error("Gagal membangun daftar produk untuk cetak:", err);
      }

      return products;
    };

    const products = await buildProductsForJurusan();

    // Try to generate a PDF with jsPDF + autotable and trigger download.
    // If generation fails, fallback to the previous print-window behavior.
    try {
      // dynamic import to avoid SSR issues and keep bundle small
      // Try several entry points: plain 'jspdf' may fail in some bundlers, so
      // fall back to the packaged ESM/UMD builds that are present in node_modules.
      let jsPDFModule: any = null;
      try {
        jsPDFModule = await import("jspdf");
      } catch (e1) {
        try {
          // @ts-ignore - Dynamic import path may not have declarations
          jsPDFModule = await import("jspdf/dist/jspdf.es.min.js");
        } catch (e2) {
          try {
            // @ts-ignore - Dynamic import path may not have declarations
            jsPDFModule = await import("jspdf/dist/jspdf.umd.min.js");
          } catch (e3) {
            // Don't throw immediately — we'll try CDN fallback below
            console.warn(
              "Local jspdf imports failed, will try CDN fallback",
              e3 || e2 || e1
            );
            jsPDFModule = null;
          }
        }
      }

      let jsPDF: any = null;
      if (jsPDFModule) {
        jsPDF =
          jsPDFModule && jsPDFModule.jsPDF
            ? jsPDFModule.jsPDF
            : jsPDFModule.default
            ? jsPDFModule.default
            : jsPDFModule;
      }

      // autotable plugin: try ESM then UMD plugin
      try {
        await import("jspdf-autotable");
      } catch (at1) {
        try {
          // @ts-ignore - Dynamic import path may not have declarations
          await import("jspdf-autotable/dist/jspdf.plugin.autotable.js");
        } catch (at2) {
          // ignore - we'll fallback to print window below if plugin missing
          console.warn("autotable import failed", at2 || at1);
        }
      }

      // If jsPDF still not available, attempt to load UMD bundles from CDN and use globals
      if (!jsPDF) {
        const loadScript = (src: string) =>
          new Promise<void>((resolve, reject) => {
            if (typeof window === "undefined")
              return reject(new Error("No window"));
            // Prevent loading the same script twice
            if (document.querySelector(`script[src=\"${src}\"]`))
              return resolve();
            const s = document.createElement("script");
            s.src = src;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = (e) =>
              reject(new Error(`Failed to load script ${src}`));
            document.head.appendChild(s);
          });

        try {
          // Load jspdf UMD from CDN
          await loadScript(
            "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js"
          );
          // Load autotable plugin
          await loadScript(
            "https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.28/dist/jspdf.plugin.autotable.js"
          );
          // Try to get jsPDF from globals (umd exposes window.jspdf.jsPDF)
          const win: any = window as any;
          jsPDF =
            (win && win.jspdf && win.jspdf.jsPDF) ||
            win.jsPDF ||
            (win && win.jspdf && win.jspdf.default && win.jspdf.default.jsPDF);
          if (!jsPDF) throw new Error("jsPDF global not found after CDN load");
        } catch (cdnErr) {
          console.warn("CDN fallback for jsPDF failed:", cdnErr);
          // let the outer catch handle fallback to print window
          throw cdnErr;
        }
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      const title = `DAFTAR INVENTARIS LABOR ${String(
        selectedPrintJurusan || ""
      ).toUpperCase()}`;
      doc.setFontSize(14);
      doc.text(title, pageWidth / 2, 40, { align: "center" });
      doc.setFontSize(10);
      doc.text("SMKN 4 PAYAKUMBUH", pageWidth / 2, 56, { align: "center" });
      // Include selected labor under the header if provided.
      // If a labor is selected, do NOT print the TP line beneath it (per request).
      if (selectedPrintLabor) {
        doc.text(String(selectedPrintLabor), pageWidth / 2, 72, {
          align: "center",
        });
      } else {
        doc.text(
          `TP. ${selectedPrintMonth || new Date().getFullYear()}`,
          pageWidth / 2,
          72,
          { align: "center" }
        );
      }

      // Use boolean flags for Baik/Rusak so we can draw vector checks and avoid
      // relying on font glyphs (which caused stray characters).
      const body = products.map((p: any, idx: number) => [
        idx + 1,
        p.nama ?? "",
        p.jumlah ?? "",
        String(p.status ?? "").toLowerCase() === "baik", // Baik boolean
        String(p.status ?? "").toLowerCase() !== "baik", // Rusak boolean
        p.keterangan ?? "",
      ]);

      // @ts-ignore - autoTable types augment jsPDF at runtime
      (doc as any).autoTable({
        startY: selectedPrintLabor ? 100 : 90,
        head: [["No", "Nama Barang", "Jumlah", "Baik", "Rusak", "Keterangan"]],
        body,
        styles: { font: "helvetica", fontSize: 9, textColor: 20 },
        headStyles: { fillColor: [34, 34, 34], textColor: 255 },
        theme: "grid",
        margin: { left: 40, right: 40 },
        columnStyles: {
          0: { cellWidth: 30 }, // No
          1: { cellWidth: 220 }, // Nama
          2: { cellWidth: 60 }, // Jumlah
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
          5: { cellWidth: 140 },
        },
        didParseCell: (data: any) => {
          // Prevent boolean true/false from being rendered as text in cells 3 & 4
          try {
            if (
              (data.column.index === 3 || data.column.index === 4) &&
              data.cell &&
              typeof data.cell.raw === "boolean"
            ) {
              data.cell.text = [""]; // clear text so no stray glyph appears for true/false
            }
          } catch (e) {
            // ignore
          }
        },
        didDrawCell: (data: any) => {
          // Draw a compact vector check mark for Baik (col 3) or Rusak (col 4)
          try {
            const col = data.column.index;
            if (
              (col === 3 || col === 4) &&
              data.cell &&
              data.cell.raw === true
            ) {
              const cell = data.cell;
              const w = cell.width;
              const h = cell.height;
              // Slightly adjusted positions for a neat, small check
              const startX = cell.x + w * 0.22;
              const startY = cell.y + h * 0.62;
              const midX = cell.x + w * 0.42;
              const midY = cell.y + h * 0.78;
              const endX = cell.x + w * 0.78;
              const endY = cell.y + h * 0.28;

              doc.setDrawColor(0, 0, 0);
              doc.setLineWidth(1.1);
              doc.line(startX, startY, midX, midY);
              doc.line(midX, midY, endX, endY);
            }
          } catch (e) {
            // ignore drawing errors
          }
        },
      });

      const safeJurusan = (selectedPrintJurusan || "jurusan")
        .replace(/\s+/g, "-")
        .toLowerCase();
      const fileName = `laporan-${safeJurusan}-${
        selectedPrintMonth || String(new Date().getMonth() + 1)
      }.pdf`;
      doc.save(fileName);
    } catch (pdfErr) {
      console.error(
        "PDF generation failed, falling back to print window:",
        pdfErr
      );

      // Fallback: open printable HTML in new window (original behavior)
      const generateReportHtml = (
        jurusanTitle: string,
        monthLabel: string,
        productsList: any[]
      ) => {
        const now = new Date();
        const header = `<div style="text-align:center;margin-bottom:12px;line-height:1.1"><h3 style="margin:0;padding:0;">DAFTAR INVENTARIS LABOR ${escapeHtml(
          jurusanTitle.toUpperCase()
        )}</h3><div style="font-weight:700">SMKN 4 PAYAKUMBUH</div><div style="margin-top:4px">TP.${escapeHtml(
          monthLabel || String(now.getFullYear())
        )}</div></div>`;

        const tableRows = productsList
          .map((p: any, idx: number) => {
            const isBaik = String(p.status ?? "").toLowerCase() === "baik";
            const isRusak = !isBaik;
            return `
            <tr>
              <td style="border:1px solid #444;padding:6px;text-align:center;">${
                idx + 1
              }</td>
              <td style="border:1px solid #444;padding:6px;">${escapeHtml(
                p.nama
              )}</td>
              <td style="border:1px solid #444;padding:6px;text-align:center;">${
                p.jumlah ?? ""
              }</td>
              <td style="border:1px solid #444;padding:6px;text-align:center;">${
                isBaik ? "✓" : ""
              }</td>
              <td style="border:1px solid #444;padding:6px;text-align:center;">${
                isRusak ? "✓" : ""
              }</td>
              <td style="border:1px solid #444;padding:6px;text-align:left;">${escapeHtml(
                p.keterangan ?? ""
              )}</td>
            </tr>`;
          })
          .join("\n");

        const table = `
        <table style="width:100%;border-collapse:collapse;background:#111;color:#fff;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
          <thead>
            <tr>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">No</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Nama Barang</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Jumlah</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Baik</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Rusak</th>
              <th style="border:1px solid #444;padding:8px;background:#222;color:#fff;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>`;

        return `<!doctype html><html><head><meta charset="utf-8"><title>Report ${escapeHtml(
          jurusanTitle
        )}</title></head><body style="margin:20px;">${header}${table}</body></html>`;
      };

      // Small helper to avoid injecting raw HTML
      const escapeHtml = (unsafe: any) => {
        if (unsafe === null || unsafe === undefined) return "";
        return String(unsafe)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };

      if (typeof window !== "undefined") {
        const html = generateReportHtml(
          selectedPrintJurusan || "",
          selectedPrintMonth || "",
          products
        );
        const w = window.open("", "_blank", "width=900,height=700");
        if (!w) {
          alert("Popup diblokir. Izinkan popup untuk mendownload laporan.");
          return;
        }
        w.document.open();
        w.document.write(html);
        w.document.close();
        // Wait a bit for rendering then call print; user can choose Save as PDF
        setTimeout(() => {
          try {
            w.focus();
            w.print();
          } catch (e) {
            console.error("Print failed:", e);
          }
        }, 500);
      }

      // Close modal after triggering print/fallback
      handleClosePrintModal();
      return;
    }

    // Close modal after successful PDF generation
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

              {/* Password field for Kabeng per-jurusan */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Kabeng untuk jurusan terpilih:
                </label>
                <input
                  type="password"
                  value={selectedPrintPassword}
                  onChange={(e) => setSelectedPrintPassword(e.target.value)}
                  placeholder="Masukkan password Kabeng"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {loggedUserRecord ? (
                  <p className="text-xs text-gray-500 mt-2">
                    Memeriksa password akun login:{" "}
                    <strong>{loggedUserRecord.nama}</strong>
                  </p>
                ) : kabengForJurusan ? (
                  <p className="text-xs text-gray-500 mt-2">
                    Memeriksa password Kabeng:{" "}
                    <strong>{kabengForJurusan.nama}</strong>
                  </p>
                ) : (
                  <p className="text-xs text-red-500 mt-2">
                    Tidak ditemukan akun Kabeng untuk jurusan ini.
                  </p>
                )}
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
