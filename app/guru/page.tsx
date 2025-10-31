"use client";

import AuthGuard from "@/components/AuthGuard";
import NavGuru from "@/components/guru/NavGuru";
import NoInspect from "@/components/NoInspect";

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavGuru />
    </AuthGuard>
  );
}
