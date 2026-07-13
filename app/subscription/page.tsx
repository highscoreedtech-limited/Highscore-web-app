"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Wallet, Receipt, CreditCard } from "lucide-react";
import { api } from "@/lib/api";

const naira = (n: number) => `₦${(n ?? 0).toLocaleString()}`;
const fmtDate = (s?: string) => (s ? new Date(s).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—");

interface Summary { active: boolean; plan: string; total: number; paid: number; outstanding: number; expires_at?: string }
interface Payment { id: number; plan: string; amount: number; kind: string; reference: string; created_at: string }

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

  const pct = summary && summary.total > 0 ? Math.min(1, summary.paid / summary.total) : 0;

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheck size={20} className={summary?.active ? "text-green-600" : "text-hs-muted"} />
              <p className="text-sm font-bold text-hs-navy">{summary?.active ? "Active subscription" : "No active subscription"}</p>
            </div>
            {summary?.plan && <span className="rounded-full bg-hs-blueTint px-2.5 py-0.5 text-[11px] font-bold capitalize text-hs-blue">{summary.plan}</span>}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-end justify-between text-[12px]">
              <span className="font-bold text-hs-navy">{naira(summary?.paid ?? 0)} paid</span>
              <span className="text-hs-muted">of {naira(summary?.total ?? 0)}</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-hs-border">
              <div className="h-full rounded-full bg-hs-blue transition-[width] duration-500" style={{ width: `${pct * 100}%` }} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-hs-bg p-3">
              <p className="flex items-center gap-1 text-[11px] text-hs-muted"><Wallet size={12} /> Outstanding balance</p>
              <p className={`mt-0.5 text-xl font-extrabold ${(summary?.outstanding ?? 0) > 0 ? "text-hs-amberDark" : "text-green-600"}`}>{naira(summary?.outstanding ?? 0)}</p>
            </div>
            <div className="rounded-xl bg-hs-bg p-3">
              <p className="text-[11px] text-hs-muted">Access expires</p>
              <p className="mt-0.5 text-sm font-bold text-hs-navy">{summary?.active ? fmtDate(summary?.expires_at) : "—"}</p>
            </div>
          </div>

          {(summary?.outstanding ?? 0) > 0 && (
            <button onClick={() => router.push("/dashboard?tab=1")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFC85C] to-[#EF9F27] py-3 text-sm font-bold text-hs-amberDark">
              <CreditCard size={16} /> Pay outstanding balance
            </button>
          )}
          {!summary?.active && (
            <button onClick={() => router.push("/dashboard?tab=1")} className="mt-4 w-full rounded-full bg-hs-blue py-3 text-sm font-bold text-white">Subscribe</button>
          )}
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
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${p.kind === "start" ? "bg-hs-blueTint text-hs-blue" : "bg-green-50 text-green-600"}`}>
                  <CreditCard size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-hs-navy capitalize">{p.kind === "start" ? "Initial payment" : "Installment"} · {p.plan}</p>
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
