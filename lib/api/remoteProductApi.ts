
  
export async function deleteRemoteProduct(id_perangkat: number) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_perangkat }),
    });

    if (!res.ok) {
      throw new Error(
        `Gagal menghapus data produk. Status: ${res.status}`
      );
    }
    console.log(id_perangkat);

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    console.log(id_perangkat);
    throw error;
  }
}

// API khusus untuk ambil data dari database di laptop lain (GET)
export async function getRemoteProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang/read`, {
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
