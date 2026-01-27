"use client";

import AuthGuard from "@/components/AuthGuard";
import NoInspect from "@/components/NoInspect";
import NavAdmin from "@/components/admin/navAdmin";

export default function Home() {
  return (
    // <AuthGuard>
    //   <NoInspect />
      <NavAdmin />
    // </AuthGuard>
  );
}
