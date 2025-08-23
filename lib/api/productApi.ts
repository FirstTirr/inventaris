export interface ProductData {
  nama_produk: string;
  labor: string;
  kategori: string;
  jumlah: number;
  jurusan: string;
  nomor_barang: string;
}

export async function postProduct(data: ProductData) {
  const res = await fetch("http://192.168.18.108:8000/barang", {
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
