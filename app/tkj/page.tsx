"use client";

import AuthGuard from "@/components/AuthGuard";
import NavTkj from "@/components/barangTkj/NavTkj";

export default function Home() {
  return (
    <AuthGuard>
      <NavTkj />
    </AuthGuard>
  );
}
