"use client";

import AuthGuard from "@/components/AuthGuard";
import NavKabeng from "@/components/kabeng/navKabeng";

export default function Home() {
  return (
    <AuthGuard role="kabeng">
      <NavKabeng />
    </AuthGuard>
  );
}
