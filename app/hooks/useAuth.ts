// hooks/useAuth.ts
// Backed by the Go backend now (see lib/providers/AuthProvider).
// Re-exported here so existing `../hooks/useAuth` imports keep working.
"use client";
export { useAuth } from "@/lib/providers/AuthProvider";
export type { User } from "@/lib/api";
