"use client";

import AuthGuard from "@/components/AuthGuard";
import NavKepsek from "@/components/kepsek/NavKepsek";
import NoInspect from "@/components/NoInspect";

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavKepsek />
    </AuthGuard>
  );
}
