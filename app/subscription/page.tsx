"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Clock, Receipt, CreditCard } from "lucide-react";
import { api } from "@/lib/api";

const naira = (n: number) => `₦${(n ?? 0).toLocaleString()}`;
const fmtDate = (s?: string) => (s ? new Date(s).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—");

interface Summary { active: boolean; plan: string; days_remaining: number; expires_at?: string }
interface Payment { id: number; plan: string; amount: number; days: number; created_at: string }

export default function SubscriptionPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api<{ summary: Summary; payments: Payment[] }>("/api/payment/history")
      .then((d) => { setSummary(d?.summary ?? null); setPayments(d?.payments ?? []); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return <div className="flex min-h-screen items-center justify-center bg-hs-bg"><span className="h-7 w-7 animate-spin rounded-full border-2 border-hs-blue border-t-transparent" /></div>;

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
            <BadgeCheck size={20} className={summary?.active ? "text-green-600" : "text-hs-muted"} />
            <p className="text-sm font-bold text-hs-navy">{summary?.active ? "Full access active" : "No active subscription"}</p>
            {summary?.active && summary.plan && <span className="ml-auto rounded-full bg-hs-blueTint px-2.5 py-0.5 text-[11px] font-bold capitalize text-hs-blue">{summary.plan}</span>}
          </div>

          <div className="mt-4 rounded-2xl bg-hs-bg py-6 text-center">
            <p className="text-5xl font-extrabold text-hs-navy">{summary?.days_remaining ?? 0}<span className="ml-1 text-lg font-bold text-hs-muted">day{summary?.days_remaining === 1 ? "" : "s"} left</span></p>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-hs-muted"><Clock size={12} /> {summary?.active ? `Access ends ${fmtDate(summary?.expires_at)}` : "Subscribe to unlock every subject"}</p>
          </div>

          <button onClick={() => router.push("/dashboard?tab=1")} className="mt-4 w-full rounded-full bg-hs-blue py-3 text-sm font-bold text-white">
            {summary?.active ? "Renew subscription" : "Subscribe"}
          </button>
        </div>

        {/* History */}
        <div className="mt-6 flex items-center gap-2">
          <Receipt size={16} className="text-hs-navy" />
          <h2 className="text-sm font-bold text-hs-navy">Payment history</h2>
        </div>
        {payments.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-hs-border bg-white p-6 text-center text-sm text-hs-muted">No payments yet.</div>
        ) : (
          <div className="mt-3 space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-hs-border bg-white p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-hs-blueTint text-hs-blue"><CreditCard size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-hs-navy capitalize">{p.plan} plan · {p.days} days</p>
                  <p className="text-[11px] text-hs-muted">{fmtDate(p.created_at)}</p>
                </div>
                <span className="text-sm font-extrabold text-hs-navy">{naira(p.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
