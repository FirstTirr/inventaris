"use client";

import AuthGuard from "@/components/AuthGuard";
import NavWasapras from "@/components/wakaSapras/NavWasapras";

export default function Home() {
  return (
    <AuthGuard>
      <NavWasapras />
    </AuthGuard>
  );
}
