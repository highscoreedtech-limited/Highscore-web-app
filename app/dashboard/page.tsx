"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  GraduationCap, ChevronDown, Bell, Search, PlayCircle, Gamepad2,
  Laptop, LineChart, Medal, Gift, Newspaper, UserPlus, ExternalLink,
  Home, ShoppingCart, CloudDownload, MoreHorizontal, LogOut,
  User as UserIcon, Shield, HelpCircle, Star, Info, Wallet, ChevronRight, Pencil,
  ArrowRight, Check,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { dashApi, LeaderboardEntry, api, profileApi, streakPoints, pointsFromRank } from "@/lib/api";
import { tierFor, nextTier, tierProgress } from "@/lib/tiers";
import { realtime } from "@/lib/realtime/client";
import { goalsToday, getLastSubject, type DailyGoals } from "@/lib/home-progress";
import LottieIcon from "@/components/LottieIcon";
import SubscribeTab from "./SubscribeTab";
import DownloadsTab from "./DownloadsTab";
import { AVATARS } from "@/lib/avatars";
import StreakCelebration from "@/components/StreakCelebration";

const EXAMS = ["JAMB", "WAEC", "NECO", "GCE", "Nursing"];
const EXAM_SUB: Record<string, string> = {
  JAMB: "Joint Admissions & Matriculation Board",
  WAEC: "West African Examinations Council",
  NECO: "National Examinations Council",
  GCE: "General Certificate of Education",
  Nursing: "Nursing & Midwifery Council of Nigeria",
};

