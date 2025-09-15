"use client";

import AuthGuard from "@/components/AuthGuard";
import NavKepsek from "@/components/kepsek/NavKepsek";

export default function Home() {
  return (
    <AuthGuard role="kepsek">
      <NavKepsek />
    </AuthGuard>
  );
}
