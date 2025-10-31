"use client";

import AuthGuard from "@/components/AuthGuard";
import NavDkv from "@/components/barangDkv/NavDkv";
import NoInspect from "@/components/NoInspect";

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavDkv />
    </AuthGuard>
  );
}
