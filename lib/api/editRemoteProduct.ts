// Helper function to get authentication headers
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    // Extract token from cookies
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

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
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang/edit`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error("Gagal mengedit data produk");
    }
    return await res.json();
  } catch (error) {
    console.error("Edit product error:", error);
    throw error;
  }
}
