"use client";

import AuthGuard from "@/components/AuthGuard";
import Product from "@/components/kabeng/product";
import { useParams } from "next/navigation";

export default function ProductJurusanPage() {
  const params = useParams<{ jurusan: string }>();
  const jurusan = decodeURIComponent(params?.jurusan || "").toUpperCase();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f7f7f8]">
        <Product
          forcedJurusan={jurusan}
          hideStats={true}
          onlyStats={false}
          showControls={true}
        />
      </div>
    </AuthGuard>
  );
}
