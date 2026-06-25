"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const TOGGLES = [
  { key: "notif_streak", title: "Streak reminders", subtitle: "Daily reminder to keep your streak alive", def: true },
  { key: "notif_quiz", title: "Quiz results", subtitle: "Notified when your quiz is graded", def: true },
  { key: "notif_battle", title: "Battle invites", subtitle: "When someone challenges you to a quiz battle", def: true },
  { key: "notif_weekly", title: "Weekly performance report", subtitle: "Summary of your scores every Sunday", def: true },
  { key: "notif_news", title: "Exam news & updates", subtitle: "JAMB, WAEC, NECO announcements", def: true },
  { key: "notif_promo", title: "Promotions & offers", subtitle: "Subscription deals and special offers", def: false },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [state, setState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const s: Record<string, boolean> = {};
    for (const t of TOGGLES) {
      const v = localStorage.getItem(t.key);
      s[t.key] = v === null ? t.def : v === "1";
    }
    setState(s);
  }, []);

  const toggle = (key: string) => {
    setState((s) => { const nv = !s[key]; localStorage.setItem(key, nv ? "1" : "0"); return { ...s, [key]: nv }; });
  };

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back"><ArrowLeft size={16} /></button>
          <h1 className="text-lg font-bold text-white">Notifications</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-5 lg:px-8">
        <div className="divide-y divide-hs-border overflow-hidden rounded-2xl border border-hs-border bg-white">
          {TOGGLES.map((t) => (
            <div key={t.key} className="flex items-center gap-3 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-hs-navy">{t.title}</p>
                <p className="text-[11px] text-hs-muted">{t.subtitle}</p>
              </div>
              <button
                onClick={() => toggle(t.key)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${state[t.key] ? "bg-hs-blue" : "bg-hs-border"}`}
                role="switch"
                aria-checked={!!state[t.key]}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${state[t.key] ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 px-1 text-[11px] text-hs-muted">Notification preferences are saved on this device. Delivery depends on your browser/device settings.</p>
      </div>
    </div>
  );
}
