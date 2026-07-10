"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Users, Globe, Zap } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { dashApi, pointsFromRank, type LeaderboardEntry } from "@/lib/api";
import Asset3D from "@/components/Asset3D";

const EXAMS = ["All", "JAMB", "WAEC", "NECO", "GCE", "Post UTME"];

// Rank tiers (matches the app's tier system).
const TIERS = [
  { name: "Wood", emoji: "🪵", color: "#B08968", minPts: 0, starter: true },
  { name: "Bronze", emoji: "🥉", color: "#CD7F32", minPts: 500 },
  { name: "Silver", emoji: "🥈", color: "#C0C0C0", minPts: 1500 },
  { name: "Gold", emoji: "🥇", color: "#FFD34E", minPts: 3000 },
  { name: "Diamond", emoji: "💎", color: "#5AC8FA", minPts: 6000 },
];

function fullName(e: LeaderboardEntry) {
  return `${e.first_name} ${e.last_name}`.trim() || "Anonymous";
}
function tierName(pts: number) {
  let t = TIERS[0];
  for (const x of TIERS) if (pts >= x.minPts) t = x;
  return t;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [exam, setExam] = useState("All");
  const [scope, setScope] = useState<"weekly" | "all">("weekly");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(0);
  const [myPoints, setMyPoints] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      dashApi.leaderboard(exam, 50).catch(() => [] as LeaderboardEntry[]),
      dashApi.myRank(exam).catch(() => ({ rank: 0 })),
    ]).then(([list, rank]) => {
      if (!active) return;
      const sorted = (Array.isArray(list) ? [...list] : []).sort((a, b) => a.rank - b.rank);
      setEntries(sorted);
      const mine = user?.id ? sorted.find((e) => e.user_id === user.id) : undefined;
      setMyRank(mine?.rank ?? rank?.rank ?? 0);
      setMyPoints(mine?.total_score ?? rank?.total_score ?? pointsFromRank(rank));
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [exam, user?.id]);

  const myName = user?.first_name?.trim() || "You";
  const myInitials = ((user?.first_name?.[0] ?? "") + (user?.last_name?.[0] ?? "")).toUpperCase() || "?";
  const myTier = tierName(myPoints);

  const share = async () => {
    const msg = `I'm ranked #${myRank || 1} on the HighScore ${exam} leaderboard with ${myPoints} points! 💪 Beat me: https://highscoreedtech.com`;
    if (navigator.share) { try { await navigator.share({ title: "My HighScore rank", text: msg }); } catch { /* cancelled */ } }
    else { await navigator.clipboard.writeText(msg); toast.success("Rank copied, go flex!"); }
  };

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen pb-28 text-white" style={{ background: "linear-gradient(180deg,#0A1B33 0%,#0B1E38 40%,#081524 100%)" }}>
      <div className="mx-auto max-w-2xl px-4 pt-5 lg:max-w-5xl lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10" aria-label="Back"><ArrowLeft size={16} /></button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-extrabold">Leaderboard</h1>
            <p className="text-[11px] text-white/60">Top learners. Real champions. 🏆</p>
          </div>
          <button onClick={share} className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold ring-1 ring-white/15">
            <Share2 size={13} /> Share
          </button>
        </div>

        {/* Stat cards */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <StatCard icon={<Users size={16} className="text-[#8AB4FF]" />} value="15K+" label="Students" />
          <StatCard icon={<Globe size={16} className="text-[#34D399]" />} value="36" label="States" />
          <StatCard icon={<Zap size={16} className="text-[#FFB020]" />} value="Live" label="Updated" />
        </div>

        {/* Weekly / All time */}
        <div className="mt-4 flex rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
          {(["weekly", "all"] as const).map((s) => (
            <button key={s} onClick={() => setScope(s)} className={`relative flex-1 rounded-xl py-2.5 text-sm font-bold ${scope === s ? "text-white" : "text-white/50"}`}>
              {scope === s && <motion.span layoutId="lbScope" className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2F6BFF] to-[#1D4ED8]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative z-10">{s === "weekly" ? "Weekly" : "All Time"}</span>
            </button>
          ))}
        </div>

        {/* Exam filter */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {EXAMS.map((e) => (
            <button key={e} onClick={() => setExam(e)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${exam === e ? "bg-gradient-to-r from-[#2F6BFF] to-[#1D4ED8] text-white" : "bg-white/5 text-white/70 ring-1 ring-white/10"}`}>{e}</button>
          ))}
        </div>

        {/* Rank levels */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-bold">Rank Levels</span>
          <span className="text-[11px] font-semibold text-[#FFB020]">You are: {myTier.emoji} {myTier.name}</span>
        </div>
        <div className="mt-2.5 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TIERS.map((t) => {
            const isMe = t.name === myTier.name;
            return (
              <div key={t.name} className="flex w-[86px] shrink-0 flex-col items-center rounded-2xl py-3"
                style={{ background: isMe ? "rgba(255,176,32,0.12)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${isMe ? "#FFB020" : "rgba(255,255,255,0.08)"}` }}>
                <Asset3D name={`medal_${t.name.toLowerCase()}`} fallback={t.emoji} size={38} float={false} />
                <span className="mt-1 text-[12px] font-bold">{t.name}</span>
                <span className="text-[9px] text-white/50">{t.starter ? "Starter" : `${t.minPts}+ pts`}</span>
              </div>
            );
          })}
        </div>

        {/* Podium */}
        {loading ? (
          <div className="flex justify-center py-12"><span className="h-7 w-7 animate-spin rounded-full border-2 border-white/40 border-t-transparent" /></div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center"><span className="text-5xl">🏆</span><p className="mt-3 text-sm text-white/60">No entries yet, be the first to climb!</p></div>
        ) : (
          <>
            {top3.length > 0 && (
              <div className="mt-6 grid grid-cols-3 items-end gap-2.5 lg:mx-auto lg:max-w-2xl lg:gap-4">
                {[top3[1], top3[0], top3[2]].map((e, idx) => {
                  if (!e) return <div key={idx} />;
                  const place = e.rank; // 1,2,3
                  const center = place === 1;
                  const tier = tierName(e.total_score);
                  return (
                    <div key={e.user_id ?? idx} className={`relative flex flex-col items-center rounded-2xl p-3 ${center ? "pb-4" : ""}`}
                      style={center
                        ? { background: "linear-gradient(180deg,rgba(255,176,32,0.28),rgba(255,176,32,0.08))", border: "1.5px solid #FFB020" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>
                      {center && <span className="absolute -top-4 text-2xl">👑</span>}
                      <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold ring-1 ring-white/20">{place}</span>
                      <Avatar url={e.avatar_url} color={e.avatar_color} initials={e.initials || fullName(e)[0]} size={center ? 64 : 48} />
                      <p className={`mt-2 w-full truncate text-center font-bold ${center ? "text-sm" : "text-[13px]"}`}>{e.first_name?.trim() || "Anonymous"}</p>
                      <p className="text-[10px]" style={{ color: tier.color }}>{tier.emoji} {tier.name}</p>
                      <p className={`mt-0.5 font-extrabold ${center ? "text-hs-amber" : "text-white/90"}`}>{e.total_score.toLocaleString()} <span className="text-[10px] font-medium text-white/50">pts</span></p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Rows 4+ (two columns on desktop to use the width) */}
            <div className="mt-4 space-y-2 lg:grid lg:grid-cols-2 lg:gap-x-3 lg:gap-y-2 lg:space-y-0">
              {rest.map((e, i) => {
                const tier = tierName(e.total_score);
                return (
                  <motion.div key={`${e.rank}-${i}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/[0.06]">
                    <span className="w-5 text-center text-sm font-bold text-white/70">{e.rank}</span>
                    <Avatar url={e.avatar_url} color={e.avatar_color} initials={e.initials || fullName(e)[0]} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{e.first_name?.trim() || "Anonymous"}</p>
                      <p className="text-[11px]" style={{ color: tier.color }}>{tier.emoji} {tier.name}</p>
                    </div>
                    <span className="text-sm font-bold">{e.total_score.toLocaleString()} <span className="text-[10px] font-medium text-white/40">pts</span></span>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Sticky your-position bar */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 border-t border-white/10 bg-[#0C2038]/95 px-4 py-3 backdrop-blur lg:max-w-5xl lg:px-8">
        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-3 py-2 ring-1 ring-white/10">
          <span className="text-sm font-extrabold text-[#8AB4FF]">{myRank > 0 ? `#${myRank}` : "#—"}</span>
          <Avatar url={user?.avatar_url} color={user?.avatar_color} initials={myInitials} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{myName} <span className="rounded bg-[#2F6BFF] px-1.5 py-0.5 text-[9px] font-extrabold">YOU</span></p>
            <p className="text-[11px]" style={{ color: myTier.color }}>{myTier.emoji} {myTier.name}</p>
          </div>
          <span className="text-sm font-extrabold text-[#8AB4FF]">{myPoints.toLocaleString()} <span className="text-[10px] font-medium text-white/40">pts</span></span>
        </div>
      </div>
    </div>
  );
}

// Shows the user's real avatar image when set, else initials on their colour.
function Avatar({ url, color, initials, size }: { url?: string; color?: string; initials: string; size: number }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, backgroundColor: color || "#2563EB", fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/[0.05] px-3 py-3 ring-1 ring-white/10">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-extrabold leading-none">{value}</p>
        <p className="truncate text-[10px] text-white/55">{label}</p>
      </div>
    </div>
  );
}
