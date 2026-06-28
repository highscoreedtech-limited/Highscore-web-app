"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Coins, ArrowRightLeft, Sparkles, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { api, dashApi, pointsFromRank, quizApi } from "@/lib/api";
import LottieIcon from "@/components/LottieIcon";
import { stagger, item } from "@/components/Reveal";

type Social = "youtube" | "instagram" | "whatsapp";
interface EarnItem { icon: string; title: string; pts: string; sub: string; auto?: boolean; url?: string; social?: Social; claim?: "week" | "top10" }

const EARN: EarnItem[] = [
  { icon: "⚔️", title: "Win a PVP Battle", pts: "+200", sub: "Beat an opponent — credited automatically when the match ends", auto: true },
  { icon: "🎯", title: "Solo Quiz", pts: "+10", sub: "Each correct answer adds 10 pts automatically", auto: true },
  { icon: "📚", title: "CBT Practice", pts: "+5", sub: "Per correct answer — claim from the result screen", auto: true },
  { icon: "🔥", title: "Daily Streak", pts: "+10", sub: "Come back every day to keep your streak alive", auto: true },
  { icon: "🏆", title: "Week Streak Milestone", pts: "+70", sub: "7 days in a row — claim your special bonus!", claim: "week" },
  { icon: "📈", title: "Reach Top 10 Leaderboard", pts: "+50", sub: "Land in the top 10 this week to claim", claim: "top10" },
  { icon: "💡", title: "Perfect Score (10/10)", pts: "+100", sub: "Get every question right in a quiz", auto: true },
  { icon: "", social: "youtube", title: "Subscribe on YouTube", pts: "+50", sub: "Open the channel, subscribe, then claim", url: "https://www.youtube.com/@HighScore" },
  { icon: "", social: "instagram", title: "Follow on Instagram", pts: "+40", sub: "Follow our page, then claim your points", url: "https://www.instagram.com/highscore" },
  { icon: "", social: "whatsapp", title: "Join WhatsApp community", pts: "+30", sub: "Join the group, then claim your points", url: "https://chat.whatsapp.com" },
];

// Brand glyphs for the social earn tasks.
const SOCIAL: Record<Social, { bg: string; svg: React.ReactNode }> = {
  youtube: {
    bg: "#FF0000",
    svg: <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" /></svg>,
  },
  instagram: {
    bg: "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)",
    svg: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.2" fill="#fff" stroke="none" /></svg>,
  },
  whatsapp: {
    bg: "#25D366",
    svg: <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M12 .5A11.5 11.5 0 0 0 2.1 17.7L.5 23.5l6-1.6A11.5 11.5 0 1 0 12 .5zm0 21a9.4 9.4 0 0 1-4.8-1.3l-.34-.2-3.55.93.95-3.46-.22-.36A9.5 9.5 0 1 1 12 21.5zm5.2-7.1c-.28-.14-1.68-.83-1.94-.92s-.45-.14-.64.14-.73.92-.9 1.1-.33.21-.61.07a7.8 7.8 0 0 1-2.29-1.41 8.6 8.6 0 0 1-1.59-1.98c-.17-.28 0-.43.12-.57s.28-.33.42-.49a1.9 1.9 0 0 0 .28-.47.52.52 0 0 0 0-.49c-.07-.14-.64-1.54-.88-2.11s-.46-.48-.64-.49h-.55a1.05 1.05 0 0 0-.76.36 3.2 3.2 0 0 0-1 2.37 5.5 5.5 0 0 0 1.17 2.95 12.7 12.7 0 0 0 4.87 4.3c.68.29 1.21.47 1.62.6a3.9 3.9 0 0 0 1.79.11 2.93 2.93 0 0 0 1.92-1.35 2.38 2.38 0 0 0 .17-1.36c-.07-.12-.26-.19-.54-.33z" /></svg>,
  },
};

const PRESETS = [100, 250, 500, 1000];

