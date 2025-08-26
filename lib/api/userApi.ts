export async function createUser({
  nama_user,
  password,
  id_role,
}: {
  nama_user: string;
  password: string;
  id_role: number;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/new/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nama_user, password, id_role }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Gagal menambah user");
  }
  return res.json();
}
