"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Canonical post-login landing. The existing logged-in home lives at /lms;
// keep one source of truth by redirecting there for now.
export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/lms");
  }, [router]);
  return null;
}
