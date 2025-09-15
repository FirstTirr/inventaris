"use client";

import AuthGuard from "@/components/AuthGuard";
import NavRpl from "@/components/barangRpl/NavRpl";

export default function Home() {
  return (
    <AuthGuard role="rpl">
      <NavRpl />
    </AuthGuard>
  );
}
