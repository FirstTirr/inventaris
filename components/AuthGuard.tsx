import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setAllowed(true);
      } else {
        router.replace("/unathorized");
      }
    }
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}
