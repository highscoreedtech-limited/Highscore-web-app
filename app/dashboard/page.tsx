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
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { dashApi, LeaderboardEntry, api, profileApi, streakPoints } from "@/lib/api";
import LottieIcon from "@/components/LottieIcon";
import SubscribeTab from "./SubscribeTab";
import DownloadsTab from "./DownloadsTab";
import { AVATARS } from "@/lib/avatars";

const EXAMS = ["JAMB", "WAEC", "NECO", "GCE", "Nursing"];

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
            />
          )}
          {tab === 1 && <SubscribeTab />}
          {tab === 2 && <DownloadsTab />}
          {tab === 3 && <MoreTab onLogout={() => router.push("/login")} />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav tab={tab} setTab={setTab} />

      {/* Daily streak celebration */}
      <AnimatePresence>
        {streakCelebrate && (
          <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-6" onClick={() => setStreakCelebrate(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-sm rounded-3xl bg-hs-navy p-7 text-center text-white" onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.7, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 16 }}>
              <div className="mx-auto mb-2 h-24 w-24"><LottieIcon src="/lottie/fire.json" className="h-24 w-24" fallback={<span className="text-6xl">🔥</span>} /></div>
              <p className="text-3xl font-extrabold">{streakCelebrate.count}-day streak!</p>
              <p className="mt-1 text-sm text-[#B8CCE0]">You&apos;re on fire. Keep showing up daily.</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-hs-amber/20 px-4 py-2 text-hs-amber">
                <span className="text-lg">⚡</span>
                <span className="font-bold">+{streakCelebrate.points} points earned</span>
              </div>
              <button onClick={() => setStreakCelebrate(null)} className="mt-6 w-full rounded-full bg-hs-amber py-3 font-bold text-hs-amberDark">Claim & continue</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Home tab ──────────────────────────────────────────────────────────────────
function HomeTab({
  fullName, initials, avatarColor, avatarUrl, streak, examType, onNav,
}: {
  fullName: string; initials: string; avatarColor: string; avatarUrl: string;
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
          <div className="relative">
            <Bell size={22} className="text-hs-muted" />
            <span className="absolute right-0 top-0 h-[7px] w-[7px] rounded-full border border-white bg-hs-flame" />
          </div>
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
        </div>
      </div>

      {examOpen && (
        <div className="mt-2 rounded-xl border border-hs-border bg-white p-2 shadow-sm lg:max-w-xs">
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

      {/* Two-pane on desktop: feed + leaderboard side panel */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          {/* Welcome card */}
          <div className="mt-3.5 rounded-2xl bg-hs-navy p-4 shadow-lg shadow-hs-navy/25 lg:p-6">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-[13px] text-[#B8CCE0]">Welcome back,</p>
                <p className="text-[13px] font-semibold text-white lg:text-base">{fullName}</p>
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
            <MenuItem icon={Star} color="#D97706" title="Rate the app" subtitle="Enjoying HighScore? Leave a review" />
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
