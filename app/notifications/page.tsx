"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";
import { api } from "@/lib/api";

interface AppNotification { id: number; type: string; title: string; body: string; read: boolean; created_at: string }

const NOTIF_ICON: Record<string, string> = { referral: "🎉", unlock: "🔓", challenge: "⚔️", system: "🔔" };

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ notifications: AppNotification[] }>("/api/notifications")
      .then((d) => setItems(d?.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
    api("/api/notifications/read", { method: "POST" }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-hs-bg">
      <header className="bg-hs-navy px-4 pb-5 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold text-white">Notifications</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-5 lg:px-8">
        {loading ? (
          <p className="py-16 text-center text-sm text-hs-muted">Loading…</p>
        ) : items.length === 0 ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-hs-blueTint">
              <Bell size={28} className="text-hs-blue" />
            </span>
            <p className="mt-4 text-base font-bold text-hs-navy">No notifications yet</p>
            <p className="mt-1 max-w-xs text-sm text-hs-muted">
              Earn points, keep your streak and refer friends. Your updates will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((n) => (
              <div key={n.id} className={`flex gap-3 rounded-2xl border border-hs-border p-4 ${n.read ? "bg-white" : "bg-hs-blueTint"}`}>
                <span className="text-xl">{NOTIF_ICON[n.type] || "🔔"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-hs-navy">{n.title}</p>
                  <p className="text-[13px] leading-snug text-hs-muted">{n.body}</p>
                  <p className="mt-1 text-[11px] text-hs-placeholder">{timeAgo(n.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
