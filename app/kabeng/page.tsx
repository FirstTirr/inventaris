"use client";

import AuthGuard from "@/components/AuthGuard";
import NavKabeng from "@/components/kabeng/navKabeng";
import NoInspect from "@/components/NoInspect";

export default function Home() {
  return (
    <AuthGuard>
      <NoInspect />
      <NavKabeng />
    </AuthGuard>
  );
}