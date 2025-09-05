"use client";
import { useEffect, useState } from "react";
import NavAdmin from "@/components/admin/navAdmin";

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
  return (
    <>
      <NavAdmin />
    </>
  );
}
