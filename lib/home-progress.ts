// Lightweight, device-local progress signals for the home summary card.
// (Per-day goal completion + the last subject opened — used to drive the
// "today's goals" ring and the "Continue" action.)

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export type Goal = "quiz" | "cbt";

/** Mark a daily goal as done for today (called when a quiz/CBT finishes). */
export function markGoal(g: Goal): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`hs_goal_${g}_${todayKey()}`, "1");
}

export interface DailyGoals {
  quiz: boolean;
  cbt: boolean;
  streak: boolean; // streak kept today (app opened / streak touched)
  count: number;
  total: number;
}

export function goalsToday(): DailyGoals {
  if (typeof window === "undefined") return { quiz: false, cbt: false, streak: false, count: 0, total: 3 };
  const t = todayKey();
  const quiz = localStorage.getItem(`hs_goal_quiz_${t}`) === "1";
  const cbt = localStorage.getItem(`hs_goal_cbt_${t}`) === "1";
  const streak = localStorage.getItem("hs_last_streak_date") === t;
  return { quiz, cbt, streak, count: [quiz, cbt, streak].filter(Boolean).length, total: 3 };
}

/** Remember the last subject the user opened (for the Continue action). */
export function setLastSubject(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("hs_last_subject", name);
}

export function getLastSubject(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hs_last_subject");
}
