"use client";

import AuthGuard from "@/components/AuthGuard";
import NavAdmin from "@/components/admin/navAdmin";

export default function Home() {
  return (
    <AuthGuard role="admin">
      <NavAdmin />
    </AuthGuard>
  );
}
