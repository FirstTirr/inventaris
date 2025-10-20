export async function logoutRemoteUser() {
  await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`, {
    method: "POST",
  });
}
// API untuk menghapus user dari backend
export async function deleteRemoteUser(id_user: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/user/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    throw error;
  }
}
// API untuk mengambil data user dari backend
export async function getRemoteUsers() {
  // If running in a browser, read non-HttpOnly cookies and send as JSON header as a hint.
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined" && document.cookie) {
    headers["X-User-Cookies"] = JSON.stringify(
      document.cookie.split("; ").reduce((acc: Record<string, string>, c) => {
        const [k, ...v] = c.split("=");
        if (k) acc[k] = v.join("=");
        return acc;
      }, {})
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/user`,
    {
      method: "GET",
      headers,
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
}

export async function deleteRemoteProduct(id_perangkat: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/barang/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    throw error;
  }
}

// API khusus untuk ambil data dari database di laptop lain (GET)
export async function getRemoteProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/barang/read`,
    {
      method: "GET",
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
}

// API untuk login user
export async function loginRemoteUser(nama_user: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
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
}
