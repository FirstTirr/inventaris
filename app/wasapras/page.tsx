"use client";
import { useEffect, useState } from "react";
import NavWasapras from "@/components/wakaSapras/NavWasapras";

export default function Home() {
  // const [authorized, setAuthorized] = useState(false);
  // useEffect(() => {
  //   const user = localStorage.getItem("user");
  //   if (!user) {
  //     window.location.href = "/";
  //   } else {
  //     setAuthorized(true);
  //   }
  // }, []);
  // if (!authorized) return null;
  return <NavWasapras />;
}
