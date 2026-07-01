"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, Lock, Info } from "lucide-react";
import { api } from "@/lib/api";
import { SUBJECTS } from "@/lib/subjects";

type Plan = "weekly" | "monthly";
const PRICE: Record<Plan, number> = { weekly: 650, monthly: 2100 };
const naira = (n: number) => `₦${n.toLocaleString()}`;

interface Access { subject: string; expires_at: string }

export default function SubscribeTab() {
  const [plan, setPlan] = useState<Plan>("monthly");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [access, setAccess] = useState<Access[]>([]);
  const [loading, setLoading] = useState(false);

  // Load the subjects the user already has access to.
  useEffect(() => {
    api<{ subjects: Access[] }>("/api/user/subject-access")
      .then((d) => setAccess(d?.subjects || []))
      .catch(() => {});
  }, []);

  const unlocked = useMemo(() => {
    const m: Record<string, string> = {};
    for (const a of access) m[a.subject] = a.expires_at;
    return m;
  }, [access]);

  const toggle = (name: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const total = picked.size * PRICE[plan];

  const pay = async () => {
    if (picked.size === 0) { toast.error("Pick at least one subject to unlock."); return; }
    setLoading(true);
    try {
      const data = await api<{ authorization_url: string; reference: string }>(
        "/api/payment/initialize",
        { method: "POST", body: { plan, subjects: [...picked] } }
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
          <h1 className="text-xl font-bold text-white">Unlock subjects</h1>
          <p className="mt-1.5 text-sm text-white/70">Pay only for the subjects you need — {naira(PRICE.weekly)}/week or {naira(PRICE.monthly)}/month each.</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-5 lg:px-8">
        {/* Plan toggle */}
        <div className="flex gap-2 rounded-full bg-hs-bg p-1">
          {(["weekly", "monthly"] as Plan[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold capitalize transition ${plan === p ? "bg-hs-blue text-white" : "text-hs-navy"}`}
            >
              {p} · {naira(PRICE[p])}
            </button>
          ))}
        </div>

        <h2 className="mt-6 text-sm font-bold text-hs-navy">Choose subjects</h2>
        <div className="mt-3 space-y-2.5">
          {SUBJECTS.map((s) => {
            const exp = unlocked[s.name];
            const on = picked.has(s.name);
            const color = s.color || "#185FA5";
            return (
              <motion.button
                key={s.name}
                onClick={() => !exp && toggle(s.name)}
                whileTap={{ scale: exp ? 1 : 0.99 }}
                disabled={!!exp}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-3.5 text-left transition-colors ${exp ? "opacity-90" : ""}`}
                style={{ borderColor: on ? color : "#E2E2E2" }}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold"
                  style={{ backgroundColor: `${color}1A`, color }}>
                  {s.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-hs-navy">{s.name}</p>
                  {exp ? (
                    <p className="text-[11px] font-semibold text-green-600">Unlocked · until {new Date(exp).toLocaleDateString()}</p>
                  ) : (
                    <p className="text-[11px] text-hs-muted">{naira(PRICE[plan])} / {plan === "weekly" ? "week" : "month"}</p>
                  )}
                </div>
                {exp ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                    style={{ borderColor: on ? color : "#D1D5DB", backgroundColor: on ? color : "transparent" }}>
                    {on && <Check size={12} className="text-white" />}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-hs-blue/20 bg-hs-blueTint p-3.5">
          <Info size={18} className="mt-0.5 shrink-0 text-hs-blue" />
          <p className="text-xs leading-relaxed text-hs-blue">
            Each subject unlocks its lessons, CBT and quiz for the period you choose. Your streaks, scores and rank are always saved.
          </p>
        </div>
      </div>

      {/* Sticky pay bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-hs-border bg-white px-4 py-3 md:static md:mt-6 md:border-0 md:px-8">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] text-hs-muted">{picked.size} subject{picked.size === 1 ? "" : "s"} · {plan}</p>
            <p className="text-lg font-extrabold text-hs-navy">{naira(total)}</p>
          </div>
          <button
            onClick={pay}
            disabled={loading || picked.size === 0}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-hs-blue px-6 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              : <><Lock size={15} /> Unlock {picked.size > 0 ? `— ${naira(total)}` : "subjects"}</>}
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-hs-muted md:text-left">Powered by Paystack · Secure payment</p>
      </div>
    </div>
  );
}
