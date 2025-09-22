"use client";
import React, { useState, useEffect } from "react";
import { postProduct } from "@/lib/api/productApi";
import { editRemoteProduct } from "@/lib/api/editRemoteProduct";

interface AddProductProps {
  onAddProduct: (
    data: [string, string, string, string, number, string]
  ) => void;
  onCancel: () => void;
  defaultValue?: [string, string, string, string, number, string];
}

export default function AddProduct({
  onAddProduct,
  onCancel,
  defaultValue,
}: AddProductProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    nama_barang: defaultValue ? defaultValue[1] : "",
    category: defaultValue ? defaultValue[2] : "",
    jurusan: defaultValue ? defaultValue[3] : "",
    labor: defaultValue ? String(defaultValue[4]) : "",
    jumlah: defaultValue ? String(defaultValue[4]) : "",
    status: defaultValue ? defaultValue[5] : "",
  });
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [laborList, setLaborList] = useState<string[]>([]);
  const [jurusanList, setJurusanList] = useState<string[]>([]);
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/kategori`
        );
        const data = await res.json();
        if (res.ok && data.data)
          setKategoriList(data.data.map((k: any) => k.kategori));
      } catch {}
    };
    const fetchLabor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/labor`
        );
        const data = await res.json();
        if (res.ok && data.data)
          setLaborList(data.data.map((l: any) => l.nama_labor));
      } catch {}
    };
    const fetchJurusan = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`
        );
        const data = await res.json();
        if (res.ok && data.data)
          setJurusanList(data.data.map((j: any) => j.jurusan));
      } catch {}
    };
    fetchKategori();
    fetchLabor();
    fetchJurusan();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi field wajib
    if (
      !form.nama_barang ||
      !form.category ||
      !form.jurusan ||
      !form.labor ||
      !form.jumlah ||
      !form.status
    ) {
      alert("Harus lengkapi semua field dulu");
      return;
    }
    try {
      if (defaultValue) {
        // Edit mode
        const payload = {
          id_perangkat: Number(defaultValue[0]),
          nama_barang: form.nama_barang,
          category: form.category,
          jurusan: form.jurusan,
          labor: String(form.labor),
          jumlah: Number(form.jumlah),
          status: form.status,
        };
        const res = await editRemoteProduct(payload);
        alert("Berhasil diubah");
        onAddProduct([
          String(payload.id_perangkat),
          payload.nama_barang,
          payload.category,
          payload.jurusan,
          Number(payload.jumlah),
          payload.status,
        ]);
      } else {
        // Add mode
        const payload = {
          nama_barang: form.nama_barang,
          category: form.category,
          jurusan: form.jurusan,
          labor: String(form.labor),
          jumlah: Number(form.jumlah),
          status: form.status,
        };
        const res = await postProduct(payload);
        alert("Berhasil ditambahkan");
        onAddProduct([
          "new", // ID sementara untuk produk baru
          payload.nama_barang,
          payload.category,
          payload.jurusan,
          payload.jumlah,
          payload.status,
        ]);
      }
      onCancel();
      setForm({
        nama_barang: "",
        category: "",
        jurusan: "",
        labor: "",
        jumlah: "",
        status: "",
      });
    } catch (err: any) {
      alert("Gagal: " + err.message);
    }
  };

  const handleYakin = () => {
    // Kirim data produk baru ke parent (Product)
    onAddProduct([
      "new", // ID sementara
      form.nama_barang,
      form.category,
      form.jurusan,
      Number(form.jumlah),
      form.status,
    ]);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else {
      onCancel();
    }
  };
  return (
    <div className="min-h-screen bg-[#f3f3f3] py-8">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 relative">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#d9d9d9] px-8 py-5">
            <h2 className="text-2xl font-bold font-sans">Add Product</h2>
            <img
              src="/tefa.jpg"
              alt="icon smk 4"
              className="rounded-full w-16 h-16 object-contain"
            />
          </div>
          {/* Form */}
          <form className="px-8 py-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
              <div>
                <label className="block text-sm mb-2 font-sans font-normal text-gray-700">
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="nama_barang"
                  value={form.nama_barang}
                  onChange={handleChange}
                  placeholder="inputkan nama barang"
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 font-sans font-normal text-gray-700">
                  Labor
                </label>
                <select
                  name="labor"
                  id="labor"
                  value={form.labor}
                  onChange={handleChange}
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                >
                  <option value="">Pilih Labor</option>
                  {laborList.length === 0 ? (
                    <option value="">(tidak ada data labor)</option>
                  ) : (
                    laborList.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 font-sans font-normal text-gray-700">
                  Kategori
                </label>
                <select
                  name="category"
                  id="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriList.length === 0 ? (
                    <option value="">(tidak ada data kategori)</option>
                  ) : (
                    kategoriList.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 font-sans font-normal text-gray-700">
                  Jumlah
                </label>
                <input
                  type="number"
                  name="jumlah"
                  value={form.jumlah}
                  onChange={handleChange}
                  placeholder="inputkan jumlah"
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                  min={1}
                  max={256}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 font-sans font-normal text-gray-700">
                  Jurusan
                </label>
                <select
                  name="jurusan"
                  id="jurusan"
                  value={form.jurusan}
                  onChange={handleChange}
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusanList.length === 0 ? (
                    <option value="">(tidak ada data jurusan)</option>
                  ) : (
                    jurusanList.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 font-sans font-normal text-gray-700">
                  Status Barang
                </label>
                <select
                  name="status"
                  id="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                >
                  <option value="">Pilih Status</option>
                  <option value="BAIK">BAIK</option>
                  <option value="RUSAK">RUSAK</option>
                </select>
              </div>
            </div>
            <div className="mb-4"></div>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-[#1877f2] hover:bg-blue-700 text-white font-medium text-lg py-2 rounded-md transition-all"
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Add Product
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 bg-[#ff1616] hover:bg-red-700 text-white font-medium text-lg py-2 rounded-md transition-all"
                onClick={handleCancel}
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <polyline points="5 12 19 12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                cancel
              </button>
            </div>
          </form>
          {/* Modal konfirmasi */}
        </div>
      </div>
    </div>
  );
}
