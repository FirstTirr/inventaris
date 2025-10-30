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

export async function createUser({
  nama_user,
  password,
  id_role,
  nama_jurusan,
}: {
  nama_user: string;
  password: string;
  id_role: number;
  nama_jurusan?: string | null;
}) {
  try {
    type CreateUserBody = {
      nama_user: string;
      password: string;
      id_role: number;
      nama_jurusan?: string;
    };
    const body: CreateUserBody = { nama_user, password, id_role };
    if (typeof nama_jurusan !== "undefined" && nama_jurusan !== null)
      body.nama_jurusan = nama_jurusan as string;
    if (typeof window !== "undefined") console.debug("createUser body:", body);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user/new`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
        credentials: "include", // <-- WAJIB AGAR COOKIE TERKIRIM
      }
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(
        error.detail || `Gagal menambah user (status ${res.status})`
      );
    }
    return res.json();
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
}
