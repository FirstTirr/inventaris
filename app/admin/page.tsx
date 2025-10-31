"use client";

import AuthGuard from "@/components/AuthGuard";
import NavAdmin from "@/components/admin/navAdmin";
import NoInspect from "@/components/NoInspect";

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavAdmin />
    </AuthGuard>
  );
}
