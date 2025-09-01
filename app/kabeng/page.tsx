"use client";
import { useEffect } from "react";
import Nav from "@/components/kabeng/Nav";
import Unauthorized from "@/components/unathorized";
import { useState } from "react";

export default function Home() {
  // const [authorized, setAuthorized] = useState(false);
  // useEffect(() => {
  //   // Ganti 'user' sesuai key yang Anda simpan di localStorage saat login
  //   const user = localStorage.getItem("user");
  //   if (!user) {
  //     window.location.href = "/";
  //   } else {
  //     setAuthorized(true);
  //   }
  // }, []);
  // if (!authorized) return null;
  return <Nav />;
}
