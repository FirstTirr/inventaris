"use client";

import AuthGuard from "@/components/AuthGuard";
import NoInspect from "@/components/NoInspect";
import NavAdmin from "@/components/admin/navAdmin";
// NoInspect was intentionally removed from this page for now to avoid
// injecting the detection overlay. If you want it enabled, re-add the
// component in the JSX below.

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavAdmin />
    </AuthGuard>
  );
}
