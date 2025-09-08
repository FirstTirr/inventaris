import { deleteRemoteUser } from "@/lib/api/remoteProductApi";
import React, { useEffect, useState } from "react";
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

export default function MemantauAkun({
  onAddAkun,
}: {
  onAddAkun?: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fungsi hapus user
  const handleDeleteUser = async (id_user: number) => {
    if (!window.confirm("Yakin ingin menghapus akun ini?")) return;
    try {
      await deleteRemoteUser(id_user);
      setUsers((prev) => prev.filter((u) => u.id_user !== id_user));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus akun");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const cookiesObj = getAllCookiesAsObject();
        const headers: Record<string, string> = {};
        if (Object.keys(cookiesObj).length > 0) {
          headers["X-User-Cookies"] = JSON.stringify(cookiesObj);
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user`,
          {
            method: "GET",
            headers,
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil data user dari remote");
        const data = await res.json();
        setUsers(Array.isArray(data.data) ? data.data : []);
        // cookies removed
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Gagal mengambil data user");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="min-h-screen bg-[#f7f7f8] py-12">
      <div className="w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-1 -mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-left font-[Montserrat,sans-serif]">
            Monitoring User
          </h1>
          <div className="flex flex-col items-end gap-2">
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow"
              onClick={onAddAkun}
            >
              <UserPlus size={20} /> Tambahkan Akun
            </button>
            {/* Tombol tutup tidak diperlukan di sini, karena tab akan berpindah */}
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
          <table className="w-full rounded-xl overflow-hidden text-xs sm:text-base">
            <thead>
              <tr>
                <th className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-xs sm:text-sm font-[Montserrat,sans-serif]">
                  nama
                </th>
                <th className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-xs sm:text-sm font-[Montserrat,sans-serif]">
                  password
                </th>
                <th className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-xs sm:text-sm font-[Montserrat,sans-serif]">
                  role
                </th>
                <th className="py-2 px-2 sm:px-6 text-left font-normal text-gray-400 text-xs sm:text-sm font-[Montserrat,sans-serif]">
                  action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={idx}>
                  <td className="py-4 sm:py-8 px-2 sm:px-6 text-left text-base sm:text-2xl font-bold text-black font-[Montserrat,sans-serif] border-b border-gray-300">
                    {user.nama}
                  </td>
                  <td className="py-4 sm:py-8 px-2 sm:px-6 text-left text-base sm:text-2xl font-bold text-black font-[Montserrat,sans-serif] border-b border-gray-300">
                    {user.password}
                  </td>
                  <td className="py-4 sm:py-8 px-2 sm:px-6 text-left text-base sm:text-xl font-semibold text-black font-[Montserrat,sans-serif] border-b border-gray-300">
                    {user.id_role === 0 && "Kabeng"}
                    {user.id_role === 1 && "Guru"}
                    {user.id_role === 2 && "Waka Sarana"}
                    {user.id_role === 3 && "Kepala Sekolah"}
                  </td>
                  <td className="py-4 sm:py-8 px-2 sm:px-6 text-left border-b border-gray-300 align-middle">
                    <button
                      className="hover:text-red-600"
                      onClick={() => handleDeleteUser(user.id_user)}
                    >
                      <Trash2 size={20} className="sm:w-7 sm:h-7" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
