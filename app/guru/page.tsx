"use client";

import AuthGuard from "@/components/AuthGuard";
import NavKaprog from "@/components/kaprog/NavKaprog";
export default function Home() {
  return (
    <AuthGuard>
      <NavKaprog />
    </AuthGuard>
  );
}
