"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Lock, BadgeCheck, CalendarClock, Coins, Zap } from "lucide-react";
import { api } from "@/lib/api";

const naira = (n: number) => `₦${n.toLocaleString()}`;

const PERKS = [
  "Every subject unlocked — no picking and choosing",
  "All video lessons across the curriculum",
  "Full CBT practice on every subject",
  "Quiz battles & leaderboards",
];

interface Status {
  all_access: boolean;
  days_remaining: number;
  points_balance: number;
  points_per_day: number;
  naira_per_month: number;
  month_days: number;
  min_naira: number;
}

const CASH_PRESETS = [600, 1250, 2200, 5000];
const DAY_BUNDLES = [1, 3, 7, 14];

export default function SubscribeTab() {
  const [s, setS] = useState<Status | null>(null);
  const [amount, setAmount] = useState(2200);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(0);

  const load = () => api<Status>("/api/user/subject-access").then(setS).catch(() => {});
  useEffect(() => { load(); }, []);

  const rate = s ? s.naira_per_month / s.month_days : 167;       // ₦/day
  const ppd = s?.points_per_day ?? 300;                          // points/day
  const minNaira = s?.min_naira ?? 600;

  const daysForNaira = (n: number) => Math.floor(n / rate);
  const clamped = Math.max(minNaira, amount || 0);
  const daysBuying = daysForNaira(clamped);

  const payCash = async () => {
    setLoading(true);
    try {
      const data = await api<{ authorization_url: string; reference: string }>(
        "/api/payment/initialize", { method: "POST", body: { amount: clamped } });
      localStorage.setItem("hs_pay_ref", data.reference);
      window.location.href = data.authorization_url;
    } catch (e: any) { toast.error(e?.message || "Could not start payment."); setLoading(false); }
  };

  const redeem = async (days: number) => {
    const points = days * ppd;
    setRedeeming(days);
    try {
      await api("/api/payment/topup-points", { method: "POST", body: { points } });
      toast.success(`${days} day${days === 1 ? "" : "s"} of access added! 🎯`);
      await load();
    } catch (e: any) { toast.error(e?.message || "Couldn't redeem points."); } finally { setRedeeming(0); }
  };

  const maxDaysFromPoints = useMemo(() => (s ? Math.floor(s.points_balance / ppd) : 0), [s, ppd]);

  return (
    <div className="pb-28 md:pb-6">
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-bold text-white">Unlock everything</h1>
          <p className="mt-1.5 text-sm text-white/70">Pay as you go — top up any amount for <span className="font-semibold text-white">days of full access</span>. No bills, no debt.</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-5 lg:px-8">
        {/* Status */}
        {s?.all_access ? (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
            <BadgeCheck size={22} className="shrink-0 text-green-600" />
            <div><p className="text-sm font-bold text-green-700">Full access active 🎉</p>
              <p className="text-[12px] text-green-700/80">{s.days_remaining} day{s.days_remaining === 1 ? "" : "s"} of access left — top up anytime to extend.</p></div>
          </div>
        ) : (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-hs-border bg-white p-4">
            <CalendarClock size={22} className="shrink-0 text-hs-muted" />
            <p className="text-sm font-semibold text-hs-navy">No active access — top up with cash or points to unlock everything.</p>
          </div>
        )}

        {/* Cash top-up */}
        <div className="rounded-2xl border border-hs-border bg-white p-5">
          <div className="flex items-center gap-2"><Zap size={18} className="text-hs-blue" /><p className="text-sm font-bold text-hs-navy">Top up with cash</p></div>
          <p className="mt-1 text-xs text-hs-muted">≈ {naira(Math.round(rate))} a day · {naira(s?.naira_per_month ?? 5000)} = {s?.month_days ?? 30} days.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CASH_PRESETS.map((p) => (
              <button key={p} onClick={() => setAmount(p)} className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${clamped === p ? "bg-hs-blue text-white" : "border border-hs-border text-hs-navy"}`}>
                {naira(p)} <span className="opacity-70">· {daysForNaira(p)}d</span>
              </button>
            ))}
            <div className="flex items-center rounded-full border border-hs-border px-3">
              <span className="text-sm font-bold text-hs-muted">₦</span>
              <input type="number" min={minNaira} value={amount || ""} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="w-20 py-1.5 text-sm font-bold text-hs-navy outline-none" />
            </div>
          </div>
          <button onClick={payCash} disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-hs-blue py-3 text-sm font-bold text-white disabled:opacity-50">
            {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Lock size={15} /> Pay {naira(clamped)} · get {daysBuying} day{daysBuying === 1 ? "" : "s"}</>}
          </button>
          <p className="mt-2 text-center text-[11px] text-hs-muted">Powered by Paystack · Secure payment</p>
        </div>

        {/* Points top-up */}
        <div className="mt-4 rounded-2xl border border-hs-amber/30 bg-hs-amberBg/40 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Coins size={18} className="text-hs-amberDark" /><p className="text-sm font-bold text-hs-navy">Or use your points</p></div>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-hs-amberDark">{(s?.points_balance ?? 0).toLocaleString()} pts</span>
          </div>
          <p className="mt-1 text-xs text-hs-muted">Turn earned points into access — {ppd} points = 1 day. You can get up to {maxDaysFromPoints} day{maxDaysFromPoints === 1 ? "" : "s"} right now.</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {DAY_BUNDLES.map((d) => {
              const cost = d * ppd;
              const can = (s?.points_balance ?? 0) >= cost;
              return (
                <button key={d} disabled={!can || redeeming > 0} onClick={() => redeem(d)}
                  className={`rounded-xl border-2 p-2.5 text-center ${can ? "border-hs-amber bg-white" : "border-hs-border bg-white opacity-50"}`}>
                  <p className="text-base font-extrabold text-hs-navy">{d}d</p>
                  <p className="text-[10px] font-semibold text-hs-amberDark">{redeeming === d ? "…" : `${cost} pts`}</p>
                </button>
              );
            })}
          </div>
          {maxDaysFromPoints === 0 && <p className="mt-2 text-[11px] text-hs-muted">Earn more points in quizzes, CBT and battles to redeem access.</p>}
        </div>

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
    </div>
  );
}
