export interface ProductData {
  nama_produk: string;
  labor: string;
  kategori: string;
  jumlah: number;
  jurusan: string;
  status_barang: string;
}

export async function postProduct(data: ProductData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang`,{
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
