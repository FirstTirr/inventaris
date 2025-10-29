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

export async function logoutRemoteUser() {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}
// API untuk menghapus user dari backend
export async function deleteRemoteUser(id_user: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user/delete`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ id_user }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gagal menghapus user. Status: ${res.status}`);
    }
    console.log(id_user);

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    console.log(id_user);
    return { data: [] };
  }
}
// API untuk mengambil data user dari backend
export async function getRemoteUsers() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Gagal mengambil data user dari remote");
    }

    const json = await res.json();
    if (json && Array.isArray(json.data)) {
      return json;
    }
    if (Array.isArray(json)) {
      return { data: json };
    }
    return { data: [] };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: [] };
  }
}

export async function deleteRemoteProduct(id_perangkat: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/barang/delete`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ id_perangkat }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gagal menghapus data produk. Status: ${res.status}`);
    }
    console.log(id_perangkat);

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    console.log(id_perangkat);
    return { data: [] };
  }
}

// API khusus untuk ambil data dari database di laptop lain (GET)
export async function getRemoteProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/barang/read`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      }
    );

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
  } catch (error) {
    console.error("Error fetching products:", error);

    // Jika error CORS atau network, coba gunakan data dari localStorage
    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem("product-cache");
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          return { data: parsed };
        } catch (parseError) {
          console.error("Error parsing cached data:", parseError);
        }
      }
    }

    return { data: [] };
  }
}

// API untuk mengambil data jurusan
export async function getRemoteJurusan() {
  console.log(
    "🌐 Calling API:",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`
  );

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jurusan`,
      {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      }
    );

    console.log("📡 API Response status:", res.status, res.statusText);

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    console.log("📦 Raw API response:", json);
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
  } catch (error) {
    console.error("💥 API Error fetching jurusan:", error);
    // Kembalikan data kosong agar UI tidak memakai data dummy
    return { data: [] };
  }
}

// API untuk login user
export async function loginRemoteUser(nama_user: string, password: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_user, password }),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Gagal melakukan login");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}