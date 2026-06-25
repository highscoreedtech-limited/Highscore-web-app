"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft, Clock, Check, X, ChevronLeft, ChevronRight, RotateCcw,
} from "lucide-react";
import { CBT_BANK, CBT_EXAMS, CbtQuestion } from "@/lib/cbt-bank";
import { api } from "@/lib/api";

type Phase = "select" | "exam" | "result";

const SUBJECTS = Object.keys(CBT_BANK);
const EXAMS = Object.keys(CBT_EXAMS);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CbtPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("select");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [exam, setExam] = useState("JAMB");

  const [questions, setQuestions] = useState<CbtQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [secsLeft, setSecsLeft] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const cfg = CBT_EXAMS[exam];

  const correctCount = useMemo(
    () => questions.reduce((n, q, i) => (answers[i] === q.ans ? n + 1 : n), 0),
    [questions, answers]
  );

  const stopTimer = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
  useEffect(() => () => stopTimer(), []);

  const start = () => {
    const qs = shuffle(CBT_BANK[subject]).slice(0, cfg.qs);
    setQuestions(qs);
    setAnswers({});
    setCurrent(0);
    setSecsLeft(cfg.mins * 60);
    setPhase("exam");
    stopTimer();
    timer.current = setInterval(() => {
      setSecsLeft((s) => {
        if (s <= 1) { finish(); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  const finish = () => {
    stopTimer();
    setPhase("result");
  };

  // Credit points to the backend once we reach the result screen.
  const credited = useRef(false);
  useEffect(() => {
    if (phase !== "result" || credited.current) return;
    credited.current = true;
    api("/api/quiz/credit", {
      method: "POST",
      body: { score: correctCount * 5, total: questions.length, exam_type: exam, subject },
    }).catch(() => {});
  }, [phase, correctCount, questions.length, exam, subject]);

  const reset = () => { credited.current = false; setPhase("select"); };

  if (phase === "select") {
    return (
      <Shell onBack={() => router.push("/dashboard")} title="CBT Practice">
        <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
          <h2 className="text-sm font-bold text-hs-navy">Choose a subject</h2>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                  subject === s ? "border-hs-blue bg-hs-blueTint text-hs-blue" : "border-hs-border bg-white text-hs-navy"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <h2 className="mt-6 text-sm font-bold text-hs-navy">Choose exam type</h2>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {EXAMS.map((e) => (
              <button
                key={e}
                onClick={() => setExam(e)}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                  exam === e ? "border-hs-blue bg-hs-blueTint text-hs-blue" : "border-hs-border bg-white text-hs-navy"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-hs-border bg-white p-4 text-sm text-hs-muted">
            <p><span className="font-bold text-hs-navy">{cfg.qs}</span> questions · <span className="font-bold text-hs-navy">{cfg.mins}</span> minutes · 5 points per correct answer</p>
          </div>

          <button
            onClick={start}
            className="mt-5 w-full rounded-full bg-hs-blue py-3.5 font-semibold text-white hover:bg-hs-blueDeep"
          >
            Start practice
          </button>
        </div>
      </Shell>
    );
  }

  if (phase === "exam") {
    const q = questions[current];
    const mins = Math.floor(secsLeft / 60);
    const secs = secsLeft % 60;
    const low = secsLeft < 60;
    return (
      <div className="min-h-screen bg-hs-bg">
        {/* Exam top bar */}
        <header className="sticky top-0 z-10 bg-hs-navy px-4 py-3 lg:px-8">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <span className="text-sm font-semibold text-white">{subject} · {exam}</span>
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${low ? "bg-red-500 text-white" : "bg-white/15 text-white"}`}>
              <Clock size={15} /> {mins}:{secs.toString().padStart(2, "0")}
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-5 lg:px-8">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-hs-muted">
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-hs-border">
            <div className="h-full rounded-full bg-hs-blue" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>

          {/* Question */}
          <div className="mt-5 rounded-2xl border border-hs-border bg-white p-5">
            <p className="text-base font-semibold text-hs-navy">{q.q}</p>
            <div className="mt-4 space-y-2.5">
              {q.opts.map((opt, i) => {
                const selected = answers[current] === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm ${
                      selected ? "border-hs-blue bg-hs-blueTint text-hs-blue" : "border-hs-border bg-white text-hs-navy hover:bg-hs-bg"
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${selected ? "border-hs-blue bg-hs-blue text-white" : "border-hs-border text-hs-muted"}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav */}
          <div className="mt-4 flex items-center justify-between">
            <button
              disabled={current === 0}
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              className="flex items-center gap-1 rounded-full border border-hs-border bg-white px-4 py-2 text-sm font-semibold text-hs-navy disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                className="flex items-center gap-1 rounded-full bg-hs-blue px-5 py-2 text-sm font-semibold text-white"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={finish}
                className="rounded-full bg-hs-amber px-5 py-2 text-sm font-semibold text-hs-amberDark"
              >
                Submit
              </button>
            )}
          </div>

          {/* Palette */}
          <div className="mt-5 flex flex-wrap gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-8 w-8 rounded-lg text-xs font-bold ${
                  i === current ? "bg-hs-navy text-white" : answers[i] !== undefined ? "bg-hs-blueTint text-hs-blue" : "bg-white text-hs-muted border border-hs-border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Result
  const total = questions.length;
  const pct = total ? Math.round((correctCount / total) * 100) : 0;
  return (
    <Shell onBack={() => router.push("/dashboard")} title="Your result">
      <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
        <div className="rounded-2xl bg-hs-navy p-6 text-center text-white">
          <p className="text-sm text-[#B8CCE0]">{subject} · {exam}</p>
          <p className="mt-2 text-5xl font-extrabold">{pct}%</p>
          <p className="mt-1 text-sm text-[#B8CCE0]">{correctCount} of {total} correct · +{correctCount * 5} points</p>
        </div>

        <div className="mt-5 space-y-2">
          {questions.map((q, i) => {
            const ok = answers[i] === q.ans;
            return (
              <div key={i} className="rounded-xl border border-hs-border bg-white p-4">
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${ok ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                    {ok ? <Check size={13} /> : <X size={13} />}
                  </span>
                  <p className="text-sm font-semibold text-hs-navy">{q.q}</p>
                </div>
                <p className="mt-1.5 pl-7 text-xs text-hs-muted">
                  Correct answer: <span className="font-semibold text-green-600">{q.opts[q.ans]}</span>
                  {!ok && answers[i] !== undefined && (
                    <> · You chose: <span className="font-semibold text-red-500">{q.opts[answers[i]]}</span></>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={reset}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-hs-blue py-3.5 font-semibold text-white hover:bg-hs-blueDeep"
        >
          <RotateCcw size={18} /> Practice again
        </button>
      </div>
    </Shell>
  );
}

function Shell({ onBack, title, children }: { onBack: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hs-bg pb-10">
      <header className="bg-hs-navy px-4 pb-5 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold text-white">{title}</h1>
        </div>
      </header>
      {children}
    </div>
  );
}
