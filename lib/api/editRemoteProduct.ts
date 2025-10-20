// API untuk edit produk (PUT)
export async function editRemoteProduct(payload: {
  id_perangkat: number;
  nama_barang: string;
  category: string;
  jurusan: string;
  labor: string;
  jumlah: number;
  status: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/barang/edit`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    }
  );
  if (!res.ok) {
    throw new Error("Gagal mengedit data produk");
  }
  return await res.json();
}
