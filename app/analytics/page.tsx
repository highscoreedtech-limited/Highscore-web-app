"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Target, Flame, Award } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { performanceApi, type Performance } from "@/lib/api";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [perf, setPerf] = useState<Performance | null>(null);

  useEffect(() => {
    let active = true;
    performanceApi.get().then((p) => { if (active) setPerf(p); });
    return () => { active = false; };
  }, []);

  const subjects = perf?.subjects ?? [];
  const week = perf?.weekly ?? [];
  const trend = perf?.trend ?? "";
  const avg = subjects.length ? Math.round(subjects.reduce((n, s) => n + s.score, 0) / subjects.length) : 0;

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-bold text-white">Analytics</h1>
          </div>
          <p className="mt-1.5 text-sm text-white/70">Your weekly progress overview</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-5 lg:px-8">
        {/* Top stats */}
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={Target} color="#185FA5" value={`${avg}%`} label="Avg score" />
          <Stat icon={Flame} color="#FF6624" value={`${user?.streak_count ?? 0}`} label="Day streak" />
          <Stat icon={Award} color="#EF9F27" value="#--" label="Rank" />
        </div>

        {/* Weekly chart */}
        <div className="mt-4 rounded-2xl border border-hs-border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-hs-navy">This week</p>
            {trend && <span className="flex items-center gap-1 text-xs font-semibold text-green-600"><TrendingUp size={14} /> {trend}</span>}
          </div>
          <div className="mt-4 flex h-36 items-end justify-between gap-2">
            {week.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <motion.div className="w-full rounded-t-lg bg-hs-blue" initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
                </div>
                <span className="text-[11px] text-hs-muted">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject performance */}
        <p className="mt-6 text-sm font-bold text-hs-navy">Subject performance</p>
        <div className="mt-3 space-y-3.5 rounded-2xl border border-hs-border bg-white p-5">
          {subjects.map((s, i) => (
            <div key={s.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-semibold text-hs-navy">{s.label}</span>
                <span className="font-bold" style={{ color: s.color }}>{s.score}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-hs-bg">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: s.color }} initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, color, value, label }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string; value: string; label: string; }) {
  return (
    <div className="rounded-2xl border border-hs-border bg-white p-4">
      <Icon size={20} style={{ color }} />
      <p className="mt-2 text-xl font-extrabold text-hs-navy">{value}</p>
      <p className="text-[11px] text-hs-muted">{label}</p>
    </div>
  );
}
