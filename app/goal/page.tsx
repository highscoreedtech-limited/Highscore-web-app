"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Check, Target, BookOpen, Flag, CalendarClock, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";

const PRESETS = [50, 150, 300, 500];

// Days remaining in the current week (through Sunday).
function daysLeftThisWeek() {
  const now = new Date();
  const dow = now.getDay(); // 0 = Sun
  return dow === 0 ? 1 : 8 - dow;
}

export default function GoalPage() {
  const router = useRouter();
  const [goal, setGoal] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(150);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api<{ goal: number; answered: number }>("/api/user/weekly-goal")
      .then((d) => { setGoal(d?.goal ?? 0); setAnswered(d?.answered ?? 0); setDraft(d?.goal || 150); if (!d?.goal) setEditing(true); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api("/api/user/weekly-goal", { method: "POST", body: { goal: draft } });
      setGoal(draft); setEditing(false);
      toast.success("Weekly goal saved!");
    } catch { toast.error("Couldn't save your goal."); } finally { setSaving(false); }
  };

  if (!loaded) return <div className="flex min-h-screen items-center justify-center bg-hs-bg"><span className="h-7 w-7 animate-spin rounded-full border-2 border-hs-blue border-t-transparent" /></div>;

  const pct = goal > 0 ? Math.min(1, answered / goal) : 0;
  const done = goal > 0 && answered >= goal;
  const remaining = Math.max(0, goal - answered);
  const R = 52, C = 2 * Math.PI * R;

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      <header className="bg-hs-navy px-4 pb-8 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back"><ArrowLeft size={16} /></button>
          <h1 className="text-lg font-bold text-white">Weekly Goal</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 lg:px-8">
        {/* Ring card */}
        <div className="-mt-5 flex flex-col items-center rounded-3xl border border-hs-border bg-white p-6 shadow-sm">
          <div className="relative h-[150px] w-[150px]">
            <svg viewBox="0 0 130 130" className="h-full w-full -rotate-90">
              <circle cx="65" cy="65" r={R} fill="none" stroke="#E9EDF3" strokeWidth="12" />
              <circle cx="65" cy="65" r={R} fill="none" stroke={done ? "#16A34A" : "#185FA5"} strokeWidth="12" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 0.7s ease" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {done ? <Check size={40} className="text-green-600" /> : <><span className="text-3xl font-extrabold text-hs-navy">{Math.round(pct * 100)}%</span><span className="text-[11px] text-hs-muted">complete</span></>}
            </div>
          </div>
          <p className="mt-3 text-lg font-extrabold text-hs-navy">{answered} / {goal || "—"} questions</p>
          <p className="text-sm font-semibold" style={{ color: done ? "#16A34A" : "#8A8A8A" }}>
            {goal === 0 ? "No goal set yet" : done ? "🎉 Goal smashed! Keep the momentum." : `${remaining} more to hit your target`}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat icon={<Flag size={16} className="text-hs-blue" />} value={goal || "—"} label="Target" />
          <Stat icon={<TrendingUp size={16} className="text-green-600" />} value={answered} label="Answered" />
          <Stat icon={<CalendarClock size={16} className="text-hs-amber" />} value={daysLeftThisWeek()} label="Days left" />
        </div>

        {/* Edit / set goal */}
        {editing ? (
          <div className="mt-4 rounded-3xl border border-hs-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2"><Target size={18} className="text-hs-blue" /><p className="text-sm font-bold text-hs-navy">{goal === 0 ? "Set your weekly target" : "Update your target"}</p></div>
            <p className="mt-1 text-xs text-hs-muted">How many questions will you answer this week?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p} onClick={() => setDraft(p)} className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${draft === p ? "bg-hs-blue text-white" : "border border-hs-border bg-white text-hs-navy"}`}>{p}</button>
              ))}
              <input type="number" min={1} value={draft} onChange={(e) => setDraft(Math.max(1, Number(e.target.value) || 0))} className="w-24 rounded-full border border-hs-border px-3 py-1.5 text-sm font-bold text-hs-navy outline-none" />
            </div>
            <div className="mt-4 flex gap-2">
              {goal !== 0 && <button onClick={() => setEditing(false)} className="flex-1 rounded-full border border-hs-border py-2.5 text-sm font-bold text-hs-muted">Cancel</button>}
              <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-hs-blue py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving…" : "Save goal"}</button>
            </div>
          </div>
        ) : (
          <button onClick={() => { setDraft(goal || 150); setEditing(true); }} className="mt-4 w-full rounded-full border border-hs-border bg-white py-3 text-sm font-bold text-hs-navy shadow-sm">
            Edit weekly target
          </button>
        )}

        {/* How it works */}
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-hs-blue/20 bg-hs-blueTint p-4">
          <BookOpen size={18} className="mt-0.5 shrink-0 text-hs-blue" />
          <p className="text-xs leading-relaxed text-hs-blue">
            Every question you answer in <span className="font-bold">CBT practice</span> counts toward your goal. Your progress resets at the start of each week, so aim to hit your target before Sunday!
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-hs-border bg-white p-4 text-center shadow-sm">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1.5 text-xl font-extrabold text-hs-navy">{value}</p>
      <p className="text-[11px] text-hs-muted">{label}</p>
    </div>
  );
}
