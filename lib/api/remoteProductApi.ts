const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.93.209:8000";
export async function deleteRemoteProduct(id_perangkat: number) {
  try {
    const response = await fetch(BASE_API_URL + "/user/barang/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_perangkat }),
    });

    if (!response.ok) {
      throw new Error(
        `Gagal menghapus data produk. Status: ${response.status}`
      );
    }
    console.log(id_perangkat);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    console.log(id_perangkat);
    throw error;
  }
}

// API khusus untuk ambil data dari database di laptop lain (GET)
export async function getRemoteProducts() {
  const res = await fetch(BASE_API_URL + "/user/barang/read", {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Gagal mengambil data produk dari remote");
  }
  const json = await res.json();
  // Jika backend sudah mengembalikan { data: [...] }, langsung return
  if (json && Array.isArray(json.data)) {
    return json;
  }
  // Jika backend mengembalikan array langsung, bungkus ke dalam { data: [...] }
  if (Array.isArray(json)) {
    return { data: json };
  }
  // Jika format tidak sesuai, return data kosong
  return { data: [] };
}
