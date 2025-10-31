"use client";

import AuthGuard from "@/components/AuthGuard";
import NavRpl from "@/components/barangRpl/NavRpl";
import NoInspect from "@/components/NoInspect";

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavRpl />
    </AuthGuard>
  );
}
