"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { dashApi, pointsFromRank, type LeaderboardEntry } from "@/lib/api";

const EXAMS = ["All", "JAMB", "WAEC", "NECO", "GCE", "Nursing"];

function fullName(e: LeaderboardEntry) {
  return `${e.first_name} ${e.last_name}`.trim().toUpperCase() || "ANONYMOUS";
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [exam, setExam] = useState("All");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(0);
  const [myPoints, setMyPoints] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const examForRank = exam === "All" ? "JAMB" : exam;
    Promise.all([
      dashApi.leaderboard(exam, 50).catch(() => [] as LeaderboardEntry[]),
      dashApi.myRank(examForRank).catch(() => ({ rank: 0 })),
    ]).then(([list, rank]) => {
      if (!active) return;
      setEntries(Array.isArray(list) ? list : []);
      setMyRank(rank?.rank ?? 0);
      setMyPoints(pointsFromRank(rank));
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [exam]);

  const myName = user ? `${user.first_name} ${user.last_name}`.trim() : "You";
  const myInitials = ((user?.first_name?.[0] ?? "") + (user?.last_name?.[0] ?? "")).toUpperCase() || "?";

  const share = async () => {
    const msg = `I'm ranked #${myRank || 1} on the HighScore ${exam} leaderboard with ${myPoints} points! 💪 Think you can beat me? https://highscoreedtech.com`;
    if (navigator.share) { try { await navigator.share({ title: "My HighScore rank", text: msg }); } catch { /* cancelled */ } }
    else { await navigator.clipboard.writeText(msg); toast.success("Rank copied — go flex!"); }
  };

  return (
    <div className="min-h-screen bg-hs-bg">
      {/* Navy header */}
      <header className="bg-hs-navy px-4 pb-4 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center">
            <button onClick={() => router.push("/dashboard")} className="text-white" aria-label="Back"><ArrowLeft size={18} /></button>
            <span className="ml-3 text-sm font-bold uppercase tracking-wide text-white">leaderboard</span>
            <button onClick={share} className="ml-auto flex items-center gap-1.5 rounded-[10px] px-3 py-1.5" style={{ backgroundColor: "rgba(37,211,102,0.2)", border: "1px solid rgba(37,211,102,0.5)" }}>
              <Share2 size={14} className="text-[#25D366]" />
              <span className="text-xs font-bold text-[#25D366]">Share rank</span>
            </button>
          </div>
          <div className="mt-3.5 flex gap-2">
            <HeaderStat value="15k+" label="students" />
            <HeaderStat value="36" label="states" />
            <HeaderStat value="live" label="updated" />
          </div>
        </div>
      </header>

      {/* Exam filters */}
      <div className="sticky top-0 z-10 border-b border-hs-border bg-hs-bg/95 px-4 py-2.5 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {EXAMS.map((e) => (
            <button key={e} onClick={() => setExam(e)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${exam === e ? "bg-hs-blue text-white" : "border border-hs-border bg-white text-hs-navy"}`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-3 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-12"><span className="h-7 w-7 animate-spin rounded-full border-2 border-hs-blue border-t-transparent" /></div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-5xl">🏆</span>
            <p className="mt-3 text-sm font-semibold text-hs-muted">No entries yet — be the first to climb!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((e, i) => (
              <motion.div key={`${e.rank}-${i}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }}>
                <Row e={e} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky "your rank" bar */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 border-t border-hs-border bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:px-8">
        <div className="flex items-center gap-3">
          <span className="w-12 text-center text-sm font-extrabold text-hs-blue">{myRank > 0 ? `#${myRank}` : "#—"}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: user?.avatar_color || "#185FA5" }}>{myInitials}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-hs-navy">{myName} <span className="text-hs-muted">(you)</span></p>
            <p className="text-[11px] text-hs-muted">{exam === "All" ? "Global" : exam} board</p>
          </div>
          <span className="text-sm font-extrabold text-hs-navy">{myPoints} pts</span>
        </div>
      </div>
    </div>
  );
}

function HeaderStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 rounded-xl bg-white/10 py-2.5 text-center">
      <p className="text-base font-extrabold text-white">{value}</p>
      <p className="text-[11px] text-[#B8CCE0]">{label}</p>
    </div>
  );
}

function Row({ e }: { e: LeaderboardEntry }) {
  const isFirst = e.rank === 1;
  return (
    <div
      className="flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5"
      style={isFirst
        ? { backgroundColor: "#FAEEDA", borderColor: "rgba(133,79,11,0.25)" }
        : { backgroundColor: "#fff", borderColor: "#E2E2E2" }}
    >
      <span className="w-5 text-sm font-bold" style={{ color: isFirst ? "#854F0B" : "#8A8A8A" }}>{e.rank}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: isFirst ? "#EF9F27" : (e.avatar_color || "#185FA5"), color: isFirst ? "#412402" : "#fff" }}>
        {e.initials || fullName(e)[0]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-hs-navy">{fullName(e)}</p>
        <p className="text-[11px] text-hs-muted">{e.state || "—"} · {e.badge}</p>
      </div>
      {isFirst && <span className="rounded-md bg-white px-1.5 py-0.5 text-[11px] font-bold text-hs-amberDark">top</span>}
      <span className="text-sm font-bold" style={{ color: isFirst ? "#854F0B" : "#042C53" }}>{e.total_score}</span>
    </div>
  );
}
