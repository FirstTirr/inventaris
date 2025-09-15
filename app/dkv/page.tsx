"use client";

import AuthGuard from "@/components/AuthGuard";
import NavDkv from "@/components/barangDkv/NavDkv";

export default function Home() {
  return (
    <AuthGuard role="dkv">
      <NavDkv />
    </AuthGuard>
  );
}
