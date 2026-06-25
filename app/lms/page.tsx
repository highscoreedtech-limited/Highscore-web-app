"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The old v0 LMS dashboard is retired — the real app home lives at /dashboard.
export default function LmsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return null;
}