const NAV = [
  { icon: Home, label: "Home" },
  { icon: ShoppingCart, label: "Subscribe" },
  { icon: CloudDownload, label: "Downloads" },
  { icon: MoreHorizontal, label: "More" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [tab, setTab] = useState(0);

  // Allow deep-linking to a tab (e.g. /dashboard?tab=1 opens Unlock subjects).
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t !== null && !Number.isNaN(Number(t))) setTab(Number(t));
  }, []);

  // Verify a Paystack payment when the user is redirected back with a reference.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") || params.get("trxref");
    if (!ref) return;
    api("/api/payment/verify", { method: "POST", body: { reference: ref } })
      .then(() => { toast.success("Subscription activated! Welcome to HighScore Pro 🎉"); refreshProfile().catch(() => {}); })
      .catch(() => toast.error("We couldn't confirm your payment. Contact support if you were charged."))
      .finally(() => {
        localStorage.removeItem("hs_pay_ref");
        window.history.replaceState({}, "", window.location.pathname);
      });
  }, [refreshProfile]);

  // Daily streak: tell the backend (authoritative, +1/day max), reflect the
  // result, and celebrate when it advances on a new day.
  const [streakCelebrate, setStreakCelebrate] = useState<{ count: number; points: number } | null>(null);
  useEffect(() => {
    let active = true;
    profileApi.touchStreak()
      .then((res) => {
        if (!active) return;
        const count = res?.streak_count ?? 0;
        const today = new Date().toISOString().slice(0, 10);
        const last = localStorage.getItem("hs_last_streak_date");
        if (count > 0 && last !== today) {
          localStorage.setItem("hs_last_streak_date", today);
          setStreakCelebrate({ count, points: streakPoints(count) });
        }
        refreshProfile().catch(() => {});
      })
      .catch(() => {});
    return () => { active = false; };
  }, [refreshProfile]);

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : "Champion";
  const initials = useMemo(() => {
    const a = user?.first_name?.[0] ?? "";
    const b = user?.last_name?.[0] ?? "";
    return (a + b).toUpperCase() || "?";
  }, [user]);

  return (
    <div className="min-h-screen bg-hs-bg md:flex">
      {/* Desktop sidebar */}
      <SideNav tab={tab} setTab={setTab} />

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-lg pb-24 md:max-w-3xl md:pb-10 lg:max-w-6xl">
          {tab === 0 && (
            <HomeTab
              fullName={fullName}
              initials={initials}
              avatarColor={user?.avatar_color || "#185FA5"}
              avatarUrl={user?.avatar_url || ""}
              streak={user?.streak_count ?? 0}
              examType={user?.exam_type || "JAMB"}
              onNav={(href) => router.push(href)}
              onProfile={() => setTab(3)}
            />
          )}
          {tab === 1 && <SubscribeTab />}
          {tab === 2 && <DownloadsTab />}
          {tab === 3 && <MoreTab onLogout={() => router.push("/login")} />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav tab={tab} setTab={setTab} />

      {/* Daily streak celebration — full-screen animated sequence */}
      <AnimatePresence>
        {streakCelebrate && (
          <StreakCelebration
            count={streakCelebrate.count}
            points={streakCelebrate.points}
            onDone={() => setStreakCelebrate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Home tab ──────────────────────────────────────────────────────────────────
function HomeTab({
  fullName, initials, avatarColor, avatarUrl, streak, examType, onNav, onProfile,
}: {
  fullName: string; initials: string; avatarColor: string; avatarUrl: string;
  streak: number; examType: string; onNav: (href: string) => void; onProfile: () => void;
}) {
  const [exam, setExam] = useState(examType);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState(0);
  const [myPoints, setMyPoints] = useState(0);
  const [examOpen, setExamOpen] = useState(false);
  const [goals, setGoals] = useState<DailyGoals>({ quiz: false, cbt: false, streak: false, count: 0, total: 3 });

  useEffect(() => {
    let active = true;
    dashApi.leaderboard(exam, 5).then((e) => active && setEntries(e || [])).catch(() => {});
    // Tier is based on TOTAL accumulated points (total_score), not spendable.
    dashApi.myRank(exam).then((r) => { if (active) { setMyRank(r?.rank ?? 0); setMyPoints(r?.total_score ?? pointsFromRank(r)); } }).catch(() => {});
    return () => { active = false; };
  }, [exam]);

  // Daily goals — read on mount and whenever the user returns to the tab
  // (so finishing a quiz/CBT updates the ring on return).
  useEffect(() => {
    const read = () => setGoals(goalsToday());
    read();
    window.addEventListener("focus", read);
    document.addEventListener("visibilitychange", read);
    return () => { window.removeEventListener("focus", read); document.removeEventListener("visibilitychange", read); };
  }, []);

  const lastSubject = getLastSubject();
  const tier = tierFor(myPoints);

  // Animate the streak number rolling up to its value on load.
  const [streakShown, setStreakShown] = useState(0);
  useEffect(() => {
    if (streak <= 0) { setStreakShown(0); return; }
    const duration = 900;
    let raf = 0, startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min(1, (now - startTime) / duration);
      setStreakShown(Math.round((1 - Math.pow(1 - t, 3)) * streak));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [streak]);

  return (
    <div className="px-4 pt-4 md:px-6 md:pt-6 lg:px-8 lg:pt-7">
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
          <NotificationBell />
          <button onClick={onProfile} aria-label="Open profile" className="transition-transform active:scale-95">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full bg-hs-blueTint object-cover" />
            ) : (
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {examOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50"
            onClick={() => setExamOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-t-3xl bg-white p-5 pb-8"
              onClick={(ev) => ev.stopPropagation()}
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="mx-auto h-1 w-10 rounded-full bg-hs-border" />
              <h2 className="mt-4 text-lg font-bold text-hs-navy">Select Exam Board</h2>
              <p className="mt-1 text-sm text-hs-muted">Choose the exam you&apos;re preparing for</p>
              <div className="mt-4 space-y-2.5">
                {EXAMS.map((e) => {
                  const sel = e === exam;
                  return (
                    <button
                      key={e}
                      onClick={() => { setExam(e); setExamOpen(false); }}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left ${sel ? "border-hs-blue bg-hs-blueTint" : "border-transparent bg-hs-bg"}`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${sel ? "bg-hs-blue/15 text-hs-blue" : "bg-white text-hs-muted"}`}>
                        {e[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${sel ? "text-hs-blue" : "text-hs-navy"}`}>{e}</p>
                        <p className="text-[11px] text-hs-muted">{EXAM_SUB[e]}</p>
                      </div>
                      {sel && <Check size={18} className="text-hs-blue" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-pane on desktop: feed + leaderboard side panel */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          {/* Summary card — gamified: level + XP bar + daily quests + streak */}
          <div className="relative mt-3.5 overflow-hidden rounded-3xl p-4 shadow-lg shadow-hs-navy/30 lg:p-5"
            style={{ background: "linear-gradient(135deg, #0E3D6E 0%, #042C53 55%, #06223E 100%)" }}>
            {/* Glow accents — game energy, not banking flatness */}
            <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-hs-amber/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-[#2E90FA]/25 blur-3xl" />
            <span className="pointer-events-none absolute right-16 top-3 text-xs opacity-60">✦</span>
            <span className="pointer-events-none absolute right-6 top-12 text-[9px] opacity-40">✦</span>

            <div className="relative">
              {/* Greeting + level chip */}
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-base font-extrabold text-white">Hey, {fullName.split(" ")[0]}! 👋</p>
                  <p className="text-[12px] text-[#B8CCE0]">{myRank > 0 ? `Ranked #${myRank} this week — keep climbing` : "Play today to enter the rankings"}</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold text-white ring-1 ring-white/30"
                  style={{ background: "linear-gradient(90deg, rgba(239,159,39,0.35), rgba(239,159,39,0.15))" }}>
                  <span className="text-sm">{tier.emoji}</span> {tier.name}
                </span>
              </div>

              {/* XP bar → next tier */}
              <div className="mt-4">
                <div className="flex items-end justify-between text-[11px]">
                  <span className="font-extrabold text-hs-amber">⭐ {myPoints.toLocaleString()} XP</span>
                  <span className="font-semibold text-[#B8CCE0]">
                    {(() => { const n = nextTier(myPoints); return n ? `${(n.minPts - myPoints).toLocaleString()} XP to ${n.emoji} ${n.name}` : "👑 Max level!"; })()}
                  </span>
                </div>
                <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-white/12 ring-1 ring-white/10">
                  <div className="h-full rounded-full transition-[width] duration-700"
                    style={{ width: `${Math.max(4, tierProgress(myPoints) * 100)}%`, background: "linear-gradient(90deg, #EF9F27, #FFC85C)", boxShadow: "0 0 10px rgba(239,159,39,0.7)" }} />
                </div>
              </div>

              {/* Streak quest chip */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/12 py-1.5 pl-1.5 pr-3.5 ring-1 ring-white/15">
                <LottieIcon src="/lottie/fire.json" className="-my-1 h-9 w-9" fallback={<span className="text-2xl">🔥</span>} />
                <span className="text-[13px] font-bold text-white">
                  {streakShown}-day streak{goals.streak ? " 🔒 locked in!" : " — play to keep the flame!"}
                </span>
              </div>

              {/* Primary action */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => onNav(lastSubject ? `/courses/${encodeURIComponent(lastSubject)}` : "/quiz")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold text-hs-amberDark"
                style={{ background: "linear-gradient(90deg, #FFC85C, #EF9F27)", boxShadow: "0 6px 20px -4px rgba(239,159,39,0.6)" }}
              >
                ⚡ {lastSubject ? `Continue ${lastSubject}` : "Play today's quiz"} <ArrowRight size={16} />
              </motion.button>
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
        </div>

        {/* Leaderboard panel */}
        <div className="mt-6 lg:mt-3.5">
          <div className="lg:sticky lg:top-6 lg:rounded-2xl lg:border lg:border-hs-border lg:bg-white lg:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-hs-navy">Leaderboard</h2>
              <button
                onClick={() => onNav("/leaderboard")}
                className="flex items-center gap-1 text-sm font-semibold text-hs-blue"
              >
                Full board <ExternalLink size={13} />
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {entries.length === 0 && (
                <p className="rounded-xl border border-hs-border bg-white px-4 py-5 text-center text-sm text-hs-muted lg:border-0">
                  No leaderboard data yet.
                </p>
              )}
              {entries.slice(0, 5).map((e) => (
                <LeaderboardRow key={e.rank} e={e} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pieces ──────────────────────────────────────────────────────────────────
interface AppNotification { id: number; type: string; title: string; body: string; read: boolean; created_at: string }

const NOTIF_ICON: Record<string, string> = { referral: "🎉", unlock: "🔓", challenge: "⚔️", system: "🔔" };

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function NotificationBell() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    api<{ notifications: AppNotification[]; unread: number }>("/api/notifications")
      .then((d) => { if (active) { setItems(d?.notifications || []); setUnread(d?.unread ?? 0); } })
      .catch(() => {});
    // Live: new notifications arrive over the shared WebSocket.
    const off = realtime.on("notification", (n: AppNotification) => {
      setItems((prev) => [n, ...prev].slice(0, 50));
      setUnread((u) => u + 1);
    });
    return () => { active = false; off(); };
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      setUnread(0);
      api("/api/notifications/read", { method: "POST" }).catch(() => {});
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative">
      <button onClick={toggle} aria-label="Notifications" className="relative flex h-8 w-8 items-center justify-center">
        <Bell size={22} className="text-hs-muted" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hs-flame px-1 text-[9px] font-extrabold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              className="absolute right-0 z-50 mt-2 max-h-[70vh] w-[320px] overflow-y-auto rounded-2xl border border-hs-border bg-white p-2 shadow-xl"
            >
              <p className="px-3 py-2 text-sm font-bold text-hs-navy">Notifications</p>
              {items.length === 0 && (
                <p className="px-3 pb-5 pt-2 text-center text-sm text-hs-muted">Nothing yet — go earn some! 🎯</p>
              )}
              {items.map((n) => (
                <div key={n.id} className={`flex gap-2.5 rounded-xl px-3 py-2.5 ${n.read ? "" : "bg-hs-blueTint"}`}>
                  <span className="text-lg">{NOTIF_ICON[n.type] || "🔔"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-hs-navy">{n.title}</p>
                    <p className="text-xs leading-snug text-hs-muted">{n.body}</p>
                    <p className="mt-0.5 text-[10px] text-hs-placeholder">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StreakChip({ streak }: { streak: number }) {
  const active = streak > 0;
  return (
    <div
      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 ${
        active ? "border-hs-flame/35 bg-hs-flame/10" : "border-hs-border bg-[#F5F5F5]"
      }`}
    >
      {active ? (
        <LottieIcon src="/lottie/fire.json" className="-my-2 -ml-1 h-9 w-9" fallback={<span className="text-[13px]">🔥</span>} />
      ) : (
        <span className="text-[13px]">🌑</span>
      )}
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
  lottie?: string; href?: string; big?: boolean;
}
const CATEGORIES: Cat[] = [
  { name: "My Courses", subtitle: "6 active", bg: "#E6F1FB", fg: "#185FA5", icon: PlayCircle, lottie: "/lottie/video-player.json", href: "/courses" },
  { name: "Quiz games", subtitle: "3 live now", bg: "#FAEEDA", fg: "#854F0B", icon: Gamepad2, lottie: "/lottie/quiz-games.json", href: "/quiz" },
  { name: "CBT practice", subtitle: "JAMB, WAEC", bg: "#E6F1FB", fg: "#185FA5", icon: Laptop, lottie: "/lottie/cbt.json", href: "/cbt" },
  { name: "Analytics", subtitle: "JAMB, WAEC", bg: "#E6F1FB", fg: "#185FA5", icon: LineChart, lottie: "/lottie/graph.json", href: "/analytics" },
  { name: "Leaderboard", subtitle: "JAMB, WAEC", bg: "#FAEEDA", fg: "#854F0B", icon: Medal, href: "/leaderboard" },
  { name: "Rewards", subtitle: "Claim points", bg: "#FAEEDA", fg: "#854F0B", icon: Gift, lottie: "/lottie/reward.json", href: "/rewards", big: true },
  { name: "News", subtitle: "JAMB updates", bg: "#EEF4FF", fg: "#3B5BDB", icon: Newspaper, href: "/news" },
  { name: "Refer & Earn", subtitle: "Get 100 pts", bg: "#F0FDF4", fg: "#16A34A", icon: UserPlus, lottie: "/lottie/refer-and-earn.json", href: "/referral", big: true },
];

function CategoryCard({ cat, onClick }: { cat: Cat; onClick: () => void }) {
  const Icon = cat.icon;
  return (
    <button
      onClick={onClick}
      className="flex aspect-[1.75] flex-col items-start overflow-hidden rounded-xl p-3 text-left shadow-[0_4px_12px_rgba(0,0,0,0.13)] transition-transform hover:-translate-y-0.5 active:scale-95"
      style={{ backgroundColor: cat.bg }}
    >
      {cat.lottie ? (
        <LottieIcon
          src={cat.lottie}
          className={cat.big ? "-my-1.5 -ml-1 h-[68px] w-[68px]" : "h-12 w-12"}
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
  const { user, logout, refreshProfile } = useAuth();
  const router = useRouter();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const name = user ? `${user.first_name} ${user.last_name}`.trim() : "HighScore User";
  const initials = ((user?.first_name?.[0] ?? "") + (user?.last_name?.[0] ?? "")).toUpperCase() || "?";
  const tier = (user?.subscription_tier ?? "free").toLowerCase();
  const tierLabel = tier === "free" ? "Free plan" : `${tier[0].toUpperCase()}${tier.slice(1)} member`;
  const avatarUrl = user?.avatar_url || "";

  return (
    <div className="px-4 pb-10 pt-7 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Identity */}
        <div className="flex flex-col items-center">
          <button onClick={() => setAvatarOpen(true)} className="relative">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Avatar" className="h-20 w-20 rounded-full bg-hs-blueTint object-cover" />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold text-white" style={{ backgroundColor: user?.avatar_color || "#185FA5" }}>
                {initials}
              </span>
            )}
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-hs-blue text-white">
              <Pencil size={11} />
            </span>
          </button>
          <p className="mt-3 text-lg font-bold text-hs-navy">{name}</p>
          <p className="text-sm text-hs-muted">{user?.email}</p>
          <span className={`mt-2 rounded-full px-3 py-1 text-[11px] font-bold ${tier === "free" ? "bg-hs-bg text-hs-muted" : "bg-hs-amberBg text-hs-amberDark"}`}>
            {tierLabel}
          </span>
        </div>

        {/* Wallet */}
        <div className="mt-5 rounded-2xl bg-hs-navy p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Wallet size={20} />
            </span>
            <div>
              <p className="text-[11px] text-[#B8CCE0]">HST wallet balance</p>
              <p className="text-2xl font-extrabold text-hs-amber">{user?.hst_balance ?? 0} <span className="text-sm">HST</span></p>
            </div>
          </div>
          <div className="mt-4 flex gap-2.5">
            <button onClick={() => router.push("/rewards")} className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm font-semibold hover:bg-white/15">Convert points</button>
            <button onClick={() => setRedeemOpen(true)} className="flex-1 rounded-xl bg-hs-amber py-2.5 text-sm font-bold text-hs-amberDark">Redeem</button>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-5 space-y-3">
          <MenuSection>
            <MenuItem icon={UserIcon} color="#185FA5" title="Edit profile" subtitle="Update your name, exam type & state" onClick={() => router.push("/profile/edit")} />
          </MenuSection>
          <MenuSection>
            <MenuItem icon={Bell} color="#D97706" title="Notifications" subtitle="Streak reminders, battle invites & more" onClick={() => router.push("/profile/notifications")} />
            <MenuItem icon={Shield} color="#7C3AED" title="Privacy" subtitle="Your data, legal policies & account deletion" onClick={() => router.push("/profile/privacy")} />
          </MenuSection>
          <MenuSection>
            <MenuItem icon={HelpCircle} color="#059669" title="Help & support" subtitle="FAQs, report a bug, contact us" onClick={() => router.push("/profile/help")} />
            <MenuItem icon={Star} color="#D97706" title="Rate the app" subtitle="Enjoying HighScore? Leave a review" onClick={() => setRateOpen(true)} />
            <MenuItem icon={Info} color="#8A8A8A" title="About" subtitle="Version 1.0.0 · HighScore EdTech Limited" />
          </MenuSection>
          <MenuSection>
            <button
              onClick={() => { logout(); onLogout(); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-red-50">
                <LogOut size={18} className="text-red-500" />
              </span>
              <span className="text-sm font-semibold text-red-500">Log out</span>
            </button>
          </MenuSection>
        </div>
      </div>

      <AvatarPickerModal open={avatarOpen} current={avatarUrl} onClose={() => setAvatarOpen(false)} onSaved={() => refreshProfile().catch(() => {})} />
      <RedeemModal open={redeemOpen} balance={user?.hst_balance ?? 0} onClose={() => setRedeemOpen(false)} />
      <RateModal open={rateOpen} onClose={() => setRateOpen(false)} />
    </div>
  );
}

function AvatarPickerModal({ open, current, onClose, onSaved }: { open: boolean; current: string; onClose: () => void; onSaved: () => void; }) {
  const [selected, setSelected] = useState(current);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) setSelected(current); }, [open, current]);

  const save = async () => {
    if (!selected) { toast.error("Pick an avatar first."); return; }
    setSaving(true);
    try { await api("/api/user/profile", { method: "PUT", body: { avatar_url: selected } }); toast.success("Avatar updated!"); onSaved(); onClose(); }
    catch (e: any) { toast.error(e?.message || "Couldn't save avatar."); }
    finally { setSaving(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-t-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto h-1 w-10 rounded-full bg-hs-border" />
        <h2 className="mt-4 text-lg font-bold text-hs-navy">Choose your avatar</h2>
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {AVATARS.map((a) => (
            <button key={a} onClick={() => setSelected(a)} className={`overflow-hidden rounded-2xl border-2 ${selected === a ? "border-hs-blue" : "border-transparent"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a} alt="Avatar option" className="aspect-square w-full bg-hs-blueTint object-cover" />
            </button>
          ))}
        </div>
        <button onClick={save} disabled={saving} className="mt-6 w-full rounded-full bg-hs-blue py-3 font-semibold text-white disabled:opacity-50">
          {saving ? "Saving…" : "Save avatar"}
        </button>
      </div>
    </div>
  );
}

function RedeemModal({ open, balance, onClose }: { open: boolean; balance: number; onClose: () => void; }) {
  const NAIRA_PER_HST = 5;
  const options = [
    { icon: "📱", title: "Airtime top-up", desc: "Any network, sent instantly", min: 100, color: "#185FA5", bg: "#E6F1FB" },
    { icon: "🌐", title: "Data bundle", desc: "Browse and study on us", min: 150, color: "#7C3AED", bg: "#EEEDFE" },
    { icon: "🎓", title: "Scholarship entry", desc: "Enter the termly draw", min: 500, color: "#EF9F27", bg: "#FAEEDA" },
    { icon: "💵", title: "Cash payout", desc: "Withdraw to your bank", min: 1000, color: "#059669", bg: "#EAF3DE" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 pb-8" onClick={(e) => e.stopPropagation()}
            initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: "spring", stiffness: 300, damping: 32 }}>
            <div className="mx-auto h-1 w-10 rounded-full bg-hs-border" />

            {/* Balance hero */}
            <div className="mt-5 rounded-3xl bg-hs-navy p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#B8CCE0]">Your HST balance</p>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#B8CCE0]">1 HST ≈ ₦{NAIRA_PER_HST}</span>
              </div>
              <div className="mt-2 flex items-end gap-2">
                <p className="text-4xl font-extrabold text-hs-amber">{balance.toLocaleString()}</p>
                <p className="pb-1 text-lg font-bold text-hs-amber">HST</p>
              </div>
              <p className="mt-1 text-xs text-[#B8CCE0]">≈ ₦{(balance * NAIRA_PER_HST).toLocaleString()} in rewards</p>
            </div>

            <h2 className="mt-6 text-base font-bold text-hs-navy">Redeem for</h2>
            <p className="text-xs text-hs-muted">Pick a reward — we&apos;ll process it within 24 hours.</p>

            <div className="mt-4 space-y-3">
              {options.map((o) => {
                const can = balance >= o.min;
                const pct = Math.min(100, Math.round((balance / o.min) * 100));
                return (
                  <motion.button
                    key={o.title}
                    whileTap={can ? { scale: 0.99 } : undefined}
                    disabled={!can}
                    onClick={() => { toast.success(`Redemption request for ${o.title} submitted! 🎉`); onClose(); }}
                    className={`flex w-full items-center gap-3.5 rounded-2xl border bg-white p-4 text-left transition-shadow ${can ? "border-hs-border shadow-[0_6px_18px_-10px_rgba(4,44,83,0.25)] hover:shadow-[0_12px_28px_-12px_rgba(4,44,83,0.35)]" : "border-hs-border/70"}`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: o.bg }}>{o.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-hs-navy">{o.title}</p>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: o.bg, color: o.color }}>{o.min} HST</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-hs-muted">{o.desc}</p>
                      {!can && (
                        <div className="mt-2">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-hs-bg">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: o.color }} />
                          </div>
                          <p className="mt-1 text-[10px] text-hs-muted">{o.min - balance} more HST to unlock</p>
                        </div>
                      )}
                    </div>
                    {can ? (
                      <span className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: o.color }}>Redeem</span>
                    ) : (
                      <span className="shrink-0 text-hs-placeholder">🔒</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <p className="mt-4 text-center text-[11px] text-hs-muted">Earn more HST by converting your points in Rewards.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const PLAY = "https://play.google.com/store/apps/details?id=com.highscore.highscore";
  useEffect(() => { if (open) setRating(0); }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-2xl rounded-t-3xl bg-white p-6 pb-8 text-center" onClick={(e) => e.stopPropagation()}
            initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: "spring", stiffness: 300, damping: 32 }}>
            <div className="mx-auto h-1 w-10 rounded-full bg-hs-border" />
            <p className="mt-5 text-5xl">⭐</p>
            <h2 className="mt-2 text-lg font-bold text-hs-navy">Enjoying HighScore?</h2>
            <p className="mt-1 text-sm text-hs-muted">Tap a star to rate your experience.</p>
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} aria-label={`${n} star`} className="transition-transform active:scale-90">
                  <Star size={36} className={n <= rating ? "fill-hs-amber text-hs-amber" : "text-hs-border"} />
                </button>
              ))}
            </div>
            {rating === 0 ? (
              <p className="mt-6 text-xs text-hs-placeholder">Select a rating to continue</p>
            ) : rating >= 4 ? (
              <a href={PLAY} target="_blank" rel="noreferrer" onClick={() => { toast.success("Thank you! 🎉"); onClose(); }}
                className="mt-6 block rounded-full bg-hs-blue py-3 font-semibold text-white">Rate us on Google Play</a>
            ) : (
              <a href="mailto:support@highscore.ng?subject=HighScore%20feedback" onClick={() => { toast.info("Thanks — we'd love to hear how to improve!"); onClose(); }}
                className="mt-6 block rounded-full bg-hs-navy py-3 font-semibold text-white">Tell us how to improve</a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuSection({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-hs-border overflow-hidden rounded-2xl border border-hs-border bg-white">{children}</div>;
}

function MenuItem({
  icon: Icon, color, title, subtitle, onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string; title: string; subtitle: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick ?? (() => toast.info(`${title} — coming soon`))}
      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-hs-bg"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${color}1A`, color }}>
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-hs-navy">{title}</span>
        <span className="block truncate text-[11px] text-hs-muted">{subtitle}</span>
      </span>
      <ChevronRight size={18} className="text-hs-placeholder" />
    </button>
  );
}

// ── Desktop sidebar (lg+) ─────────────────────────────────────────────────────
function SideNav({ tab, setTab }: { tab: number; setTab: (i: number) => void }) {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-hs-border bg-white px-3 py-6 md:flex lg:w-60">
      <div className="px-3">
        <Image src="/highscore-logo-final.png" alt="HighScore" width={140} height={36} className="h-9 w-auto object-contain" priority />
      </div>
      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map((it, i) => {
          const active = i === tab;
          const Icon = it.icon;
          return (
            <button
              key={it.label}
              onClick={() => setTab(i)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active ? "bg-hs-blue text-white" : "text-hs-navy hover:bg-hs-blueTint"
              }`}
            >
              <Icon size={20} />
              {it.label}
            </button>
          );
        })}
      </nav>
      <button
        onClick={() => { logout(); router.push("/login"); }}
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-hs-muted hover:bg-hs-bg"
      >
        <LogOut size={20} />
        Log out
      </button>
    </aside>
  );
}

// ── Mobile bottom nav ─────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }: { tab: number; setTab: (i: number) => void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 border-t border-hs-border bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:hidden">
      <div className="flex items-center justify-around py-1.5">
        {NAV.map((it, i) => {
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
