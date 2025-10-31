"use client";

import AuthGuard from "@/components/AuthGuard";
import NoInspect from "@/components/NoInspect";
import NavWasapras from "@/components/wakaSapras/NavWasapras";

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavWasapras />
    </AuthGuard>
  );
}
