"use client";

import AuthGuard from "@/components/AuthGuard";
import NavTkj from "@/components/barangTkj/NavTkj";
import NoInspect from "@/components/NoInspect";

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavTkj />
    </AuthGuard>
  );
}
