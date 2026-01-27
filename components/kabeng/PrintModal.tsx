// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { UserMinimal, ProductData, ExportProduct } from "@/types/product";
import { generateProductReport, fallbackPrintHtml } from "@/lib/pdfGenerator";

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductData[];
  initialJurusan?: string;
}

export default function PrintModal({
  isOpen,
  onClose,
  products,
  initialJurusan,
}: PrintModalProps) {
  const [selectedPrintMonth, setSelectedPrintMonth] = useState("");
  const [selectedPrintJurusan, setSelectedPrintJurusan] = useState("");
  const [selectedPrintLabor, setSelectedPrintLabor] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [passwordForPrint, setPasswordForPrint] = useState("");
  const [cityForPrint, setCityForPrint] = useState("");
  const [printReporterName, setPrintReporterName] = useState("");
  const [printReporterNip, setPrintReporterNip] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [laborList, setLaborList] = useState<string[]>([]);
  const [jurusanList, setJurusanList] = useState<string[]>([]);

  useEffect(() => {
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

    const fetchLabor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/labor`,
          {
            headers: getAuthHeaders(),
            credentials: "include",
          },
        );
        const data = await res.json();
        if (res.ok && data.data)
          setLaborList(
            data.data.map((l: { nama_labor: string }) => l.nama_labor),
          );
      } catch {}
    };

    const fetchJurusan = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`,
          {
            headers: getAuthHeaders(),
            credentials: "include",
          },
        );
        const data = await res.json();
        if (res.ok && data.data)
          setJurusanList(data.data.map((j: { jurusan: string }) => j.jurusan));
      } catch {}
    };

    if (isOpen) {
      fetchLabor();
      fetchJurusan();
      if (initialJurusan) {
        setSelectedPrintJurusan(initialJurusan);
      }

      // Default Academic Year logic (e.g., current year like "2024/2025")
      const now = new Date();
      const currentYear = now.getFullYear();
      const nextYear = currentYear + 1;
      const prevYear = currentYear - 1;
      // If current month is >= July (month index 6), we are in first semester: "2024/2025"
      // Else (Jan - June), we are in second semester of prev year: "2023/2024"
      if (now.getMonth() >= 6) {
        setSelectedAcademicYear(`${currentYear}/${nextYear}`);
      } else {
        setSelectedAcademicYear(`${prevYear}/${currentYear}`);
      }

      // Try to auto-fill current user name if available
      if (typeof window !== "undefined") {
        try {
          const u =
            sessionStorage.getItem("displayName") ||
            localStorage.getItem("user");
          if (u) setPrintReporterName(u);
        } catch {}
      }
    }
  }, [isOpen, initialJurusan]);

  if (!isOpen) return null;

  const handlePrint = async () => {
    setIsVerifying(true);
    let isPasswordValid = false;

    // A. Check against session storage (fastest)
    const sessionPass =
      typeof window !== "undefined"
        ? sessionStorage.getItem("userPassword")
        : null;

    if (sessionPass && sessionPass === passwordForPrint) {
      isPasswordValid = true;
    }

    // B. If not valid via session, try to verify against API (Login Check)
    // This allows validation even if session storage was cleared or page refreshed
    if (!isPasswordValid) {
      try {
        const currentUserName =
          typeof window !== "undefined"
            ? sessionStorage.getItem("displayName") ||
              localStorage.getItem("user")
            : null;

        if (currentUserName) {
          const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nama_user: currentUserName,
              password: passwordForPrint,
            }),
            credentials: "include",
          });

          if (res.ok) {
            isPasswordValid = true;
            // Optionally update session for next time
            try {
              sessionStorage.setItem("userPassword", passwordForPrint);
            } catch {}
          }
        }
      } catch (err) {
        console.error("Verification failed", err);
      }
    }

    setIsVerifying(false);

    if (!isPasswordValid) {
      alert(
        "Password salah! Anda tidak memiliki akses untuk mencetak laporan.",
      );
      return;
    }

    // 2. Filter products based on selections
    let filteredForPrint = products;
    if (selectedPrintJurusan) {
      filteredForPrint = filteredForPrint.filter(
        (p) =>
          String(p[3] || "")
            .toLowerCase()
            .trim() === selectedPrintJurusan.toLowerCase().trim(),
      );
    }
    if (selectedPrintLabor) {
      filteredForPrint = filteredForPrint.filter(
        (p) =>
          String(p[4] || "")
            .toLowerCase()
            .trim() === selectedPrintLabor.toLowerCase().trim(),
      );
    }
    // Note: selectedPrintMonth is currently just a label, doesn't filter by date unless we have date fields in product

    if (filteredForPrint.length === 0) {
      alert("Tidak ada data barang yang sesuai dengan filter.");
      return;
    }

    // Map to simple object for PDF
    const exportData: ExportProduct[] = filteredForPrint.map((p) => ({
      nama: p[1],
      jumlah: Number(p[5]),
      status: p[6],
      keterangan: "", // No register/keterangan in tuple, using empty string
    }));

    try {
      if (typeof window !== "undefined") {
        await generateProductReport(
          selectedPrintJurusan,
          selectedPrintMonth,
          selectedPrintLabor,
          selectedAcademicYear,
          cityForPrint,
          exportData,
          printReporterName,
          printReporterNip,
        );
      }
    } catch (err) {
      console.error("PDF Generation failed, using HTML fallback", err);
      fallbackPrintHtml(
        selectedPrintJurusan,
        selectedPrintMonth,
        selectedPrintLabor,
        selectedAcademicYear,
        cityForPrint,
        exportData,
        printReporterName,
        printReporterNip,
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl bg-[#1e1e1e] border border-[#333] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#333] flex justify-between items-center bg-[#252525]">
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-400"
            >
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Cetak Laporan
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#333] rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Section 1: Report Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
              Detail Laporan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Jurusan
                </label>
                <select
                  value={selectedPrintJurusan}
                  onChange={(e) => setSelectedPrintJurusan(e.target.value)}
                  className="w-full rounded-lg border border-[#444] bg-[#2a2a2a] p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="">-- Pilih Jurusan --</option>
                  {jurusanList.map((jurusan) => (
                    <option key={jurusan} value={jurusan}>
                      {jurusan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Nama Sekolah / Instansi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SMKN 2 Padang Panjang"
                  value={selectedPrintMonth}
                  onChange={(e) => setSelectedPrintMonth(e.target.value)}
                  className="w-full rounded-lg border border-[#444] bg-[#2a2a2a] p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Laboratorium
                </label>
                <select
                  value={selectedPrintLabor}
                  onChange={(e) => setSelectedPrintLabor(e.target.value)}
                  className="w-full rounded-lg border border-[#444] bg-[#2a2a2a] p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                >
                  <option value="">-- Pilih Laboratorium --</option>
                  {laborList.map((labor) => (
                    <option key={labor} value={labor}>
                      {labor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 2024/2025"
                  value={selectedAcademicYear}
                  onChange={(e) => setSelectedAcademicYear(e.target.value)}
                  className="w-full rounded-lg border border-[#444] bg-[#2a2a2a] p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#333]" />

          {/* Section 2: Signatory Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
              Tanda Tangan & Lokasi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Kota (Tempat Cetak)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Padang Panjang"
                  value={cityForPrint}
                  onChange={(e) => setCityForPrint(e.target.value)}
                  className="w-full rounded-lg border border-[#444] bg-[#2a2a2a] p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Nama Penandatangan
                </label>
                <input
                  type="text"
                  placeholder="Nama Kabeng / Kepsek"
                  value={printReporterName}
                  onChange={(e) => setPrintReporterName(e.target.value)}
                  className="w-full rounded-lg border border-[#444] bg-[#2a2a2a] p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  NIP Penandatangan
                </label>
                <input
                  type="text"
                  placeholder="NIP (Opsional)"
                  value={printReporterNip}
                  onChange={(e) => setPrintReporterNip(e.target.value)}
                  className="w-full rounded-lg border border-[#444] bg-[#2a2a2a] p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#333]" />

          {/* Section 3: Authorization */}
          <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-400 mt-0.5"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <div className="flex-1">
                <label className="block text-sm font-medium text-red-200 mb-1.5">
                  Verifikasi Password
                </label>
                <p className="text-xs text-red-300/70 mb-2">
                  Masukkan password login Anda untuk validasi pencetakan.
                </p>
                <input
                  type="password"
                  placeholder="Password Login"
                  value={passwordForPrint}
                  onChange={(e) => setPasswordForPrint(e.target.value)}
                  className="w-full rounded-lg border border-red-900/50 bg-[#1a0505] p-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-red-900/50"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#252525] border-t border-[#333] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-[#333] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handlePrint}
            disabled={
              !selectedPrintJurusan ||
              !passwordForPrint ||
              !printReporterName ||
              !selectedPrintMonth ||
              !cityForPrint ||
              !selectedAcademicYear ||
              isVerifying
            }
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20"
          >
            {isVerifying ? "Memverifikasi..." : "Cetak PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