export default function RewardsPage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [tab, setTab] = useState<"earn" | "convert">("earn");
  const [preset, setPreset] = useState<number | null>(null);
  const [converting, setConverting] = useState(false);
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState(0);
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, number>>({});
  const [, setTick] = useState(0); // drives the social cooldown countdown

  const hst = user?.hst_balance ?? 0;
  const streak = user?.streak_count ?? 0;
  const done = streak % 7;
  const COOLDOWN = 15; // seconds — matches the backend claim cooldown

  // Real spendable points balance + rank from the backend.
  const loadRank = () =>
    dashApi.myRank(user?.exam_type || "JAMB")
      .then((r) => { setPoints(pointsFromRank(r)); setRank(r?.rank ?? 0); })
      .catch(() => {});
  useEffect(() => { loadRank(); }, [user?.exam_type]); // eslint-disable-line

  // Restore claimed/visited state from this device.
  useEffect(() => {
    try { setClaimed(JSON.parse(localStorage.getItem("hs_earn_claimed") || "{}")); } catch {}
    try { setVisited(JSON.parse(localStorage.getItem("hs_earn_visited") || "{}")); } catch {}
  }, []);
  // Tick every second so cooldown labels count down.
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 1000); return () => clearInterval(t); }, []);

  // ── Earn-more claim helpers ───────────────────────────────────────────────
  const persistClaimed = (next: Record<string, boolean>) => { setClaimed(next); localStorage.setItem("hs_earn_claimed", JSON.stringify(next)); };
  const persistVisited = (next: Record<string, number>) => { setVisited(next); localStorage.setItem("hs_earn_visited", JSON.stringify(next)); };

  const weekKey = () => { const n = new Date(); return `${n.getFullYear()}-${Math.floor((Number(n) - Number(new Date(n.getFullYear(), 0, 1))) / 6048e5)}`; };
  const earnKey = (e: EarnItem) => {
    if (e.social) return `social_${e.social}`;
    if (e.claim === "week") return `week_${Math.floor(streak / 7)}`;
    if (e.claim === "top10") return `top10_${weekKey()}`;
    return e.title;
  };
  const cooldownLeft = (e: EarnItem) => {
    const at = visited[earnKey(e)];
    if (!at) return COOLDOWN; // not opened yet
    return Math.max(0, COOLDOWN - Math.floor((Date.now() - at) / 1000));
  };
  const eligible = (e: EarnItem) => {
    if (e.claim === "week") return streak > 0 && streak % 7 === 0;
    if (e.claim === "top10") return rank > 0 && rank <= 10;
    return true;
  };

  const doClaim = async (e: EarnItem) => {
    const pts = parseInt(e.pts.replace(/\D/g, ""), 10) || 0;
    try {
      await quizApi.credit("Reward", pts);
      persistClaimed({ ...claimed, [earnKey(e)]: true });
      toast.success(`Claimed ${e.pts} points! 🎉`);
      refreshProfile().catch(() => {});
      loadRank();
    } catch (err: any) {
      toast.error(err?.message || "Couldn't claim — try again in a moment.");
    }
  };

  const convert = async () => {
    if (!preset) return;
    if (preset > points) { toast.error("Not enough points."); return; }
    setConverting(true);
    try {
      // Backend converts points -> HST (50 points = 1 HST), expects { points }.
      await api("/api/user/wallet/convert", { method: "POST", body: { points: preset } });
      toast.success(`Converted ${preset} points to ${Math.floor(preset / 50)} HST!`);
      setPreset(null);
      refreshProfile().catch(() => {});
    } catch (e: any) {
      toast.error(e?.message || "Conversion failed.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      {/* Header */}
      <header className="relative overflow-hidden bg-hs-navy px-4 pb-8 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-bold text-white">Rewards</h1>
            <div className="ml-auto h-16 w-16">
              <LottieIcon src="/lottie/reward.json" className="h-16 w-16" fallback={<Coins className="text-hs-amber" />} />
            </div>
          </div>

          <motion.div
            className="mt-4 grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] text-[#B8CCE0]">Points balance</p>
              <p className="mt-1 text-2xl font-extrabold text-hs-amber">{points.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] text-[#B8CCE0]">HST wallet</p>
              <p className="mt-1 text-2xl font-extrabold text-white">{hst.toLocaleString()} HST</p>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 lg:px-8">
        {/* Streak card — connected day-circles (matches the mobile design) */}
        <StreakCardConnected streak={streak} done={done} />

        {/* Tabs */}
        <div className="mt-5 flex rounded-full border border-hs-border bg-white p-1">
          {(["earn", "convert"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 rounded-full py-2 text-sm font-semibold ${tab === t ? "text-white" : "text-hs-muted"}`}
            >
              {tab === t && (
                <motion.span layoutId="rewardTab" className="absolute inset-0 rounded-full bg-hs-blue" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative z-10">{t === "earn" ? "Earn more" : "Convert"}</span>
            </button>
          ))}
        </div>

        {tab === "earn" ? (
          <motion.div className="mt-4 space-y-2.5" variants={stagger} initial="hidden" animate="show">
            {EARN.map((e) => (
              <motion.div
                key={e.title}
                variants={item}
                className="flex items-center gap-3 rounded-2xl border border-hs-border bg-white p-3.5"
              >
                {e.social ? (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: SOCIAL[e.social].bg }}>
                    {SOCIAL[e.social].svg}
                  </span>
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-hs-bg text-xl">{e.icon}</span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-hs-navy">{e.title}</p>
                    <span className="shrink-0 rounded-full bg-hs-amberBg px-2 py-0.5 text-[11px] font-bold text-hs-amberDark">{e.pts}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-hs-muted">{e.sub}</p>
                </div>
                <EarnAction
                  e={e}
                  isClaimed={!!claimed[earnKey(e)]}
                  isVisited={!!visited[earnKey(e)]}
                  cooldown={cooldownLeft(e)}
                  canClaim={eligible(e)}
                  onOpen={() => {
                    window.open(e.url, "_blank", "noopener");
                    persistVisited({ ...visited, [earnKey(e)]: Date.now() });
                    toast.success("Done the task? Come back and claim in a few seconds.");
                  }}
                  onClaim={() => doClaim(e)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ConversionRateCard />
            <div className="rounded-2xl border border-hs-border bg-white p-5">
              <div className="flex items-center gap-2 text-hs-navy">
                <ArrowRightLeft size={18} className="text-hs-blue" />
                <p className="text-sm font-bold">Convert points to HST</p>
              </div>
              <p className="mt-1 text-xs text-hs-muted">Turn your earned points into HST tokens you can redeem.</p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreset(p)}
                    className={`rounded-xl border py-3 text-sm font-bold ${preset === p ? "border-hs-blue bg-hs-blueTint text-hs-blue" : "border-hs-border bg-white text-hs-navy"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                disabled={!preset || converting}
                onClick={convert}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-hs-blue py-3 font-semibold text-white disabled:opacity-40"
              >
                <Sparkles size={18} /> {converting ? "Converting…" : preset ? `Convert ${preset} pts → ${Math.floor(preset / 50)} HST` : "Select an amount"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Brand-coloured conversion-rate card (50 points = 1 HST).
function ConversionRateCard() {
  return (
    <div className="mb-4 rounded-2xl border border-hs-blue/20 bg-hs-blueTint p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-hs-blue text-white">
          <Coins size={22} />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-hs-blue">Conversion rate</p>
          <p className="text-lg font-extrabold text-hs-navy">50 points = <span className="text-hs-amberDark">1 HST</span></p>
        </div>
      </div>
      <p className="mt-2 text-xs text-hs-muted">Turn your earned points into HST tokens, then redeem them for airtime, data and more.</p>
    </div>
  );
}

// Connected day-circles streak card (matches the mobile design).
const STREAK_FLAME = "#FF6624";
const STREAK_GREEN = "#059669";
function StreakCardConnected({ streak, done }: { streak: number; done: number }) {
  const d = Math.min(done, 7);
  const daysLeft = 7 - done;
  return (
    <div className="-mt-4 rounded-2xl border border-hs-border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2">
        <LottieIcon src="/lottie/fire.json" className="h-9 w-9" fallback={<span className="text-xl">🔥</span>} />
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-hs-navy">{streak}-Day Streak</p>
          <p className="text-[11px] text-hs-muted">
            {daysLeft <= 0 ? "🎉 Weekly milestone reached!" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} to 7-day bonus (+70 pts)`}
          </p>
        </div>
        <span className="shrink-0 rounded-xl bg-hs-amberBg px-2.5 py-1 text-center text-[10px] font-bold leading-tight text-hs-amberDark">+70 pts<br />at day 7</span>
      </div>

      {/* Connected dots */}
      <div className="relative mt-4 flex items-start justify-between">
        <div className="absolute left-[18px] right-[18px] top-[16px] h-1 rounded-full bg-hs-border" />
        <div
          className="absolute left-[18px] top-[16px] h-1 rounded-full"
          style={{ width: d > 1 ? `calc((100% - 36px) * ${(d - 1) / 6})` : 0, background: `linear-gradient(90deg, ${STREAK_FLAME}, #FFD700)` }}
        />
        {Array.from({ length: 7 }).map((_, i) => {
          const dayNum = i + 1;
          const isDone = i < done;
          const isPast = i < done - 1;
          const isToday = i === done - 1 && done > 0;
          return (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <span
                className="flex items-center justify-center rounded-full"
                style={{
                  width: isToday ? 40 : 36,
                  height: isToday ? 40 : 36,
                  backgroundColor: isDone ? (isPast ? STREAK_GREEN : STREAK_FLAME) : "#fff",
                  border: `${isToday ? 2.5 : 1.5}px solid ${isToday ? STREAK_FLAME : isDone ? (isPast ? STREAK_GREEN : "#FF9A62") : "#DDDDDD"}`,
                }}
              >
                {isPast ? (
                  <Check size={16} className="text-white" />
                ) : isToday ? (
                  <LottieIcon src="/lottie/fire.json" className="h-7 w-7" fallback={<span>🔥</span>} />
                ) : (
                  <span className="text-xs font-bold" style={{ color: isDone ? "#fff" : "#999" }}>{dayNum}</span>
                )}
              </span>
              <span className="mt-1 text-[9px] font-semibold" style={{ color: isDone ? (isPast ? STREAK_GREEN : STREAK_FLAME) : "#999" }}>{dayNum}d</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-hs-bg">
        <div className="h-full rounded-full" style={{ width: `${(done / 7) * 100}%`, backgroundColor: STREAK_FLAME }} />
      </div>

      {done > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: STREAK_GREEN }}>
          <Check size={13} /> {done === 1 ? "Day 1 claimed today" : `Days 1–${done - 1} claimed · Day ${done} active today`}
        </div>
      )}
    </div>
  );
}

function EarnAction({ e, isClaimed, isVisited, cooldown, canClaim, onOpen, onClaim }: {
  e: EarnItem; isClaimed: boolean; isVisited: boolean; cooldown: number; canClaim: boolean;
  onOpen: () => void; onClaim: () => void;
}) {
  if (e.auto) {
    return <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600"><Check size={12} /> Auto</span>;
  }
  if (isClaimed) {
    return <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600"><Check size={12} /> Claimed</span>;
  }
  // Social tasks: open the link, then claim after a short cooldown.
  if (e.url) {
    if (!isVisited) {
      return <button onClick={onOpen} className="shrink-0 rounded-full bg-hs-blue px-3.5 py-1.5 text-xs font-semibold text-white">Open</button>;
    }
    if (cooldown > 0) {
      return <span className="shrink-0 rounded-full border border-hs-border px-3 py-1.5 text-xs font-semibold text-hs-muted">Wait {cooldown}s</span>;
    }
    return <button onClick={onClaim} className="shrink-0 rounded-full bg-hs-amber px-3.5 py-1.5 text-xs font-bold text-hs-amberDark">Claim</button>;
  }
  // Milestone tasks: claim only when eligible.
  if (canClaim) {
    return <button onClick={onClaim} className="shrink-0 rounded-full bg-hs-amber px-3.5 py-1.5 text-xs font-bold text-hs-amberDark">Claim</button>;
  }
  return <span className="shrink-0 rounded-full border border-hs-border px-3 py-1.5 text-xs font-semibold text-hs-placeholder">🔒 Locked</span>;
}
