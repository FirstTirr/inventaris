const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.93.209:8000";
export interface ProductData {
  nama_produk: string;
  labor: string;
  kategori: string;
  jumlah: number;
  jurusan: string;
  status_barang: string;
}

export async function postProduct(data: ProductData) {
  const res = await fetch(BASE_API_URL + "/user/barang", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Gagal mengirim data produk");
  }
  return res.json();
}
