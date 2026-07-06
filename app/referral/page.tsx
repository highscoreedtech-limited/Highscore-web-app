"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Share2, Users, Coins, Lock, ChevronRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { referralApi } from "@/lib/api";
import type { TopReferrer } from "@/lib/services/referral.service";
import Asset3D from "@/components/Asset3D";

const STEPS = [
  { n: 1, title: "Share your code", desc: "Send your code to friends via WhatsApp, social media, or wherever." },
  { n: 2, title: "Friend signs up", desc: "Your friend creates an account and enters your referral code." },
  { n: 3, title: "You both earn", desc: "When they verify their email, you both get 100 points instantly." },
];

const TIERS = [
  { n: 1, pts: 10 }, { n: 5, pts: 250 }, { n: 10, pts: 500 },
  { n: 25, pts: 1000 }, { n: 50, pts: 2500 },
];

function MilestoneRail({ referrals }: { referrals: number }) {
  const nextIdx = TIERS.findIndex((t) => referrals < t.n);
  const next = nextIdx === -1 ? null : TIERS[nextIdx];
  const remaining = next ? next.n - referrals : 0;

  return (
    <div className="mt-4 rounded-3xl border border-hs-border bg-[#F3F7FF] p-5 shadow-[0_18px_40px_-16px_rgba(15,40,80,0.18)]">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-extrabold text-hs-navy">Next Milestone Reward</p>
          <p className="mt-1 text-xs text-hs-muted">
            {next
              ? `Refer ${remaining} more friend${remaining === 1 ? "" : "s"} to unlock ${next.pts} pts bonus!`
              : "All milestones unlocked. Legend! 👑"}
          </p>
        </div>
        <Asset3D name="gift_purple" fallback="🎁" size={56} float={false} />
      </div>

      <div className="mt-4 flex items-start">
        {TIERS.map((t, i) => {
          const done = referrals >= t.n;
          const isNext = !!next && t.n === next.n;
          return (
            <Fragment key={t.n}>
              {i > 0 && (
                <div className={`mt-[18px] h-[3px] flex-1 ${referrals >= t.n ? "bg-green-500" : "bg-[#D9E2F0]"}`} />
              )}
              <div className="flex w-10 flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${done ? "bg-green-500" : isNext ? "bg-hs-blue" : "bg-[#E6ECF6]"}`}>
                  {done ? <Check size={16} className="text-white" /> : isNext ? <Users size={15} className="text-white" /> : <Lock size={14} className="text-[#9AA8BF]" />}
                </div>
                <span className={`mt-1 text-[11px] font-extrabold ${done || isNext ? "text-hs-navy" : "text-hs-muted"}`}>{t.n}</span>
                <span className="text-[9px] text-hs-muted">{t.pts} pts</span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function ReferralPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    code: user?.referral_code || "------",
    referral_count: user?.referral_count ?? 0,
    referral_points: user?.referral_points ?? 0,
  });
  const code = stats.code;
  const count = stats.referral_count;
  const points = stats.referral_points;
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState("https://highscoreedtech.com");
  const [leaders, setLeaders] = useState<TopReferrer[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
    let active = true;
    referralApi.get().then((s) => { if (active) setStats(s); }).catch(() => {});
    referralApi.leaderboard().then((l) => { if (active) setLeaders(l); }).catch(() => {});
    return () => { active = false; };
  }, []);

  // Shareable invite link, pre-fills the referral code at signup.
  const link = `${origin}/signup?ref=${encodeURIComponent(code)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error("Couldn't copy."); }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    } catch { toast.error("Couldn't copy."); }
  };

  const share = async () => {
    const msg = `Join me on HighScore and ace your exams! 🎓 Sign up with my link, we both earn 100 points:\n${link}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Join HighScore", text: msg, url: link }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(msg);
      toast.success("Invite message copied!");
    }
  };

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      <header className="bg-hs-navy px-4 pb-10 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-bold text-white">Refer &amp; Earn</h1>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold leading-tight text-white">
                Invite <span className="text-hs-amber">friends</span>,<br />earn <span className="text-hs-amber">free points!</span>
              </h2>
              <p className="mt-2 text-sm text-[#B8CCE0]">
                Share your code — when a friend signs up and verifies, you both earn{" "}
                <span className="font-bold text-hs-amber">100 pts</span>.
              </p>
            </div>
            {/* 3D hero — drops in /public/3d/gift.png when available. */}
            <Asset3D name="gift" fallback="🎁" size={112} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 lg:px-8">
        {/* Code card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="-mt-6 rounded-3xl border border-hs-border bg-white p-5 shadow-[0_18px_40px_-12px_rgba(15,40,80,0.20)]">
          <p className="text-center text-[11px] font-bold uppercase tracking-wide text-hs-muted">Your referral code</p>
          <div className="mt-2 rounded-2xl border-2 border-dashed border-hs-blue/30 bg-hs-blueTint/40 py-3">
            <p className="text-center text-3xl font-extrabold tracking-[0.25em] text-hs-blue">{code}</p>
          </div>
          <div className="mt-4 flex gap-2.5">
            <button onClick={copy} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${copied ? "border-green-500 bg-green-50 text-green-600" : "border-hs-border bg-white text-hs-navy hover:bg-hs-bg"}`}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy code"}
            </button>
            <button onClick={share} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2F6BFF] to-[#1D4ED8] py-3 text-sm font-semibold text-white shadow-[0_10px_22px_-6px_rgba(29,78,216,0.6)] transition hover:brightness-110">
              <Share2 size={16} /> Share Now
            </button>
          </div>

          {/* Invite link */}
          <div className="mt-4 border-t border-hs-border pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-hs-muted">Your invite link</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 truncate rounded-xl bg-hs-bg px-3 py-2.5 text-xs text-hs-navy">{link}</div>
              <button onClick={copyLink} className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold ${copiedLink ? "bg-green-50 text-green-600" : "bg-hs-blueTint text-hs-blue"}`}>
                {copiedLink ? <Check size={14} /> : <Copy size={14} />} {copiedLink ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-hs-muted">Friends who sign up with your link get the code filled in automatically.</p>
          </div>
        </motion.div>

        {/* Stats, referral points live here now */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-hs-border bg-white p-4">
            <Users size={20} className="text-hs-blue" />
            <p className="mt-2 text-2xl font-extrabold text-hs-navy">{count}</p>
            <p className="text-xs text-hs-muted">Friends referred</p>
          </div>
          <div className="rounded-2xl border border-hs-border bg-white p-4">
            <Coins size={20} className="text-hs-amber" />
            <p className="mt-2 text-2xl font-extrabold text-hs-amber">{points} pts</p>
            <p className="text-xs text-hs-muted">Points earned</p>
          </div>
        </div>

        {/* Next milestone reward rail */}
        <MilestoneRail referrals={count} />

        {/* How it works */}
        <p className="mt-6 text-sm font-bold text-hs-navy">How it works</p>
        <div className="mt-3 space-y-3">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-3 rounded-2xl border border-hs-border bg-white p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-hs-blueTint text-sm font-extrabold text-hs-blue">{s.n}</span>
              <div>
                <p className="text-sm font-bold text-hs-navy">{s.title}</p>
                <p className="text-xs text-hs-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Top referrers */}
        {leaders.length > 0 && (
          <div className="mt-4 rounded-3xl border border-hs-border bg-[#FFF9EC] p-4 shadow-[0_18px_40px_-16px_rgba(80,60,15,0.15)]">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-sm font-extrabold text-hs-navy">🏆 Top Referrers</p>
              <button onClick={() => router.push("/leaderboard")} className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-hs-navy shadow-sm">
                View Leaderboard <ChevronRight size={13} />
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {leaders.slice(0, 3).map((l, i) => {
                const medal = ["🥇", "🥈", "🥉"][i] ?? `${i + 1}`;
                const nm = `${l.first_name ?? ""} ${(l.last_name ?? "").charAt(0)}${l.last_name ? "." : ""}`.trim() || "Student";
                return (
                  <div key={l.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5">
                    <span className="w-5 text-center text-base">{medal}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: l.avatar_color || "#2563EB" }}>
                      {(l.first_name || "?").charAt(0).toUpperCase()}
                    </span>
                    <span className="flex-1 truncate text-sm font-semibold text-hs-navy">{nm}</span>
                    <span className="text-xs font-bold text-hs-blue">{l.referral_count} referrals</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-4 flex items-center gap-1.5 text-center text-[11px] text-hs-muted">
          <span>ℹ️</span> Points never expire. Keep inviting and keep earning!
        </p>
      </div>
    </div>
  );
}
