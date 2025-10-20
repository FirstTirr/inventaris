"use client";
import { useEffect } from "react";

export default function ResourcePreloader() {
  useEffect(() => {
    // Preload critical API endpoints
    const criticalEndpoints = [
      `https://in${process.env.NEXT_PUBLIC_API_BASE_URL}v.tefa-bcs.org/api/admin/kelas`,
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/labor`,
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/barang/read`,
    ];

    // Preload critical resources
    criticalEndpoints.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = url;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const fontPreload = document.createElement("link");
    fontPreload.rel = "preload";
    fontPreload.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap";
    fontPreload.as = "style";
    document.head.appendChild(fontPreload);
  }, []);

  return null;
}
