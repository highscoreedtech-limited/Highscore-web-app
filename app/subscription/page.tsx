"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, CalendarClock, Receipt, CreditCard, Coins } from "lucide-react";
import { api } from "@/lib/api";

const naira = (n: number) => `₦${(n ?? 0).toLocaleString()}`;
const fmtDate = (s?: string) => (s ? new Date(s).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—");

interface Summary { active: boolean; days_remaining: number; expires_at?: string }
interface Payment { id: number; amount: number; points: number; days: number; kind: string; created_at: string }

export default function SubscriptionPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api<{ summary: Summary; payments: Payment[] }>("/api/payment/history")
      .then((d) => { setSummary(d?.summary ?? null); setPayments(d?.payments ?? []); })
      .catch(() => {}).finally(() => setLoaded(true));
  }, []);

  if (!loaded) return <div className="flex min-h-screen items-center justify-center bg-hs-bg"><span className="h-7 w-7 animate-spin rounded-full border-2 border-hs-blue border-t-transparent" /></div>;

  const days = summary?.days_remaining ?? 0;

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      <header className="bg-hs-navy px-4 pb-8 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => router.push("/dashboard?tab=3")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back"><ArrowLeft size={16} /></button>
          <h1 className="text-lg font-bold text-white">Subscription</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 lg:px-8">
        {/* Summary */}
        <div className="-mt-5 rounded-3xl border border-hs-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            {summary?.active ? <BadgeCheck size={20} className="text-green-600" /> : <CalendarClock size={20} className="text-hs-muted" />}
            <p className="text-sm font-bold text-hs-navy">{summary?.active ? "Full access active" : "No active access"}</p>
          </div>
          <div className="mt-4 flex items-end justify-center gap-2 rounded-2xl bg-hs-bg py-6">
            <span className="text-5xl font-extrabold text-hs-navy">{days}</span>
            <span className="mb-1.5 text-lg font-bold text-hs-muted">day{days === 1 ? "" : "s"} left</span>
          </div>
          <p className="mt-2 text-center text-[12px] text-hs-muted">{summary?.active ? `Access ends ${fmtDate(summary?.expires_at)}` : "Top up to unlock every subject"}</p>
          <button onClick={() => router.push("/dashboard?tab=1")} className="mt-4 w-full rounded-full bg-gradient-to-r from-[#FFC85C] to-[#EF9F27] py-3 text-sm font-bold text-hs-amberDark">
            {summary?.active ? "Top up access" : "Unlock everything"}
          </button>
        </div>

        {/* History */}
        <div className="mt-6 flex items-center gap-2">
          <Receipt size={16} className="text-hs-navy" />
          <h2 className="text-sm font-bold text-hs-navy">Top-up history</h2>
        </div>
        {payments.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-hs-border bg-white p-6 text-center text-sm text-hs-muted">No top-ups yet.</div>
        ) : (
          <div className="mt-3 space-y-2">
            {payments.map((p) => {
              const points = p.kind === "points";
              return (
                <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-hs-border bg-white p-3.5">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${points ? "bg-hs-amberBg text-hs-amberDark" : "bg-hs-blueTint text-hs-blue"}`}>
                    {points ? <Coins size={16} /> : <CreditCard size={16} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-hs-navy">{points ? "Points top-up" : "Cash top-up"} · +{p.days} day{p.days === 1 ? "" : "s"}</p>
                    <p className="text-[11px] text-hs-muted">{fmtDate(p.created_at)}</p>
                  </div>
                  <span className="text-sm font-extrabold text-hs-navy">{points ? `${p.points.toLocaleString()} pts` : naira(p.amount)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
