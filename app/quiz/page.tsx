"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Zap, Trophy, Clock, Check, X, RotateCcw, ArrowLeft, Users } from "lucide-react";
import { QUIZ_BANK, QuizQuestion } from "@/lib/quiz-bank";
import { api } from "@/lib/api";

type Phase = "lobby" | "countdown" | "battle" | "result";
const SUBJECTS = Object.keys(QUIZ_BANK);
const PER_Q_SECS = 15;
const POINTS_PER_CORRECT = 10;

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

export default function QuizPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("lobby");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(PER_Q_SECS);
  const [count, setCount] = useState(5);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const credited = useRef(false);

  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
  useEffect(() => () => stop(), []);

  const start = () => {
    setQuestions(shuffle(QUIZ_BANK[subject]).slice(0, 10));
    setCurrent(0); setScore(0); setCorrect(0); setPicked(null);
    credited.current = false;
    setCount(5);
    setPhase("countdown");
  };

  // Countdown 5..1
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) { setPhase("battle"); setTimeLeft(PER_Q_SECS); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [phase, count]);

  const next = useCallback(() => {
    setPicked(null);
    setCurrent((c) => {
      if (c + 1 >= questions.length) { setPhase("result"); return c; }
      setTimeLeft(PER_Q_SECS);
      return c + 1;
    });
  }, [questions.length]);

  const answer = useCallback((idx: number | null) => {
    if (picked !== null) return;
    stop();
    setPicked(idx ?? -1);
    const right = idx !== null && idx === questions[current]?.ans;
    if (right) {
      setCorrect((n) => n + 1);
      setScore((s) => s + POINTS_PER_CORRECT + Math.round((timeLeft / PER_Q_SECS) * 5));
    }
    setTimeout(next, 1100);
  }, [picked, questions, current, timeLeft, next]);

  // Per-question timer
  useEffect(() => {
    if (phase !== "battle" || picked !== null) return;
    timer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { answer(null); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => stop();
  }, [phase, current, picked, answer]);

  // Credit on result
  useEffect(() => {
    if (phase !== "result" || credited.current) return;
    credited.current = true;
    api("/api/quiz/credit", { method: "POST", body: { score: correct * POINTS_PER_CORRECT, total: questions.length, exam_type: "JAMB", subject } }).catch(() => {});
  }, [phase, correct, questions.length, subject]);

  return (
    <div className="min-h-screen bg-[#0E0A08] text-[#F5EDE8]">
      <div className="mx-auto max-w-xl px-4 py-5">
        {phase === "lobby" && (
          <Lobby subject={subject} setSubject={setSubject} onStart={start} onBack={() => router.push("/dashboard")} />
        )}

        {phase === "countdown" && (
          <div className="flex min-h-[80vh] flex-col items-center justify-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#A08070]">{subject} battle</p>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={count}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 text-8xl font-extrabold text-[#FF6624]"
              >
                {count === 0 ? "GO" : count}
              </motion.div>
            </AnimatePresence>
            <p className="mt-6 text-[#A08070]">Get ready…</p>
          </div>
        )}

        {phase === "battle" && questions[current] && (
          <Battle
            q={questions[current]}
            index={current}
            total={questions.length}
            score={score}
            timeLeft={timeLeft}
            picked={picked}
            onAnswer={answer}
          />
        )}

        {phase === "result" && (
          <Result
            subject={subject}
            correct={correct}
            total={questions.length}
            score={score}
            onAgain={() => setPhase("lobby")}
            onBack={() => router.push("/dashboard")}
          />
        )}
      </div>
    </div>
  );
}

function Lobby({ subject, setSubject, onStart, onBack }: { subject: string; setSubject: (s: string) => void; onStart: () => void; onBack: () => void; }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#A08070]"><ArrowLeft size={16} /> Back</button>
      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6624]/15 text-[#FF6624]"><Swords size={26} /></span>
        <div>
          <h1 className="text-2xl font-extrabold">Quiz Arena</h1>
          <p className="text-sm text-[#A08070]">10 questions · beat the clock · earn points</p>
        </div>
      </div>

      <p className="mt-8 text-sm font-semibold text-[#A08070]">Pick a subject</p>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className={`rounded-xl border px-3 py-4 text-sm font-bold transition-colors ${subject === s ? "border-[#FF6624] bg-[#FF6624]/15 text-[#FF9A62]" : "border-[#241A17] bg-[#1A1210] text-[#F5EDE8]"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6624] py-4 text-base font-extrabold text-white shadow-lg shadow-[#FF6624]/30"
      >
        <Zap size={20} /> Start Solo Game
      </motion.button>

      <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#241A17] bg-[#1A1210] py-4 text-sm font-semibold text-[#A08070]">
        <Users size={18} /> Challenge a friend (PVP) — coming soon
      </div>
    </div>
  );
}

function Battle({ q, index, total, score, timeLeft, picked, onAnswer }: {
  q: QuizQuestion; index: number; total: number; score: number; timeLeft: number; picked: number | null; onAnswer: (i: number) => void;
}) {
  const low = timeLeft <= 5;
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#1A1210] px-3 py-1 text-xs font-bold text-[#A08070]">Q{index + 1}/{total}</span>
        <span className="flex items-center gap-1.5 rounded-full bg-[#FF6624]/15 px-3 py-1 text-sm font-extrabold text-[#FF9A62]"><Trophy size={14} /> {score}</span>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold ${low ? "bg-[#E74C3C] text-white" : "bg-[#1A1210] text-[#F5EDE8]"}`}><Clock size={14} /> {timeLeft}s</span>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#241A17]">
        <motion.div className="h-full rounded-full bg-[#FF6624]" animate={{ width: `${(timeLeft / PER_Q_SECS) * 100}%` }} transition={{ ease: "linear", duration: 0.9 }} />
      </div>

      <motion.div key={index} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-[#1A1210] p-5">
        <p className="text-lg font-bold leading-snug">{q.q}</p>
      </motion.div>

      <div className="mt-4 space-y-2.5">
        {q.opts.map((opt, i) => {
          const isAns = i === q.ans;
          const isPicked = picked === i;
          let cls = "border-[#241A17] bg-[#1A1210] text-[#F5EDE8]";
          if (picked !== null) {
            if (isAns) cls = "border-[#2ECC71] bg-[#2ECC71]/15 text-[#2ECC71]";
            else if (isPicked) cls = "border-[#E74C3C] bg-[#E74C3C]/15 text-[#E74C3C]";
            else cls = "border-[#241A17] bg-[#1A1210] text-[#A08070]";
          }
          return (
            <motion.button
              key={i}
              whileTap={{ scale: picked === null ? 0.99 : 1 }}
              disabled={picked !== null}
              onClick={() => onAnswer(i)}
              className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-semibold ${cls}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs">{String.fromCharCode(65 + i)}</span>
              <span className="flex-1">{opt}</span>
              {picked !== null && isAns && <Check size={18} />}
              {picked !== null && isPicked && !isAns && <X size={18} />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Result({ subject, correct, total, score, onAgain, onBack }: {
  subject: string; correct: number; total: number; score: number; onAgain: () => void; onBack: () => void;
}) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const win = pct >= 70;
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FF6624]/15 text-5xl">{win ? "🏆" : "💪"}</span>
      </motion.div>
      <h1 className="mt-5 text-3xl font-extrabold">{win ? "Victory!" : "Good effort!"}</h1>
      <p className="mt-1 text-sm text-[#A08070]">{subject} battle complete</p>

      <div className="mt-7 grid w-full grid-cols-3 gap-3">
        <Stat value={`${pct}%`} label="Accuracy" />
        <Stat value={`${correct}/${total}`} label="Correct" />
        <Stat value={`+${score}`} label="Points" highlight />
      </div>

      <button onClick={onAgain} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6624] py-4 font-extrabold text-white">
        <RotateCcw size={18} /> Play again
      </button>
      <button onClick={onBack} className="mt-3 w-full rounded-2xl border border-[#241A17] bg-[#1A1210] py-4 font-semibold text-[#A08070]">
        Back to dashboard
      </button>
    </div>
  );
}

function Stat({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl bg-[#1A1210] py-4">
      <p className={`text-xl font-extrabold ${highlight ? "text-[#F5A623]" : "text-[#F5EDE8]"}`}>{value}</p>
      <p className="mt-0.5 text-[11px] text-[#A08070]">{label}</p>
    </div>
  );
}
