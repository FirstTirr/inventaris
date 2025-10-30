"use client";
import React, { useState } from "react";

interface User {
  id_user?: number;
  nama_user: string;
  password?: string | null;
  id_role?: number | null;
  id_jurusan?: number | null;
}
import { useEffect } from "react";
import { createUser } from "@/lib/api/userApi";
import { getRemoteJurusan } from "@/lib/api/remoteProductApi";

export default function AdminPage({ onCancel }: { onCancel?: () => void }) {
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  // Hanya izinkan huruf dan angka
  const [jurusan, setJurusan] = useState("");
  const [jurusanList, setJurusanList] = useState<
    Array<{ id: number; label: string }>
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: unknown) => {
        // normalise response which can be either { data: User[] } or User[]
        const list: User[] = Array.isArray((data as { data?: unknown })?.data)
          ? ((data as { data?: unknown }).data as User[])
          : Array.isArray(data)
          ? (data as User[])
          : [];
        if (Array.isArray(list)) setUsers(list);
      })
      .catch((e) => console.error("fetchUsers error:", e));
  };
  useEffect(() => {
    fetchUsers();
    fetchJurusan();
  }, []);

  async function fetchJurusan() {
    try {
      const res: unknown = await getRemoteJurusan();
      const maybeData = (res as { data?: unknown })?.data;
      const list: unknown[] = Array.isArray(maybeData)
        ? maybeData
        : Array.isArray(res)
        ? (res as unknown[])
        : [];

      const getLabel = (j: unknown, idx: number) => {
        if (j && typeof j === "object") {
          const obj = j as Record<string, unknown>;
          return String(
            obj.jurusan ??
              obj.nama_jurusan ??
              obj.name ??
              obj.label ??
              obj.nama ??
              `Jurusan ${idx + 1}`
          );
        }
        return `Jurusan ${idx + 1}`;
      };

      const normalized = list.map((j, idx) => ({
        id: idx + 1,
        label: getLabel(j, idx),
      }));
      setJurusanList(normalized);
      if (typeof window !== "undefined")
        console.debug("Loaded jurusan:", normalized);
    } catch (e) {
      console.error("Gagal mengambil jurusan:", e);
    }
  }
  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setNama(value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setPassword(value);
  };
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!nama || !password || role === "") {
      setError("Semua field wajib diisi.");
      return;
    }
    // require jurusan (backend expects nama_jurusan in current API)
    if (!jurusan) {
      setError("Pilih jurusan terlebih dahulu.");
      return;
    }
    setLoading(true);
    // Cek apakah nama sudah ada (backend uses nama_user)
    const userExists = users.some((u) => u.nama_user === nama);
    if (userExists) {
      setError("Nama user sudah ada");
      setLoading(false);
      return;
    }
    try {
      const res = await createUser({
        nama_user: nama,
        password,
        id_role: Number(role),
        // backend currently accepts nama_jurusan (number)
        nama_jurusan: String(jurusan),
      });
      setSuccess(res.message || "User berhasil ditambahkan");
      setNama("");
      setPassword("");
      setRole("");
      setJurusan("");
      fetchUsers(); // refetch users agar validasi up-to-date
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Gagal menambah user");
      } else {
        setError("Gagal menambah user");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f8fa] rounded-xl">
      <main className="flex justify-center items-center min-h-[80vh] px-2">
        <div className="w-full max-w-xl bg-white rounded-xl shadow border border-gray-200 p-10 relative">
          {onCancel && (
            <button
              type="button"
              className="absolute top-6 right-6 bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 py-2 rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-2">CRUD AKUN</h2>
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">NAMA :</label>
              <input
                type="text"
                placeholder="NAMA"
                className="border border-gray-300 rounded px-3 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={nama}
                onChange={handleNamaChange}
                pattern="[a-zA-Z0-9]*"
                title="Hanya huruf dan angka"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">PASSWORD:</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan Password"
                  className="border border-gray-300 rounded px-3 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full pr-10"
                  value={password}
                  onChange={handlePasswordChange}
                  pattern="[a-zA-Z0-9]*"
                  title="Hanya huruf dan angka"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Sembunyikan sandi" : "Lihat sandi"
                  }
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-1c0 5.523-4.477 10-10 10S2 16.523 2 11 6.477 1 12 1s10 4.477 10 10z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">ROLE:</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={role}
                onChange={handleRoleChange}
                required
              >
                <option value="" disabled>
                  Pilih Role
                </option>
                <option value="0">KABENG/KAPROG</option>
                <option value="1">GURU</option>
                <option value="2">WAKA SARANA</option>
                <option value="3">KEPALA SEKOLAH</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium">JURUSAN:</label>
                <button
                  type="button"
                  onClick={() => fetchJurusan()}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Refresh
                </button>
              </div>
              <select
                className="border border-gray-300 rounded px-3 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
                required
              >
                <option value="" disabled>
                  Pilih Jurusan
                </option>
                {jurusanList.length === 0 ? (
                  <option key="no-jurusan" value="" disabled>
                    (tidak ada jurusan)
                  </option>
                ) : (
                  jurusanList.map((j, idx) => (
                    // use the jurusan name as the option value so backend receives `nama_jurusan`
                    <option key={`jur-${idx}`} value={j.label}>
                      {j.label}
                    </option>
                  ))
                )}
              </select>
            </div>
            {error && (
              <div className="text-red-600 text-sm font-medium mb-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-sm font-medium mb-2">
                {success}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-[#2d2d2d] text-white rounded py-2 font-medium text-base mt-2 hover:bg-gray-800 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "SAVE"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
