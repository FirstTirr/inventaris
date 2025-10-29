import { deleteRemoteUser } from "@/lib/api/remoteProductApi";
import React, { useEffect, useState, useCallback } from "react";
import { Trash2, UserPlus } from "lucide-react";

// Fungsi untuk membaca cookie (non-HttpOnly)
function getAllCookiesAsObject() {
  if (typeof document === "undefined") return {};
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const cookieObj: Record<string, string> = {};
  cookies.forEach((c) => {
    const [key, ...v] = c.split("=");
    if (key) cookieObj[key] = v.join("=");
  });
  return cookieObj;
}

type User = {
  id_user: number;
  nama: string;
  password: string;
  id_role: number;
};

interface MemantauAkunProps {
  onAddAkun?: () => void;
}

const MemantauAkun = React.memo(({ onAddAkun }: MemantauAkunProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status detection
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
  const [error, setError] = useState("");

  // Fungsi hapus user
  const handleDeleteUser = useCallback(
    async (id_user: number) => {
      if (!isOnline) {
        alert("Tidak ada koneksi internet");
        return;
      }

      if (!window.confirm("Yakin ingin menghapus akun ini?")) return;
      try {
        await deleteRemoteUser(id_user);
        setUsers((prev) => prev.filter((u) => u.id_user !== id_user));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Gagal menghapus akun");
      }
    },
    [isOnline]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil data user dari remote");
        const data = await res.json();
        setUsers(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Gagal mengambil data user");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const paginatedUsers = users.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(users.length / itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-12">
      <div className="w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-1 -mt-4">
          <h1
            className="text-2xl sm:text-3xl font-bold text-left font-[Montserrat,sans-serif]"
            id="monitoring-user-heading"
          >
            Monitoring User
          </h1>
          <div className="flex flex-col items-end gap-2">
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow"
              onClick={onAddAkun}
              aria-label="Tambah akun baru"
              type="button"
            >
              <UserPlus size={20} aria-hidden="true" /> Tambahkan Akun
            </button>
          </div>
        </div>
        <p className="text-gray-500 text-base font-normal mb-8 text-left font-[Montserrat,sans-serif]">
          view last users
        </p>
        {/* Card Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 rounded-xl p-6 text-white flex flex-col justify-between shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Kabeng</span>
              <span className="text-3xl font-bold">
                {users.filter((u) => u.id_role === 0).length}
              </span>
            </div>
            <div className="flex items-center gap-2 h-13 mt-2">
              <span className="text-sm">TOTAL KABENG/KAPROG </span>
            </div>
          </div>
          <div className="bg-green-500 rounded-xl p-6 text-white flex flex-col justify-between shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Waka Sarana</span>
              <span className="text-3xl font-bold">
                {users.filter((u) => u.id_role === 2).length}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">TOTAL WAKA SARANA</span>
            </div>
          </div>
          <div className="bg-red-500 rounded-xl p-6 text-white flex flex-col justify-between shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Guru</span>
              <span className="text-3xl font-bold">
                {users.filter((u) => u.id_role === 1).length}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">TOTAL GURU</span>
            </div>
          </div>
          <div className="bg-gray-400 rounded-xl p-6 text-white flex flex-col justify-between shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Kepala Sekolah</span>
              <span className="text-3xl font-bold">
                {users.filter((u) => u.id_role === 3).length}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">TOTAL KEPALA SEKOLAH</span>
            </div>
          </div>
        </div>
        <div className="w-full overflow-x-auto rounded-2xl bg-white shadow p-4 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor="itemsPerPage"
                className="text-gray-600 text-sm font-medium"
              >
                Show{" "}
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                {[10, 20, 30, 40, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-gray-600 text-sm font-medium">
                {" "}
                entries
              </span>
            </div>
            <div className="text-gray-500 text-xs md:text-sm">
              Showing {paginatedUsers.length} of {users.length} entries
            </div>
          </div>
          <table
            className="w-full rounded-xl overflow-hidden text-sm md:text-base"
            aria-labelledby="monitoring-user-heading"
            role="table"
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-sm md:text-base font-[Montserrat,sans-serif]"
                >
                  nama
                </th>
                <th
                  scope="col"
                  className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-sm md:text-base font-[Montserrat,sans-serif]"
                >
                  password
                </th>
                <th
                  scope="col"
                  className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-sm md:text-base font-[Montserrat,sans-serif]"
                >
                  role
                </th>
                <th
                  scope="col"
                  className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-sm md:text-base font-[Montserrat,sans-serif]"
                >
                  action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, idx) => (
                <tr key={idx}>
                  <td className="py-2 md:py-3 px-2 sm:px-6 text-left text-sm md:text-base font-normal text-black font-[Montserrat,sans-serif] border-b border-gray-300">
                    {user.nama}
                  </td>
                  <td className="py-2 md:py-3 px-2 sm:px-6 text-left text-sm md:text-base font-normal text-black font-[Montserrat,sans-serif] border-b border-gray-300">
                    {user.password}
                  </td>
                  <td className="py-2 md:py-3 px-2 sm:px-6 text-left text-sm md:text-base font-normal text-black font-[Montserrat,sans-serif] border-b border-gray-300">
                    {user.id_role === 0 && "Kabeng"}
                    {user.id_role === 1 && "Guru"}
                    {user.id_role === 2 && "Waka Sarana"}
                    {user.id_role === 3 && "Kepala Sekolah"}
                  </td>
                  <td className="py-4 sm:py-8 px-2 sm:px-6 text-left border-b border-gray-300 align-middle">
                    <button
                      className="hover:text-red-600"
                      onClick={() => handleDeleteUser(user.id_user)}
                      aria-label={`Hapus akun ${user.nama}`}
                      type="button"
                    >
                      <Trash2
                        size={20}
                        className="sm:w-7 sm:h-7"
                        aria-hidden="true"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-white border rounded text-sm text-gray-700 disabled:bg-gray-200"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded text-sm ${
                    page === p
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-white border rounded text-sm text-gray-700 disabled:bg-gray-200"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MemantauAkun.displayName = "MemantauAkun";

export default MemantauAkun;
