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

export interface ProductData {
  nama_barang: string;
  labor: string;
  category: string;
  jumlah: number;
  jurusan: string;
  status: string;
}

export async function postProduct(data: ProductData) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      throw new Error("Gagal mengirim data produk");
    }
    return res.json();
  } catch (error) {
    console.error("Post product error:", error);
    throw error;
  }
}
