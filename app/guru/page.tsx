"use client";

import AuthGuard from "@/components/AuthGuard";
import NavGuru from "@/components/guru/NavGuru";

export default function Home() {
  return (
    <AuthGuard role="guru">
      <NavGuru />
    </AuthGuard>
  );
}
