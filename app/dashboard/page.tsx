"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  GraduationCap, ChevronDown, Bell, Search, PlayCircle, Gamepad2,
  Laptop, LineChart, Medal, Gift, Newspaper, UserPlus, ExternalLink,
  Home, ShoppingCart, CloudDownload, MoreHorizontal,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { dashApi, LeaderboardEntry } from "@/lib/api";
import LottieIcon from "@/components/LottieIcon";

const EXAMS = ["JAMB", "WAEC", "NECO", "GCE", "Nursing"];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : "Champion";
  const initials = useMemo(() => {
    const a = user?.first_name?.[0] ?? "";
    const b = user?.last_name?.[0] ?? "";
    return (a + b).toUpperCase() || "?";
  }, [user]);

  return (
    <div className="min-h-screen bg-hs-bg">
      <div className="mx-auto w-full max-w-lg min-h-screen bg-hs-bg pb-24">
        {tab === 0 && (
          <HomeTab
            fullName={fullName}
            initials={initials}
            avatarColor={user?.avatar_color || "#185FA5"}
            streak={user?.streak_count ?? 0}
            examType={user?.exam_type || "JAMB"}
            onNav={(href) => router.push(href)}
          />
        )}
        {tab === 1 && <Placeholder title="Subscribe" subtitle="Plans & payments coming here" />}
        {tab === 2 && <Placeholder title="Downloads" subtitle="Your saved materials" />}
        {tab === 3 && <MoreTab onLogout={() => router.push("/login")} />}
      </div>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

// ── Home tab ──────────────────────────────────────────────────────────────────
function HomeTab({
  fullName, initials, avatarColor, streak, examType, onNav,
}: {
  fullName: string; initials: string; avatarColor: string;
  streak: number; examType: string; onNav: (href: string) => void;
}) {
  const [exam, setExam] = useState(examType);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState(0);
  const [examOpen, setExamOpen] = useState(false);

  useEffect(() => {
    let active = true;
    dashApi.leaderboard(exam, 5).then((e) => active && setEntries(e || [])).catch(() => {});
    dashApi.myRank(exam).then((r) => active && setMyRank(r?.rank ?? 0)).catch(() => {});
    return () => { active = false; };
  }, [exam]);

  return (
    <div className="px-4 pt-4">
      {/* Top bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setExamOpen((v) => !v)}
          className="flex items-center gap-1 rounded-[10px] bg-hs-blueTint px-2.5 py-1.5"
        >
          <GraduationCap size={13} className="text-hs-blue" />
          <span className="text-xs font-semibold text-hs-navy">SS3 / {exam}</span>
          <ChevronDown size={16} className="text-hs-blue" />
        </button>

        <div className="ml-auto flex items-center gap-2.5">
          <StreakChip streak={streak} />
          <div className="relative">
            <Bell size={22} className="text-hs-muted" />
            <span className="absolute right-0 top-0 h-[7px] w-[7px] rounded-full border border-white bg-hs-flame" />
          </div>
          <div className="flex flex-col items-center">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </span>
          </div>
        </div>
      </div>

      {examOpen && (
        <div className="mt-2 rounded-xl border border-hs-border bg-white p-2 shadow-sm">
          {EXAMS.map((e) => (
            <button
              key={e}
              onClick={() => { setExam(e); setExamOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                e === exam ? "bg-hs-blueTint text-hs-blue font-semibold" : "text-hs-navy"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-hs-blueTint text-xs font-bold text-hs-blue">
                {e[0]}
              </span>
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Welcome card */}
      <div className="mt-3.5 rounded-2xl bg-hs-navy p-4 shadow-lg shadow-hs-navy/25">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-[13px] text-[#B8CCE0]">Welcome back,</p>
            <p className="text-[13px] font-semibold text-white">{fullName}</p>
          </div>
          <span className="rounded-[10px] border border-white/40 bg-white/15 px-2.5 py-1 text-[13px] font-bold text-white">
            {myRank > 0 ? `Bronze  #${myRank}` : "Bronze"}
          </span>
        </div>

        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-[10px] bg-white/15 px-2.5 py-1.5">
          <LottieIcon
            src="/lottie/fire.json"
            className="h-[22px] w-[22px]"
            fallback={<span className="text-base">🔥</span>}
          />
          <span className="text-[13px] font-semibold text-white">
            {streak}-day streak — keep it up!
          </span>
        </div>

        <div className="mt-3.5 flex gap-1.5">
          <StatTile value="84%" label="avg score" />
          <StatTile value="129" label="questions" />
          <StatTile value={myRank > 0 ? `#${myRank}` : "--"} label="rank" amber />
        </div>
      </div>

      {/* Search */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-hs-border bg-white px-3.5 py-3">
        <Search size={18} className="text-hs-placeholder" />
        <input
          placeholder="Search subjects, topics, past questions…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-hs-placeholder"
        />
      </div>

      {/* Category grid */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <CategoryCard
            key={c.name}
            cat={c}
            onClick={() => (c.href ? onNav(c.href) : toast.info(`${c.name} — coming soon`))}
          />
        ))}
      </div>

      {/* Leaderboard preview */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-hs-navy">Leaderboard</h2>
          <button
            onClick={() => toast.info("Full board — coming soon")}
            className="flex items-center gap-1 text-sm font-semibold text-hs-blue"
          >
            Full board <ExternalLink size={13} />
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {entries.length === 0 && (
            <p className="rounded-xl border border-hs-border bg-white px-4 py-5 text-center text-sm text-hs-muted">
              No leaderboard data yet.
            </p>
          )}
          {entries.slice(0, 5).map((e) => (
            <LeaderboardRow key={e.rank} e={e} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Pieces ──────────────────────────────────────────────────────────────────
function StreakChip({ streak }: { streak: number }) {
  const active = streak > 0;
  return (
    <div
      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 ${
        active ? "border-hs-flame/35 bg-hs-flame/10" : "border-hs-border bg-[#F5F5F5]"
      }`}
    >
      <span className="text-[13px]">{active ? "🔥" : "🌑"}</span>
      <span className={`text-[13px] font-extrabold ${active ? "text-hs-flame" : "text-[#AAAAAA]"}`}>
        {streak}
      </span>
    </div>
  );
}

function StatTile({ value, label, amber }: { value: string; label: string; amber?: boolean }) {
  return (
    <div className="flex-1 rounded-[10px] bg-white/10 py-2.5 text-center">
      <p className={`text-[13px] font-bold ${amber ? "text-hs-amber" : "text-white"}`}>{value}</p>
      <p className="text-[13px] text-[#B8CCE0]">{label}</p>
    </div>
  );
}

interface Cat {
  name: string; subtitle: string; bg: string; fg: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  lottie?: string; href?: string;
}
const CATEGORIES: Cat[] = [
  { name: "My Courses", subtitle: "6 active", bg: "#E6F1FB", fg: "#185FA5", icon: PlayCircle, lottie: "/lottie/video-player.json", href: "/courses" },
  { name: "Quiz games", subtitle: "3 live now", bg: "#FAEEDA", fg: "#854F0B", icon: Gamepad2, lottie: "/lottie/quiz-games.json" },
  { name: "CBT practice", subtitle: "JAMB, WAEC", bg: "#E6F1FB", fg: "#185FA5", icon: Laptop, lottie: "/lottie/cbt.json", href: "/cbt" },
  { name: "Analytics", subtitle: "JAMB, WAEC", bg: "#E6F1FB", fg: "#185FA5", icon: LineChart, lottie: "/lottie/graph.json" },
  { name: "Leaderboard", subtitle: "JAMB, WAEC", bg: "#FAEEDA", fg: "#854F0B", icon: Medal },
  { name: "Rewards", subtitle: "Claim points", bg: "#FAEEDA", fg: "#854F0B", icon: Gift, lottie: "/lottie/reward.json", href: "/rewards" },
  { name: "News", subtitle: "JAMB updates", bg: "#EEF4FF", fg: "#3B5BDB", icon: Newspaper },
  { name: "Refer & Earn", subtitle: "Get 100 pts", bg: "#F0FDF4", fg: "#16A34A", icon: UserPlus, lottie: "/lottie/refer-and-earn.json" },
];

function CategoryCard({ cat, onClick }: { cat: Cat; onClick: () => void }) {
  const Icon = cat.icon;
  return (
    <button
      onClick={onClick}
      className="flex aspect-[1.75] flex-col items-start rounded-xl p-3 text-left shadow-[0_4px_12px_rgba(0,0,0,0.13)] transition-transform active:scale-95"
      style={{ backgroundColor: cat.bg }}
    >
      {cat.lottie ? (
        <LottieIcon
          src={cat.lottie}
          className="h-12 w-12"
          fallback={
            <span className="rounded-lg p-1.5" style={{ backgroundColor: `${cat.fg}26` }}>
              <Icon size={22} style={{ color: cat.fg }} />
            </span>
          }
        />
      ) : (
        <span className="rounded-lg p-1.5" style={{ backgroundColor: `${cat.fg}26` }}>
          <Icon size={22} style={{ color: cat.fg }} />
        </span>
      )}
      <span className="mt-auto text-xs font-bold text-hs-navy">{cat.name}</span>
      <span className="text-[11px] text-hs-muted">{cat.subtitle}</span>
    </button>
  );
}

function LeaderboardRow({ e }: { e: LeaderboardEntry }) {
  const name = `${e.first_name} ${e.last_name}`.trim().toUpperCase();
  return (
    <div className="flex items-center gap-3 rounded-xl border border-hs-border bg-white px-3 py-2.5">
      <span className="w-5 text-center text-sm font-extrabold text-hs-navy">{e.rank}</span>
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: e.avatar_color || "#185FA5" }}
      >
        {e.initials || name[0] || "?"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-hs-navy">{name || "Anonymous"}</p>
        <p className="text-[11px] text-hs-muted">{e.badge}{e.state ? ` · ${e.state}` : ""}</p>
      </div>
      <span className="text-sm font-extrabold text-hs-blue">{e.total_score}</span>
    </div>
  );
}

function Placeholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-bold text-hs-navy">{title}</h1>
      <p className="mt-1 text-sm text-hs-muted">{subtitle}</p>
    </div>
  );
}

function MoreTab({ onLogout }: { onLogout: () => void }) {
  const { user, logout } = useAuth();
  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-hs-navy">More</h1>
      <p className="mt-1 text-sm text-hs-muted">{user?.email}</p>
      <button
        onClick={() => { logout(); onLogout(); }}
        className="mt-6 w-full rounded-full bg-hs-navy py-3 font-semibold text-white"
      >
        Log out
      </button>
    </div>
  );
}

// ── Bottom nav ────────────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }: { tab: number; setTab: (i: number) => void }) {
  const items = [
    { icon: Home, label: "Home" },
    { icon: ShoppingCart, label: "Subscribe" },
    { icon: CloudDownload, label: "Downloads" },
    { icon: MoreHorizontal, label: "More" },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 border-t border-hs-border bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around py-1.5">
        {items.map((it, i) => {
          const active = i === tab;
          const Icon = it.icon;
          return (
            <button key={it.label} onClick={() => setTab(i)} className="flex flex-col items-center">
              <span
                className={`flex h-[30px] w-[42px] items-center justify-center rounded-[20px] transition-colors ${
                  active ? "bg-hs-blue" : "bg-transparent"
                }`}
              >
                <Icon size={19} className={active ? "text-white" : "text-hs-placeholder"} />
              </span>
              <span className={`mt-0.5 text-[10px] ${active ? "font-semibold text-hs-blue" : "text-hs-placeholder"}`}>
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
