"use client";

import AuthGuard from "@/components/AuthGuard";
import NavBc from "@/components/barangBc/NavBc";

export default function Home() {
  return (
    <AuthGuard role="bc">
      <NavBc />
    </AuthGuard>
  );
}
