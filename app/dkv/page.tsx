"use client";
import { useEffect, useState } from "react";
import NavDkv from "@/components/barangDkv/NavDkv";
import Unauthorized from "@/components/unathorized";

export default function Home() {
  const [allow, setAllow] = useState(false);
  useEffect(() => {
    const ref = document.referrer;
    if (
      ref.includes("/admin") ||
      ref.includes("/kabeng") ||
      ref.includes("/wasapras") ||
      ref.includes("/kepsek")
    ) {
      setAllow(true);
    }
  }, []);
  if (!allow) return <Unauthorized />;
  return (
    <>
      <NavDkv />
    </>
  );
}
