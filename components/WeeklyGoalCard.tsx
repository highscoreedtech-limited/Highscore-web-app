"use client";

import { useEffect, useState } from "react";
import { Target, Check, Pencil } from "lucide-react";
import { api } from "@/lib/api";

const PRESETS = [50, 150, 300];

export default function WeeklyGoalCard() {
  const [goal, setGoal] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(150);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api<{ goal: number; answered: number }>("/api/user/weekly-goal")
      .then((d) => { setGoal(d?.goal ?? 0); setAnswered(d?.answered ?? 0); setDraft(d?.goal || 150); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api("/api/user/weekly-goal", { method: "POST", body: { goal: draft } });
      setGoal(draft); setEditing(false);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  if (loading) return null;

  const pct = goal > 0 ? Math.min(1, answered / goal) : 0;
  const done = goal > 0 && answered >= goal;
  const R = 34, C = 2 * Math.PI * R;

  // Set-goal / edit state
  if (goal === 0 || editing) {
    return (
      <div className="mt-3 rounded-3xl border border-hs-border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-hs-blue" />
          <p className="text-sm font-bold text-hs-navy">{goal === 0 ? "Set a weekly goal" : "Update your weekly goal"}</p>
        </div>
        <p className="mt-1 text-xs text-hs-muted">How many questions will you answer this week?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p} onClick={() => setDraft(p)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${draft === p ? "bg-hs-blue text-white" : "border border-hs-border bg-white text-hs-navy"}`}>
              {p}
            </button>
          ))}
          <input type="number" min={1} value={draft} onChange={(e) => setDraft(Math.max(1, Number(e.target.value) || 0))}
            className="w-24 rounded-full border border-hs-border px-3 py-1.5 text-sm font-bold text-hs-navy outline-none" />
        </div>
        <div className="mt-4 flex gap-2">
          {goal !== 0 && (
            <button onClick={() => setEditing(false)} className="flex-1 rounded-full border border-hs-border py-2.5 text-sm font-bold text-hs-muted">Cancel</button>
          )}
          <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-hs-blue py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Saving…" : "Set goal"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-4 rounded-3xl border border-hs-border bg-white p-4 shadow-sm">
      {/* Ring */}
      <div className="relative h-[84px] w-[84px] shrink-0">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={R} fill="none" stroke="#E9EDF3" strokeWidth="8" />
          <circle cx="40" cy="40" r={R} fill="none" stroke={done ? "#16A34A" : "#185FA5"} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
            style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {done ? <Check size={22} className="text-green-600" />
            : <span className="text-lg font-extrabold text-hs-navy">{Math.round(pct * 100)}%</span>}
        </div>
      </div>
      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-extrabold text-hs-navy">Weekly Goal</p>
          <button onClick={() => setEditing(true)} aria-label="Edit goal" className="text-hs-muted hover:text-hs-navy"><Pencil size={13} /></button>
        </div>
        <p className="mt-0.5 text-[13px] text-hs-muted">
          <span className="font-bold text-hs-navy">{answered}</span> / {goal} questions answered
        </p>
        <p className="mt-1 text-[11px] font-semibold" style={{ color: done ? "#16A34A" : "#8A8A8A" }}>
          {done ? "🎉 Goal smashed! Keep going." : `${goal - answered} to go this week`}
        </p>
      </div>
    </div>
  );
}
