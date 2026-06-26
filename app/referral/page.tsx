"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Share2, Users, Coins } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { referralApi } from "@/lib/api";
import LottieIcon from "@/components/LottieIcon";

const STEPS = [
  { n: 1, title: "Share your code", desc: "Send your code to friends via WhatsApp, social media, or wherever." },
  { n: 2, title: "Friend signs up", desc: "Your friend creates an account and enters your referral code." },
  { n: 3, title: "You both earn", desc: "When they verify their email, you both get 100 points instantly." },
];

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

  useEffect(() => {
    let active = true;
    referralApi.get().then((s) => { if (active) setStats(s); }).catch(() => {});
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error("Couldn't copy."); }
  };

  const share = async () => {
    const msg = `Join me on HighScore and ace your exams! 🎓 Use my code ${code} when you sign up and we both earn 100 points. https://highscoreedtech.com`;
    if (navigator.share) {
      try { await navigator.share({ title: "Join HighScore", text: msg }); } catch { /* cancelled */ }
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
            <h1 className="text-lg font-bold text-white">Refer & Earn</h1>
            <div className="ml-auto h-16 w-16"><LottieIcon src="/lottie/refer-and-earn.json" className="h-16 w-16" fallback={<Users className="text-hs-amber" />} /></div>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white">Invite friends,<br />earn free points!</h2>
          <p className="mt-2 text-sm text-[#B8CCE0]">Share your code — when a friend signs up and verifies, you both earn 100 pts.</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 lg:px-8">
        {/* Code card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="-mt-6 rounded-2xl border border-hs-border bg-white p-5 shadow-sm">
          <p className="text-center text-[11px] font-bold uppercase tracking-wide text-hs-muted">Your referral code</p>
          <p className="mt-2 text-center text-3xl font-extrabold tracking-[0.2em] text-hs-navy">{code}</p>
          <div className="mt-4 flex gap-2.5">
            <button onClick={copy} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold ${copied ? "border-green-500 bg-green-50 text-green-600" : "border-hs-border bg-white text-hs-navy"}`}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy code"}
            </button>
            <button onClick={share} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-hs-blue py-3 text-sm font-semibold text-white">
              <Share2 size={16} /> Share
            </button>
          </div>
        </motion.div>

        {/* Stats — referral points live here now */}
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
      </div>
    </div>
  );
}
