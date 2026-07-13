"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Lock, BadgeCheck, Wallet } from "lucide-react";
import { api } from "@/lib/api";

type Plan = "weekly" | "monthly";
// Full price + minimum first (starting) payment, in naira. Must match backend.
const PLANS: Record<Plan, { total: number; start: number; label: string }> = {
  weekly: { total: 1250, start: 600, label: "week" },
  monthly: { total: 5000, start: 2200, label: "month" },
};
const naira = (n: number) => `₦${n.toLocaleString()}`;

const PERKS = [
  "Every subject unlocked — no picking and choosing",
  "All video lessons across the curriculum",
  "Full CBT practice on every subject",
  "Quiz battles & leaderboards",
];

interface Status { all_access: boolean; plan: string; total: number; paid: number; outstanding: number }

export default function SubscribeTab() {
  const [plan, setPlan] = useState<Plan>("monthly");
  const [status, setStatus] = useState<Status | null>(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api<Status>("/api/user/subject-access")
      .then((d) => {
        setStatus(d);
        if (d?.all_access && (d.plan === "weekly" || d.plan === "monthly")) setPlan(d.plan);
      })
      .catch(() => {});
  }, []);

  // Is the SELECTED plan the one currently active (so payments are installments)?
  const activeSame = !!status?.all_access && status.plan === plan;
  const cfg = PLANS[plan];
  const min = activeSame ? 1 : cfg.start;
  const max = activeSame ? status!.outstanding : cfg.total;

  // Default the amount whenever the plan / status changes.
  useEffect(() => { setAmount(activeSame ? Math.max(1, status!.outstanding) : cfg.start); }, [plan, status]); // eslint-disable-line

  const clamped = useMemo(() => Math.min(max, Math.max(min, amount || 0)), [amount, min, max]);
  const fullyPaid = activeSame && status!.outstanding <= 0;

  const pay = async () => {
    if (fullyPaid) { toast.success("This plan is already fully paid 🎉"); return; }
    setLoading(true);
    try {
      const data = await api<{ authorization_url: string; reference: string }>(
        "/api/payment/initialize",
        { method: "POST", body: { plan, amount: clamped } }
      );
      localStorage.setItem("hs_pay_ref", data.reference);
      window.location.href = data.authorization_url;
    } catch (e: any) {
      toast.error(e?.message || "Could not start payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="pb-28 md:pb-6">
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-bold text-white">Unlock everything</h1>
          <p className="mt-1.5 text-sm text-white/70">Pay a little to start, then clear the rest anytime — <span className="font-semibold text-white">all subjects</span> unlock right away.</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-5 lg:px-8">
        {/* Active subscription + outstanding */}
        {status?.all_access && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <BadgeCheck size={22} className="shrink-0 text-green-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-green-700">You have full access 🎉</p>
                <p className="text-[12px] text-green-700/80 capitalize">{status.plan} plan · paid {naira(status.paid)} of {naira(status.total)}</p>
              </div>
            </div>
            {status.outstanding > 0 && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-2.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-hs-amberDark"><Wallet size={14} /> Outstanding balance</span>
                <span className="text-sm font-extrabold text-hs-amberDark">{naira(status.outstanding)}</span>
              </div>
            )}
          </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-2 gap-3">
          {(["weekly", "monthly"] as Plan[]).map((p) => {
            const on = plan === p;
            const best = p === "monthly";
            return (
              <button key={p} onClick={() => setPlan(p)}
                className={`relative flex flex-col items-start rounded-2xl border-2 bg-white p-4 text-left transition ${on ? "border-hs-blue shadow-[0_8px_24px_-10px_rgba(24,95,165,0.5)]" : "border-hs-border"}`}>
                {best && <span className="absolute -top-2 right-3 rounded-full bg-hs-amber px-2 py-0.5 text-[10px] font-extrabold text-hs-amberDark">BEST VALUE</span>}
                <span className="text-xs font-bold uppercase tracking-wide text-hs-muted">{p}</span>
                <span className="mt-1 text-2xl font-extrabold text-hs-navy">{naira(PLANS[p].total)}</span>
                <span className="text-[11px] text-hs-muted">per {PLANS[p].label} · from {naira(PLANS[p].start)} to start</span>
                <span className={`mt-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${on ? "border-hs-blue bg-hs-blue" : "border-gray-300"}`}>{on && <Check size={12} className="text-white" />}</span>
              </button>
            );
          })}
        </div>

        {/* Amount to pay now */}
        {!fullyPaid && (
          <div className="mt-4 rounded-2xl border border-hs-border bg-white p-5">
            <p className="text-sm font-bold text-hs-navy">{activeSame ? "Pay off your balance" : "How much to pay now?"}</p>
            <p className="mt-1 text-xs text-hs-muted">
              {activeSame
                ? `Any amount up to your ${naira(status!.outstanding)} outstanding.`
                : `At least ${naira(cfg.start)} to start · full price ${naira(cfg.total)}.`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {!activeSame && <button onClick={() => setAmount(cfg.start)} className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${clamped === cfg.start ? "bg-hs-blue text-white" : "border border-hs-border text-hs-navy"}`}>Start · {naira(cfg.start)}</button>}
              <button onClick={() => setAmount(max)} className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${clamped === max ? "bg-hs-blue text-white" : "border border-hs-border text-hs-navy"}`}>{activeSame ? "Clear balance" : "Pay full"} · {naira(max)}</button>
              <div className="flex items-center rounded-full border border-hs-border px-3">
                <span className="text-sm font-bold text-hs-muted">₦</span>
                <input type="number" min={min} max={max} value={amount || ""} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="w-24 py-1.5 text-sm font-bold text-hs-navy outline-none" />
              </div>
            </div>
            {amount > 0 && (clamped !== amount) && <p className="mt-2 text-[11px] text-hs-amberDark">Adjusted to {naira(clamped)} (min {naira(min)}, max {naira(max)}).</p>}
          </div>
        )}

        {/* Perks */}
        <div className="mt-4 rounded-2xl border border-hs-border bg-white p-4">
          <p className="text-sm font-bold text-hs-navy">What you get</p>
          <ul className="mt-3 space-y-2.5">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-sm text-hs-body"><Check size={16} className="mt-0.5 shrink-0 text-hs-blue" /><span>{perk}</span></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky pay bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-hs-border bg-white px-4 py-3 md:static md:mt-6 md:border-0 md:px-8">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] text-hs-muted capitalize">{plan} · {activeSame ? "installment" : "starts access"}</p>
            <p className="text-lg font-extrabold text-hs-navy">{fullyPaid ? "Fully paid" : naira(clamped)}</p>
          </div>
          <button onClick={pay} disabled={loading || fullyPaid} className="flex h-12 items-center justify-center gap-2 rounded-full bg-hs-blue px-6 text-sm font-bold text-white disabled:opacity-50">
            {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Lock size={15} /> {fullyPaid ? "Paid up" : activeSame ? "Pay balance" : "Pay & unlock"}</>}
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-hs-muted md:text-left">Powered by Paystack · Secure payment</p>
      </div>
    </div>
  );
}
