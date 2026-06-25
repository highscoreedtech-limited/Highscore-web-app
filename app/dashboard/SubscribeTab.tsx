"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Crown, Check, Info } from "lucide-react";
import { api } from "@/lib/api";

interface Plan {
  index: number; label: string; duration: string; price: string; note: string;
  badge?: string; color: string; bg: string;
}

const PLANS: Plan[] = [
  { index: 0, label: "Free Trial", duration: "2 days (48 hrs)", price: "₦0", note: "One-time per user · No card needed", color: "#6B7280", bg: "#F3F4F6" },
  { index: 1, label: "Weekly", duration: "7 days", price: "₦650", note: "₦93/day · Manual or auto-renew", color: "#185FA5", bg: "#E6F1FB" },
  { index: 2, label: "Monthly", duration: "30 days", price: "₦2,100", note: "₦70/day · Save ₦712 vs weekly", badge: "Best Value", color: "#EF9F27", bg: "#FAEEDA" },
];

const FEATURES = [
  "Access to all 9 subjects",
  "Unlimited CBT practice questions",
  "Real-time multiplayer quiz battles",
  "Detailed performance analytics",
  "Download study materials (PDF & video)",
  "Daily streak rewards & points",
  "JAMB, WAEC, NECO, GCE & Nursing past questions",
  "Live leaderboard ranking",
  "Referral rewards & scholarship access",
];

export default function SubscribeTab() {
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);

  const cta = selected === 0 ? "Start Free Trial — 2 days" : selected === 1 ? "Pay ₦650 — Weekly" : "Pay ₦2,100 — Monthly";
  const ctaColor = selected === 0 ? "#6B7280" : selected === 2 ? "#EF9F27" : "#185FA5";

  const subscribe = async () => {
    if (selected === 0) {
      toast.success("Free trial activated! Enjoy 2 days of full access.");
      return;
    }
    setLoading(true);
    try {
      const plan = selected === 1 ? "weekly" : "monthly";
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
    <div className="pb-6">
      {/* Header */}
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Subscribe</h1>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white">
              <Crown size={14} /> Free Plan
            </span>
          </div>
          <p className="mt-1.5 text-sm text-white/70">Unlock your full learning potential</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-5 lg:px-8">
        <h2 className="text-lg font-extrabold text-hs-navy">Choose your plan</h2>
        <p className="text-sm text-hs-muted">Same features across all plans — no hidden locks.</p>

        {/* Plan tiles */}
        <div className="mt-5 space-y-3">
          {PLANS.map((p) => {
            const on = selected === p.index;
            return (
              <motion.button
                key={p.index}
                onClick={() => setSelected(p.index)}
                whileTap={{ scale: 0.99 }}
                className="flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-colors"
                style={{ borderColor: on ? p.color : "#E2E2E2" }}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold"
                  style={{ backgroundColor: p.bg, color: p.color }}
                >
                  {p.label[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-hs-navy">{p.label}</p>
                    {p.badge && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: p.color }}>{p.badge}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-hs-muted">{p.duration} · {p.note}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-hs-navy">{p.price}</p>
                </div>
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                  style={{ borderColor: on ? p.color : "#D1D5DB", backgroundColor: on ? p.color : "transparent" }}
                >
                  {on && <Check size={12} className="text-white" />}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected === 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-hs-amber/40 bg-hs-amberBg px-3.5 py-2.5">
                <span className="text-base">💰</span>
                <p className="text-xs font-semibold text-hs-amberDark">Monthly saves ₦712 vs paying weekly for a month (₦2,815 → ₦2,100)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* What's included */}
        <h3 className="mt-7 text-base font-bold text-hs-navy">What&apos;s included</h3>
        <p className="text-xs text-hs-muted">All plans unlock the same full experience.</p>
        <ul className="mt-3 space-y-2.5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-hs-body">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hs-blueTint">
                <Check size={12} className="text-hs-blue" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-hs-blue/20 bg-hs-blueTint p-3.5">
          <Info size={18} className="mt-0.5 shrink-0 text-hs-blue" />
          <p className="text-xs leading-relaxed text-hs-blue">
            Your streaks, scores and leaderboard rank are always saved — only new actions lock when your plan expires.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={subscribe}
          disabled={loading}
          className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl text-base font-bold text-white disabled:opacity-60"
          style={{ backgroundColor: ctaColor }}
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            cta
          )}
        </button>
        <p className="mt-3 text-center text-[11px] text-hs-muted">
          Powered by Paystack · Secure payment · No card required for trial
        </p>
      </div>
    </div>
  );
}
