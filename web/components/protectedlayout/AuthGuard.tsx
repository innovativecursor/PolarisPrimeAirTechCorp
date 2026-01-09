"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const publicRoutes = ["/"];

  useEffect(() => {
    if (publicRoutes.includes(pathname)) {
      setReady(true);
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/");
    } else {
      setReady(true);
    }
  }, [pathname]);

  if (!ready) return null;

  return <>{children}</>;
}
