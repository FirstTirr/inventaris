"use client";
import React, { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import TabelJurusan from "./tabelJurusan";

export default function CrudLabor() {
  // Fungsi untuk menambah labor
  const handleSaveLabor = async () => {
    if (!labor) return alert("Nama labor tidak boleh kosong!");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/labor/new`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama_labor: labor }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal menambah labor");
      alert("Labor berhasil ditambahkan!");
      setLabor("");
      // (opsional) refresh data labor di tabel jika ada
    } catch (err: any) {
      alert(err.message || "Gagal menambah labor");
    }
  };
  // Fungsi untuk menambah kelas
  const handleSaveKelas = async () => {
    if (!kelas) return alert("Nama kelas tidak boleh kosong!");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kelas/new`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama_kelas: kelas }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal menambah kelas");
      alert("Kelas berhasil ditambahkan!");
      setKelas("");
      // (opsional) refresh data kelas di tabel jika ada
    } catch (err: any) {
      alert(err.message || "Gagal menambah kelas");
    }
  };
  const [labor, setLabor] = useState("");
  const [kelas, setKelas] = useState("");
  const [kategori, setKategori] = useState("");
  const [jurusan, setJurusan] = useState("");
  // Dummy jurusan data for table
  const [jurusanList, setJurusanList] = useState<string[]>([
    "RPL",
    "TKJ",
    "DKV",
    "BC",
  ]);
  // Table dropdown state
  const [selectedTable, setSelectedTable] = useState<string>("labor");
  // Collapsible state & refs for jurusan
  const [jurusanOpen, setJurusanOpen] = useState(false);
  const jurusanRef = useRef<HTMLDivElement | null>(null);
  const [jurusanMaxHeight, setJurusanMaxHeight] = useState("0px");

  useEffect(() => {
    if (!jurusanRef.current) return;
    if (jurusanOpen) {
      const scroll = jurusanRef.current.scrollHeight;
      window.requestAnimationFrame(() => setJurusanMaxHeight(`${scroll}px`));
    } else {
      setJurusanMaxHeight("0px");
    }
  }, [jurusanOpen, jurusan]);
  const [jumlahKelas, setJumlahKelas] = useState<number>(0);
  const [jumlahLabor, setJumlahLabor] = useState<number>(0);
  // Fetch jumlah kelas & labor for statistik card
  useEffect(() => {
    const fetchJumlahKelas = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kelas`
        );
        const data = await res.json();
        if (res.ok && data.data) {
          setJumlahKelas(data.data.length);
        }
      } catch (err) {}
    };
    const fetchJumlahLabor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/labor`
        );
        const data = await res.json();
        if (res.ok && data.data) {
          setJumlahLabor(data.data.length);
        }
      } catch (err) {}
    };
    fetchJumlahKelas();
    fetchJumlahLabor();
  }, []);

  // Collapsible state & refs for all three sections
  const [laborOpen, setLaborOpen] = useState(false);
  const laborRef = useRef<HTMLDivElement | null>(null);
  const [laborMaxHeight, setLaborMaxHeight] = useState("0px");

  useEffect(() => {
    if (!laborRef.current) return;
    if (laborOpen) {
      const scroll = laborRef.current.scrollHeight;
      window.requestAnimationFrame(() => setLaborMaxHeight(`${scroll}px`));
    } else {
      setLaborMaxHeight("0px");
    }
  }, [laborOpen, labor]);

  const [kelasOpen, setKelasOpen] = useState(false);
  const kelasRef = useRef<HTMLDivElement | null>(null);
  const [kelasMaxHeight, setKelasMaxHeight] = useState("0px");

  useEffect(() => {
    if (!kelasRef.current) return;
    if (kelasOpen) {
      const scroll = kelasRef.current.scrollHeight;
      window.requestAnimationFrame(() => setKelasMaxHeight(`${scroll}px`));
    } else {
      setKelasMaxHeight("0px");
    }
  }, [kelasOpen, kelas]);

  const [kategoriOpen, setKategoriOpen] = useState(false);
  const kategoriRef = useRef<HTMLDivElement | null>(null);
  const [kategoriMaxHeight, setKategoriMaxHeight] = useState("0px");

  useEffect(() => {
    if (!kategoriRef.current) return;
    if (kategoriOpen) {
      const scroll = kategoriRef.current.scrollHeight;
      window.requestAnimationFrame(() => setKategoriMaxHeight(`${scroll}px`));
    } else {
      setKategoriMaxHeight("0px");
    }
  }, [kategoriOpen, kategori]);

  return (
    <div className="min-h-screen bg-[#f7f7f9]">
      <div className="flex justify-end p-4"></div>
      {/* Info Cards */}
      <div className="w-full flex flex-col sm:flex-row gap-6 justify-center items-center mt-2 px-2">
        {/* Card: Labor */}
        <div className="w-full sm:flex-1 max-w-xs sm:max-w-xs bg-black rounded-2xl shadow-lg p-6 flex flex-col items-center min-w-0 sm:min-w-[220px]">
          <span className="text-white text-xl font-semibold mb-2">
            Jumlah Labor
          </span>
          <span className="text-3xl font-extrabold text-white mb-4">
            {jumlahLabor}
          </span>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium text-sm shadow hover:bg-gray-100 transition">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-arrow-right-circle"
            >
              <circle cx="9" cy="9" r="8" />
              <polyline points="8 6 11 9 8 12" />
            </svg>
            more info
          </button>
        </div>
        {/* Card: Kelas */}
        <div className="w-full sm:flex-1 max-w-xs sm:max-w-xs bg-green-500 rounded-2xl shadow-lg p-6 flex flex-col items-center min-w-0 sm:min-w-[220px]">
          <span className="text-white text-xl font-semibold mb-2">
            Jumlah Kelas
          </span>
          <span className="text-3xl font-extrabold text-white mb-4">
            {jumlahKelas}
          </span>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium text-sm shadow hover:bg-gray-100 transition">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-arrow-right-circle"
            >
              <circle cx="9" cy="9" r="8" />
              <polyline points="8 6 11 9 8 12" />
            </svg>
            more info
          </button>
        </div>
        {/* Card: Kategori */}
        <div className="w-full sm:flex-1 max-w-xs sm:max-w-xs bg-gray-500 rounded-2xl shadow-lg p-6 flex flex-col items-center min-w-0 sm:min-w-[220px]">
          <span className="text-white text-xl font-semibold mb-2">
            Jumlah Kategori
          </span>
          <span className="text-3xl font-extrabold text-white mb-4">0</span>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium text-sm shadow hover:bg-gray-100 transition">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-arrow-right-circle"
            >
              <circle cx="9" cy="9" r="8" />
              <polyline points="8 6 11 9 8 12" />
            </svg>
            more info
          </button>
        </div>
      </div>
      {/* Table Dropdown Navigation */}
      <div className="flex justify-center mt-10 mb-6">
        <div className="flex gap-4">
          <button
            className={`px-6 py-2 rounded-full font-bold text-base transition-colors ${
              selectedTable === "labor"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedTable("labor")}
          >
            Labor
          </button>
          <button
            className={`px-6 py-2 rounded-full font-bold text-base transition-colors ${
              selectedTable === "kelas"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedTable("kelas")}
          >
            Kelas
          </button>
          <button
            className={`px-6 py-2 rounded-full font-bold text-base transition-colors ${
              selectedTable === "kategori"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedTable("kategori")}
          >
            Kategori
          </button>
          <button
            className={`px-6 py-2 rounded-full font-bold text-base transition-colors ${
              selectedTable === "jurusan"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedTable("jurusan")}
          >
            Jurusan
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col items-center gap-14 mt-4">
        {selectedTable === "jurusan" && <TabelJurusan />}
        {/* Tambahkan Labor */}
        <div className="bg-white hover:text-red-700 rounded-3xl shadow-lg p-4 sm:p-8 md:p-12 w-full max-w-[700px] flex flex-col items-center">
          <button
            type="button"
            aria-expanded={laborOpen}
            onClick={() => setLaborOpen((s) => !s)}
            className=" rounded-full w-full text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-center focus:outline-none"
          >
            Tambahkan Labor
          </button>
          <div
            ref={laborRef}
            style={{ maxHeight: laborMaxHeight }}
            className="w-full overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
          >
            <div
              className={`transform transition-transform duration-300 ease-in-out ${
                laborOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <input
                type="text"
                placeholder="tambahkan labor"
                value={labor}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                  setLabor(value);
                }}
                className="w-full mb-10 px-4 py-3 sm:px-6 sm:py-4 rounded-full bg-gray-200 text-center text-black font-semibold text-lg sm:text-xl outline-none"
              />
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full justify-center mb-2">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg transition-colors">
                  delete
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg transition-colors"
                  onClick={handleSaveLabor}
                >
                  save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tambahkan Jurusan */}
        <div className="bg-white hover:text-red-700 rounded-3xl shadow-lg p-4 sm:p-8 md:p-12 w-full max-w-[700px] flex flex-col items-center">
          <button
            type="button"
            aria-expanded={jurusanOpen}
            onClick={() => setJurusanOpen((s) => !s)}
            className="rounded-full w-full text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-center focus:outline-none"
          >
            Tambahkan Jurusan
          </button>
          <div
            ref={jurusanRef}
            style={{ maxHeight: jurusanMaxHeight }}
            className="w-full overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
          >
            <div
              className={`transform transition-transform duration-300 ease-in-out ${
                jurusanOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <input
                type="text"
                placeholder="tambahkan jurusan"
                value={jurusan}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                  setJurusan(value);
                }}
                className="w-full mb-10 px-4 py-3 sm:px-6 sm:py-4 rounded-full bg-gray-200 text-center text-black font-semibold text-lg sm:text-xl outline-none"
              />
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full justify-center mb-2">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg transition-colors">
                  delete
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg transition-colors"
                  onClick={async () => {
                    if (!jurusan)
                      return alert("Nama jurusan tidak boleh kosong!");
                    try {
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan/new`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ jurusan }),
                        }
                      );
                      const data = await res.json();
                      if (!res.ok)
                        throw new Error(
                          data.detail || "Gagal menambah jurusan"
                        );
                      alert("Jurusan berhasil ditambahkan!");
                      setJurusan("");
                      // (opsional) refresh data jurusan di tabel jika ada
                    } catch (err: any) {
                      alert(err.message || "Gagal menambah jurusan");
                    }
                  }}
                >
                  save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tambahkan Kelas */}
        <div className="bg-white hover:text-red-700 rounded-3xl shadow-lg p-4 sm:p-8 md:p-12 w-full max-w-[700px] flex flex-col items-center">
          <button
            type="button"
            aria-expanded={kelasOpen}
            onClick={() => setKelasOpen((s) => !s)}
            className="w-full text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-center focus:outline-none"
          >
            Tambahkan Kelas
          </button>
          <div
            ref={kelasRef}
            style={{ maxHeight: kelasMaxHeight }}
            className="w-full overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
          >
            <div
              className={`transform transition-transform duration-300 ease-in-out ${
                kelasOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <input
                type="text"
                placeholder="tambahkan kelas"
                value={kelas}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                  setKelas(value);
                }}
                className="w-full mb-10 px-4 py-3 sm:px-6 sm:py-4 rounded-full bg-gray-200 text-center text-black font-semibold text-lg sm:text-xl outline-none"
              />
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full justify-center">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg transition-colors">
                  delete
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg transition-colors"
                  onClick={handleSaveKelas}
                >
                  save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tambahkan Category */}
        <div className="bg-white hover:text-red-700 rounded-3xl shadow-lg p-4 sm:p-8 md:p-12 w-full max-w-[700px] flex flex-col items-center">
          <button
            type="button"
            aria-expanded={kategoriOpen}
            onClick={() => setKategoriOpen((s) => !s)}
            className="w-full text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-center focus:outline-none"
          >
            Tambahkan Category
          </button>
          <div
            ref={kategoriRef}
            style={{ maxHeight: kategoriMaxHeight }}
            className="w-full overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
          >
            <div
              className={`transform transition-transform duration-300 ease-in-out ${
                kategoriOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <input
                type="text"
                placeholder="tambahkan category"
                value={kategori}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
                  setKategori(value);
                }}
                className="w-full mb-10 px-4 py-3 sm:px-6 sm:py-4 rounded-full bg-gray-200 text-center text-black font-semibold text-lg sm:text-xl outline-none"
              />
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full justify-center">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg transition-colors">
                  delete
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg transition-colors"
                  onClick={async () => {
                    if (!kategori)
                      return alert("Nama kategori tidak boleh kosong!");
                    try {
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kategori/new`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ kategori }),
                        }
                      );
                      const data = await res.json();
                      if (!res.ok)
                        throw new Error(
                          data.detail || "Gagal menambah kategori"
                        );
                      alert("Kategori berhasil ditambahkan!");
                      setKategori("");
                    } catch (err: any) {
                      alert(err.message || "Gagal menambah kategori");
                    }
                  }}
                >
                  save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
