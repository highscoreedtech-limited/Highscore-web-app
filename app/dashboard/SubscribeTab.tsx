"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Lock, BadgeCheck } from "lucide-react";
import { api } from "@/lib/api";

type Plan = "weekly" | "monthly";
const PRICE: Record<Plan, number> = { weekly: 650, monthly: 2100 };
const naira = (n: number) => `₦${n.toLocaleString()}`;

const PERKS = [
  "Every subject unlocked — no picking and choosing",
  "All video lessons across the curriculum",
  "Full CBT practice on every subject",
  "Quiz battles & leaderboards",
  "Your streaks, scores and rank always saved",
];

export default function SubscribeTab() {
  const [plan, setPlan] = useState<Plan>("monthly");
  const [allAccess, setAllAccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Is the user's all-access subscription currently active?
  useEffect(() => {
    api<{ all_access: boolean; expires_at: string | null }>("/api/user/subject-access")
      .then((d) => { setAllAccess(!!d?.all_access); setExpiresAt(d?.expires_at ?? null); })
      .catch(() => {});
  }, []);

  const pay = async () => {
    setLoading(true);
    try {
      // One payment unlocks ALL subjects for the plan's duration (backend ignores
      // any subject list — access is all-or-nothing per plan).
      const data = await api<{ authorization_url: string; reference: string }>(
        "/api/payment/initialize",
        { method: "POST", body: { plan } }
      );
      localStorage.setItem("hs_pay_ref", data.reference);
      window.location.href = data.authorization_url; // off to Paystack
    } catch (e: any) {
      toast.error(e?.message || "Could not start payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="pb-28 md:pb-6">
      {/* Header */}
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-bold text-white">Unlock everything</h1>
          <p className="mt-1.5 text-sm text-white/70">One plan unlocks <span className="font-semibold text-white">all subjects</span> — lessons, CBT and quiz battles.</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-5 lg:px-8">
        {/* Active subscription banner */}
        {allAccess && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
            <BadgeCheck size={22} className="shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-700">You have full access 🎉</p>
              {expiresAt && <p className="text-[12px] text-green-700/80">Active until {new Date(expiresAt).toLocaleDateString()}. You can extend it below anytime.</p>}
            </div>
          </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-2 gap-3">
          {(["weekly", "monthly"] as Plan[]).map((p) => {
            const on = plan === p;
            const best = p === "monthly";
            return (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`relative flex flex-col items-start rounded-2xl border-2 bg-white p-4 text-left transition ${on ? "border-hs-blue shadow-[0_8px_24px_-10px_rgba(24,95,165,0.5)]" : "border-hs-border"}`}
              >
                {best && (
                  <span className="absolute -top-2 right-3 rounded-full bg-hs-amber px-2 py-0.5 text-[10px] font-extrabold text-hs-amberDark">BEST VALUE</span>
                )}
                <span className="text-xs font-bold uppercase tracking-wide text-hs-muted">{p}</span>
                <span className="mt-1 text-2xl font-extrabold text-hs-navy">{naira(PRICE[p])}</span>
                <span className="text-[11px] text-hs-muted">per {p === "weekly" ? "week" : "month"} · all subjects</span>
                <span className={`mt-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${on ? "border-hs-blue bg-hs-blue" : "border-gray-300"}`}>
                  {on && <Check size={12} className="text-white" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Perks */}
        <div className="mt-5 rounded-2xl border border-hs-border bg-white p-4">
          <p className="text-sm font-bold text-hs-navy">What you get</p>
          <ul className="mt-3 space-y-2.5">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-sm text-hs-body">
                <Check size={16} className="mt-0.5 shrink-0 text-hs-blue" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky pay bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-hs-border bg-white px-4 py-3 md:static md:mt-6 md:border-0 md:px-8">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] text-hs-muted">All subjects · {plan}</p>
            <p className="text-lg font-extrabold text-hs-navy">{naira(PRICE[plan])}</p>
          </div>
          <button
            onClick={pay}
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-hs-blue px-6 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              : <><Lock size={15} /> {allAccess ? "Extend access" : "Unlock all subjects"}</>}
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-hs-muted md:text-left">Powered by Paystack · Secure payment</p>
      </div>
    </div>
  );
}
