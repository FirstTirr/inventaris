"use client";
import React, { useState } from "react";
import { postProduct } from "@/lib/api/productApi";

interface AddProductProps {
  onAddProduct: (data: [string, string, string]) => void;
  onCancel: () => void;
}

export default function AddProduct({
  onAddProduct,
  onCancel,
}: AddProductProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    nama_produk: "",
    labor: "",
    kategori: "",
    jumlah: "",
    jurusan: "",
    nomor_barang: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Pastikan jumlah dikirim sebagai number
      const payload = { ...form, jumlah: Number(form.jumlah) };
      const res = await postProduct(payload);
      alert("Berhasil: " + JSON.stringify(res));
      onAddProduct([form.nama_produk, form.labor, form.nomor_barang]);
      onCancel();
      setForm({
        nama_produk: "",
        labor: "",
        kategori: "",
        jumlah: "",
        jurusan: "",
        nomor_barang: "",
      });
    } catch (err: any) {
      alert("Gagal: " + err.message);
    }
  };

  const handleYakin = () => {
    // Kirim data produk baru ke parent (Product)
    onAddProduct([form.nama_produk, form.labor, form.nomor_barang]);
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
              src="/iconsmk-4.png"
              alt="icon smk 4"
              className="w-16 h-16 object-contain"
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
                  name="nama_produk"
                  value={form.nama_produk}
                  onChange={handleChange}
                  placeholder="inputkan nama produk"
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
                  onChange={(e) => setForm({ ...form, labor: e.target.value })}
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                >
                  <option value="">Pilih Labor</option>
                  <option value="LABOR PK">LABOR PK</option>
                  <option value="LABOR RPL">LABOR RPL</option>
                  <option value="LABOR BC">LABOR BC</option>
                  <option value="LABOR 1 DKV">LABOR 1 DKV</option>
                  <option value="LABOR 2 DKV">LABOR 2 DKV</option>
                  <option value="LABOR 1 TKJ">LABOR 1 TKJ</option>
                  <option value="LABOR 2 TKJ">LABOR 2 TKJ</option>
                  <option value="LABOR 3 TKJ">LABOR 3 TKJ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 font-sans font-normal text-gray-700">
                  Kategori
                </label>
                <select
                  name="kategori"
                  id="kategori"
                  value={form.kategori}
                  onChange={(e) =>
                    setForm({ ...form, kategori: e.target.value })
                  }
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="PC">PC</option>
                  <option value="MONITOR">MONITOR</option>
                  <option value="MIXER">MIXER</option>
                  <option value="KAMERA">KAMERA</option>
                  <option value="MICROPHONE">MICROPHONE</option>
                  <option value="HANDYCAM">HANDYCAM</option>
                  <option value="SPEAKER">SPEAKER</option>
                  <option value="SARAMONIC">SARAMONIC</option>
                  <option value="LIGHTING">LIGHTING</option>
                  <option value="LIGHTING">LAPTOP</option>
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
                  onChange={(e) =>
                    setForm({ ...form, jurusan: e.target.value })
                  }
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                >
                  <option value="">Pilih Jurusan</option>
                  <option value="RPL">RPL</option>
                  <option value="TKJ">TKJ</option>
                  <option value="DKV">DKV</option>
                  <option value="BC">BC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 font-sans font-normal text-gray-700">
                  Nomor Barang
                </label>
                <input
                  type="number"
                  name="nomor_barang"
                  value={form.nomor_barang}
                  onChange={handleChange}
                  placeholder="inputkan nomor barang"
                  className="w-full rounded-md bg-[#d9d9d9] px-4 py-2 font-sans text-sm outline-none"
                  min="0"
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2 font-sans font-normal text-gray-700">
                tambahkan?
              </label>
            </div>
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
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-lg shadow-lg px-8 py-12 max-w-md w-full flex flex-col items-center">
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-8 font-sans">
                  Yakin Ingin Menambahkan
                  <br />
                  product ini?
                </h3>
                <div className="flex gap-6 w-full justify-center">
                  <button
                    className="bg-[#1877f2] hover:bg-blue-700 text-white font-bold text-lg rounded-full px-10 py-3 transition-all"
                    onClick={handleYakin}
                  >
                    yakin
                  </button>
                  <button
                    className="bg-[#ff1616] hover:bg-red-700 text-white font-bold text-lg rounded-full px-10 py-3 transition-all"
                    onClick={handleCancel}
                  >
                    belum
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
