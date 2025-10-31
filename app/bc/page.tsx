"use client";

import AuthGuard from "@/components/AuthGuard";
import NavBc from "@/components/barangBc/NavBc";
import NoInspect from "@/components/NoInspect";

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavBc />
    </AuthGuard>
  );
}
