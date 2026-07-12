"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Check, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

/** Compact home-screen summary of the weekly goal. Tapping opens /goal. */
export default function WeeklyGoalCard() {
  const router = useRouter();
  const [goal, setGoal] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api<{ goal: number; answered: number }>("/api/user/weekly-goal")
      .then((d) => { setGoal(d?.goal ?? 0); setAnswered(d?.answered ?? 0); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  const pct = goal > 0 ? Math.min(1, answered / goal) : 0;
  const done = goal > 0 && answered >= goal;
  const R = 34, C = 2 * Math.PI * R;

  if (goal === 0) {
    return (
      <button onClick={() => router.push("/goal")} className="mt-3 flex w-full items-center gap-3 rounded-3xl border border-hs-border bg-white p-4 text-left shadow-sm">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hs-blueTint"><Target size={20} className="text-hs-blue" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-hs-navy">Set a weekly goal</p>
          <p className="text-[12px] text-hs-muted">Target the questions you&apos;ll answer this week.</p>
        </div>
        <ChevronRight size={18} className="text-hs-muted" />
      </button>
    );
  }

  return (
    <button onClick={() => router.push("/goal")} className="mt-3 flex w-full items-center gap-4 rounded-3xl border border-hs-border bg-white p-4 text-left shadow-sm">
      <div className="relative h-[76px] w-[76px] shrink-0">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={R} fill="none" stroke="#E9EDF3" strokeWidth="8" />
          <circle cx="40" cy="40" r={R} fill="none" stroke={done ? "#16A34A" : "#185FA5"} strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {done ? <Check size={22} className="text-green-600" /> : <span className="text-lg font-extrabold text-hs-navy">{Math.round(pct * 100)}%</span>}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-hs-navy">Weekly Goal</p>
        <p className="mt-0.5 text-[13px] text-hs-muted"><span className="font-bold text-hs-navy">{answered}</span> / {goal} questions</p>
        <p className="mt-1 text-[11px] font-semibold" style={{ color: done ? "#16A34A" : "#8A8A8A" }}>{done ? "🎉 Goal smashed!" : `${goal - answered} to go this week`}</p>
      </div>
      <ChevronRight size={18} className="text-hs-muted" />
    </button>
  );
}
