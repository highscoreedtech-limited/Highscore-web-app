"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_BANK, QuizQuestion } from "@/lib/quiz-bank";
import { api, presenceWsUrl } from "@/lib/api";
import { useAuth } from "../hooks/useAuth";
import FindPlayers from "./FindPlayers";

// ── Arena palette (matches mobile quiz_constants.dart) ─────────────────────────
const C = {
  bg: "#0E0A08", surf: "#1A1210", surf2: "#241A17",
  brand: "#FF6624", brandDark: "#C03D27", brandLight: "#FF9A62",
  gold: "#F5A623", green: "#2ECC71", red: "#E74C3C",
  text: "#F5EDE8", text2: "#A08070",
};
const KEYS = ["A", "B", "C", "D"];
const SUBJECTS = Object.keys(QUIZ_BANK);

function initials(name: string) {
  const t = name.trim();
  if (!t) return "YO";
  return t.split(" ").map((w) => w[0] || "").slice(0, 2).join("").toUpperCase();
}
function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

// Deterministic shuffle so both players in a room get the same question order.
function seededShuffle<T>(a: T[], seed: number): T[] {
  let s = seed || 1;
  const rng = () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

type Phase = "lobby" | "find" | "countdown" | "battle" | "result";

export default function QuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const myName = user?.first_name ? `${user.first_name}${user.last_name ? " " + user.last_name[0] : ""}` : "You";
  const [oppName, setOppName] = useState("CPU");

  const [phase, setPhase] = useState<Phase>("lobby");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [oppAnswered, setOppAnswered] = useState(false);
  const [oppCorrect, setOppCorrect] = useState(false);
  const [count, setCount] = useState(5);
  const [toast, setToast] = useState<{ emoji: string; title: string; sub: string } | null>(null);
  const [flash, setFlash] = useState<"my" | "opp" | null>(null);

  const correctArr = useRef<boolean[]>([]);
  const ptsArr = useRef<number[]>([]);
  const timesArr = useRef<number[]>([]);
  const qStart = useRef<number>(0);
  const gameTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const oppTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const claimed = useRef(false);
  const [claiming, setClaiming] = useState(false);
  const [didClaim, setDidClaim] = useState(false);

  const clearTimers = () => {
    if (gameTimer.current) clearInterval(gameTimer.current);
    if (oppTimer.current) clearTimeout(oppTimer.current);
    gameTimer.current = null; oppTimer.current = null;
  };
  useEffect(() => () => clearTimers(), []);

  // ── Start / countdown ───────────────────────────────────────────────────────
  const resetGame = () => {
    setCurrentQ(0); setMyScore(0); setOppScore(0); setStreak(0); setMaxCombo(0);
    correctArr.current = []; ptsArr.current = []; timesArr.current = [];
    claimed.current = false; setDidClaim(false);
    setCount(5); setPhase("countdown");
  };

  const startSolo = () => {
    setOppName("CPU");
    setQuestions(shuffle(QUIZ_BANK[subject]).slice(0, 10));
    resetGame();
  };

  // Start a real match when an opponent accepts your challenge (via presence WS).
  const startPvp = useCallback((opponentName: string, subj: string, seed: number) => {
    const bank = QUIZ_BANK[subj] || QUIZ_BANK[Object.keys(QUIZ_BANK)[0]];
    setSubject(subj);
    setOppName(opponentName || "Opponent");
    setQuestions(seededShuffle(bank, seed).slice(0, 10));
    resetGame();
  }, []);

  // Presence WebSocket: listen for the opponent accepting the challenge.
  useEffect(() => {
    if (!user?.id) return;
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(presenceWsUrl(user.id));
      ws.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data);
          if (d.type === "challenge_accepted") {
            startPvp(d.from_name || d.to_name || "Opponent", d.subject || "Mathematics", Number(d.seed) || 0);
          }
        } catch { /* ignore */ }
      };
    } catch { /* presence WS is optional */ }
    return () => { try { ws?.close(); } catch { /* noop */ } };
  }, [user?.id, startPvp]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= -1) { setPhase("battle"); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 850);
    return () => clearTimeout(t);
  }, [phase, count]);

  // ── Load a question (start timers + AI) ─────────────────────────────────────
  const loadQ = useCallback(() => {
    setAnswered(false); setSelectedIdx(null); setOppAnswered(false); setOppCorrect(false);
    setTimeLeft(15); qStart.current = Date.now();

    clearTimers();
    gameTimer.current = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { return 0; } return t - 1; });
    }, 1000);

    // Simulated AI opponent: answers at a random time with ~62% accuracy.
    const delay = 2000 + Math.random() * 7000;
    oppTimer.current = setTimeout(() => {
      setCurrentQ((qi) => {
        const ok = Math.random() < 0.62;
        const remain = Math.max(0, 15 - Math.round(delay / 1000));
        const bonus = remain >= 10 ? 50 : remain >= 5 ? 25 : 0;
        if (ok) { setOppScore((s) => s + 100 + bonus); setFlash("opp"); setTimeout(() => setFlash(null), 450); }
        setOppAnswered(true); setOppCorrect(ok);
        return qi;
      });
    }, delay);
  }, []);

  // Single deterministic loader: fires once when the battle starts (currentQ 0)
  // and once each time we advance to a new question. No duplicate timers/AI.
  useEffect(() => { if (phase === "battle") loadQ(); }, [phase, currentQ, loadQ]);

  // Auto-submit when the per-question timer runs out.
  useEffect(() => {
    if (phase !== "battle" || answered) return;
    if (timeLeft === 0) timeOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, answered]);

  const showFeedback = (emoji: string, title: string, sub: string) => {
    setToast({ emoji, title, sub });
    setTimeout(() => setToast(null), 1500);
  };

  const advance = useCallback(() => {
    setCurrentQ((q) => {
      if (q + 1 >= 10) { setPhase("result"); return q; }
      return q + 1;
    });
  }, []);

  const pick = (idx: number) => {
    if (answered) return;
    clearTimers();
    const elapsed = (Date.now() - qStart.current) / 1000;
    const correctIdx = questions[currentQ].ans;
    const ok = idx === correctIdx;
    let earned = 0, bonus = 0;
    if (ok) {
      bonus = timeLeft >= 10 ? 50 : timeLeft >= 5 ? 25 : 0;
      earned = 100 + bonus;
      setMyScore((s) => s + earned);
      setStreak((st) => { const ns = st + 1; setMaxCombo((m) => Math.max(m, ns)); return ns; });
      setFlash("my"); setTimeout(() => setFlash(null), 450);
    } else {
      setStreak(0);
    }
    setAnswered(true); setSelectedIdx(idx);
    correctArr.current.push(ok); ptsArr.current.push(earned); timesArr.current.push(elapsed);
    if (ok) showFeedback("✅", "Correct!", `+${earned} pts${bonus > 0 ? " (speed bonus!)" : ""}`);
    else showFeedback("❌", "Wrong!", `Correct was ${KEYS[correctIdx]}`);
    setTimeout(advance, 1800);
  };

  const timeOut = () => {
    clearTimers();
    setAnswered(true); setSelectedIdx(null); setStreak(0);
    correctArr.current.push(false); ptsArr.current.push(0); timesArr.current.push(15);
    showFeedback("⏱️", "Time's up!", "");
    setTimeout(advance, 1800);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text, fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
      <div className="mx-auto max-w-xl">
        {phase === "lobby" && (
          <Lobby subject={subject} setSubject={setSubject} myName={myName} onSolo={startSolo} onFind={() => setPhase("find")} onBack={() => router.push("/dashboard")} />
        )}
        {phase === "find" && (
          <FindPlayers subject={subject} onBack={() => setPhase("lobby")} />
        )}
        {phase === "countdown" && (
          <Countdown count={count} myName={myName} oppName={oppName} subject={subject} />
        )}
        {phase === "battle" && questions[currentQ] && (
          <Battle
            q={questions[currentQ]} currentQ={currentQ} myScore={myScore} oppScore={oppScore}
            timeLeft={timeLeft} answered={answered} selectedIdx={selectedIdx}
            oppAnswered={oppAnswered} oppCorrect={oppCorrect} streak={streak}
            myName={myName} oppName={oppName} subject={subject} flash={flash} onPick={pick}
            onQuit={() => { clearTimers(); if (window.confirm("Quit the battle? No points will be awarded.")) router.push("/dashboard"); }}
          />
        )}
        {phase === "result" && (
          <Result
            myScore={myScore} oppScore={oppScore} myName={myName} oppName={oppName}
            correct={correctArr.current} pts={ptsArr.current} times={timesArr.current} maxCombo={maxCombo}
            questions={questions} claiming={claiming} claimed={didClaim}
            onClaim={async (totalXP) => {
              if (claimed.current || totalXP <= 0) return;
              claimed.current = true; setClaiming(true);
              try { await api("/api/quiz/credit", { method: "POST", body: { score: totalXP, total: 10, exam_type: "JAMB", subject } }); setDidClaim(true); }
              catch { claimed.current = false; }
              finally { setClaiming(false); }
            }}
            onRematch={startSolo}
            onHome={() => router.push("/dashboard")}
          />
        )}
      </div>

      {/* Toast overlay */}
      <AnimatePresence>
        {toast && phase === "battle" && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="mx-11 flex flex-col items-center rounded-[28px] px-7 pb-6 pt-7"
              style={{ backgroundColor: C.surf2, border: `1.5px solid ${(toast.emoji === "✅" ? C.green : toast.emoji === "⏱️" ? C.gold : C.red)}59` }}>
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full text-[34px]"
                style={{ backgroundColor: `${toast.emoji === "✅" ? C.green : toast.emoji === "⏱️" ? C.gold : C.red}26` }}>{toast.emoji}</div>
              <p className="mt-3 text-[26px] font-black" style={{ color: toast.emoji === "✅" ? C.green : toast.emoji === "⏱️" ? C.gold : C.red }}>{toast.title}</p>
              {toast.sub && <p className="mt-1.5 text-center text-[13px] font-semibold" style={{ color: C.text2 }}>{toast.sub}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Lobby ─────────────────────────────────────────────────────────────────────
function Lobby({ subject, setSubject, myName, onSolo, onFind, onBack }: { subject: string; setSubject: (s: string) => void; myName: string; onSolo: () => void; onFind: () => void; onBack: () => void; }) {
  return (
    <div className="px-4 pb-6 pt-4">
      {/* Nav row */}
      <div className="flex items-center">
        <button onClick={onBack} className="flex h-[34px] w-[34px] items-center justify-center rounded-full" style={{ backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ color: C.text }}>‹</span>
        </button>
        <span className="ml-3 text-xl font-extrabold" style={{ color: C.text }}>Quiz Battle</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: `${C.gold}1F`, border: `1px solid ${C.gold}4D` }}>
          <motion.span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: C.gold }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <span className="text-[10px] font-bold" style={{ color: C.gold }}>142 ONLINE</span>
        </span>
      </div>

      {/* Header */}
      <h1 className="mt-5 text-[38px] font-black leading-[1.05]" style={{ color: C.text }}>Quiz<br />Battle</h1>
      <p className="mt-1 text-[13px] font-medium" style={{ color: C.text2 }}>PVP Knowledge Arena</p>

      {/* VS card */}
      <div className="relative mt-5 rounded-3xl p-[18px]" style={{ backgroundColor: C.surf, border: `1px solid ${C.brand}26` }}>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[28px] font-black tracking-[4px]" style={{ color: `${C.brand}1F` }}>VS</span>
        <div className="relative flex items-center justify-between">
          <VsPlayer init={initials(myName)} name={myName} sub="⚔️ Ready to battle" you />
          <div className="w-14" />
          <div className="flex flex-col items-center">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[18px]" style={{ backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-t-transparent" style={{ borderColor: `${C.brand} transparent ${C.brand} ${C.brand}` }} />
            </div>
            <p className="mt-2 text-[13px] font-bold" style={{ color: C.text2 }}>Searching...</p>
            <p className="text-[11px]" style={{ color: C.text2 }}>±50 range</p>
          </div>
        </div>
      </div>

      {/* Subject picker */}
      <p className="mt-4 text-[10px] font-bold tracking-[1.2px]" style={{ color: C.text2 }}>CHOOSE SUBJECT</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SUBJECTS.map((s) => {
          const sel = s === subject;
          return (
            <button key={s} onClick={() => setSubject(s)} className="rounded-xl px-3.5 py-2 text-xs font-bold"
              style={{ backgroundColor: sel ? `${C.brand}26` : C.surf2, border: `1px solid ${sel ? `${C.brand}80` : "rgba(255,255,255,0.08)"}`, color: sel ? C.brandLight : C.text2 }}>
              {s}
            </button>
          );
        })}
      </div>

      {/* Info row */}
      <div className="mt-4 flex gap-2.5">
        <InfoBox val="10" lbl="QUESTIONS" />
        <InfoBox val="15s" lbl="PER QUESTION" />
        <InfoBox val="+24" lbl="MAX RATING" gold />
      </div>

      {/* Mode */}
      <p className="mt-5 text-[10px] font-bold tracking-[1.2px]" style={{ color: C.text2 }}>HOW DO YOU WANT TO PLAY?</p>
      <button className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-extrabold text-white"
        style={{ background: "linear-gradient(135deg,#7C3AED,#9F67FF)", boxShadow: "0 6px 16px rgba(124,58,237,0.4)" }}
        onClick={onFind}>
        🌐 Find Players Online ›
      </button>
      <motion.button whileTap={{ scale: 0.98 }} onClick={onSolo}
        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-extrabold text-white"
        style={{ background: `linear-gradient(135deg,${C.brand},${C.brandDark})`, boxShadow: `0 6px 16px ${C.brand}59` }}>
        ⚔️ Quick Solo Battle
      </motion.button>
    </div>
  );
}

function VsPlayer({ init, name, sub, you }: { init: string; name: string; sub: string; you?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[18px] text-lg font-black text-white"
        style={you ? { background: `linear-gradient(135deg,${C.brandDark},${C.brand})` } : { backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.08)" }}>
        {init}
      </div>
      <p className="mt-2 text-[13px] font-bold" style={{ color: C.text }}>{name}</p>
      <p className="text-[11px]" style={{ color: C.text2 }}>{sub}</p>
    </div>
  );
}
function InfoBox({ val, lbl, gold }: { val: string; lbl: string; gold?: boolean }) {
  return (
    <div className="flex-1 rounded-xl py-3 text-center" style={{ backgroundColor: C.surf, border: `1px solid ${C.brand}26` }}>
      <p className="text-lg font-black" style={{ color: gold ? C.brandLight : C.text }}>{val}</p>
      <p className="mt-0.5 text-[9px] font-bold" style={{ color: C.text2 }}>{lbl}</p>
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function Countdown({ count, myName, oppName, subject }: { count: number; myName: string; oppName: string; subject: string; }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <MiniAva init={initials(myName)} name={myName} you />
        <span className="px-4 text-xl font-black" style={{ color: `${C.brand}80` }}>VS</span>
        <MiniAva init={initials(oppName)} name={oppName} />
      </div>
      <p className="mt-2 text-[11px] font-bold tracking-[0.5px]" style={{ color: C.text2 }}>{subject}  ·  AI Match  ·  SS3</p>
      <AnimatePresence mode="popLayout">
        <motion.div key={count} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.4 }}
          className="mt-12 text-[120px] font-black leading-none" style={{ color: C.brand }}>
          {count <= 0 ? "GO!" : count}
        </motion.div>
      </AnimatePresence>
      <p className="mt-4 text-sm font-bold tracking-[2px]" style={{ color: C.text2 }}>GET READY!</p>
    </div>
  );
}
function MiniAva({ init, name, you }: { init: string; name: string; you?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-[14px] text-base font-black"
        style={you ? { background: `linear-gradient(135deg,${C.brandDark},${C.brand})`, color: "#fff" } : { backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.08)", color: C.text2 }}>
        {init}
      </div>
      <p className="mt-1.5 text-[11px] font-bold" style={{ color: C.text2 }}>{name}</p>
    </div>
  );
}

// ── Battle ────────────────────────────────────────────────────────────────────
function Battle({ q, currentQ, myScore, oppScore, timeLeft, answered, selectedIdx, oppAnswered, oppCorrect, streak, myName, oppName, subject, flash, onPick, onQuit }: {
  q: QuizQuestion; currentQ: number; myScore: number; oppScore: number; timeLeft: number; answered: boolean; selectedIdx: number | null;
  oppAnswered: boolean; oppCorrect: boolean; streak: number; myName: string; oppName: string; subject: string; flash: "my" | "opp" | null; onPick: (i: number) => void; onQuit: () => void;
}) {
  const correctIdx = q.ans;
  const circ = 2 * Math.PI * 24;
  return (
    <div>
      {/* Header */}
      <div className="px-4 pb-3 pt-3" style={{ backgroundColor: C.surf }}>
        <div className="mb-2 flex justify-end">
          <button onClick={onQuit} className="flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold" style={{ backgroundColor: C.surf2, color: C.text2, border: "1px solid rgba(255,255,255,0.08)" }}>
            ✕ Quit
          </button>
        </div>
        <div className="flex items-center">
          {/* My score */}
          <div className="flex flex-1 items-center gap-2.5">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] text-[13px] font-black text-white" style={{ background: `linear-gradient(135deg,${C.brandDark},${C.brand})` }}>{initials(myName)}</div>
            <div>
              <p className="text-[11px] font-bold" style={{ color: C.text2 }}>{myName}</p>
              <p className="text-[28px] font-black leading-none" style={{ color: flash === "my" ? C.green : C.text }}>{myScore}</p>
            </div>
          </div>
          {/* Timer */}
          <div className="flex flex-col items-center">
            <div className="relative h-[54px] w-[54px]">
              <svg className="h-[54px] w-[54px] -rotate-90" viewBox="0 0 54 54">
                <circle cx="27" cy="27" r="24" fill="none" strokeWidth="3.5" stroke="rgba(255,255,255,0.06)" />
                <circle cx="27" cy="27" r="24" fill="none" strokeWidth="3.5" strokeLinecap="round"
                  stroke={timeLeft <= 5 ? C.red : C.brand} strokeDasharray={circ} strokeDashoffset={circ * (1 - timeLeft / 15)}
                  style={{ transition: "stroke-dashoffset 0.9s linear" }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-black" style={{ color: timeLeft <= 5 ? C.red : C.text }}>{timeLeft}</span>
            </div>
            <p className="mt-1 text-[9px] font-bold" style={{ color: C.text2 }}>Q {currentQ + 1}/10</p>
          </div>
          {/* Opp score */}
          <div className="flex flex-1 items-center justify-end gap-2.5">
            <div className="text-right">
              <p className="text-[11px] font-bold" style={{ color: C.text2 }}>{oppName}</p>
              <p className="text-[28px] font-black leading-none" style={{ color: flash === "opp" ? C.green : C.text }}>{oppScore}</p>
            </div>
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] text-[13px] font-black" style={{ backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.08)", color: C.text2 }}>{initials(oppName)}</div>
          </div>
        </div>
        {/* Streak bar */}
        <div className="mt-3 flex items-center">
          <span className="text-[10px] font-bold" style={{ color: C.text2 }}>Streak</span>
          <div className="mx-2 flex flex-1 gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[5px] flex-1 rounded-full" style={{ backgroundColor: i < streak ? C.brand : "rgba(255,255,255,0.07)" }} />
            ))}
          </div>
          {streak >= 2 && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-extrabold" style={{ backgroundColor: `${C.gold}1F`, border: `1px solid ${C.gold}4D`, color: C.gold }}>x{streak} COMBO</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-6 pt-3.5">
        {oppAnswered ? (
          <p className="text-[10px] font-bold" style={{ color: C.text2 }}>{oppCorrect ? "✅" : "❌"} {oppName} answered</p>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5" style={{ backgroundColor: C.surf2, border: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="tracking-[2px]" style={{ color: C.text2 }}>•••</span>
            <span className="text-[10px] font-bold" style={{ color: C.text2 }}>{oppName} is thinking…</span>
          </span>
        )}

        <div className="mt-3">
          <span className="rounded-lg px-2.5 py-1 text-[10px] font-extrabold tracking-[0.8px]" style={{ backgroundColor: `${C.brand}1A`, border: `1px solid ${C.brand}33`, color: C.brandLight }}>{subject.toUpperCase()}</span>
        </div>
        <p className="mt-2 text-[11px] font-bold" style={{ color: C.text2 }}>Question {currentQ + 1} of 10</p>
        <p className="mt-1.5 text-base font-semibold leading-[1.55]" style={{ color: C.text }}>{q.q}</p>

        <div className="mt-4 space-y-2.5">
          {q.opts.map((opt, i) => {
            const isSel = selectedIdx === i;
            const timeout = answered && selectedIdx === null;
            const green = answered && ((isSel && i === correctIdx) || (timeout && i === correctIdx));
            const red = answered && isSel && i !== correctIdx;
            const reveal = answered && !isSel && !timeout && i === correctIdx && selectedIdx !== null;
            const borderC = green ? C.green : red ? C.red : reveal ? `${C.green}66` : isSel ? C.brand : "rgba(255,255,255,0.08)";
            const bgC = green ? `${C.green}1F` : red ? `${C.red}1F` : reveal ? `${C.green}0F` : isSel ? `${C.brand}1A` : C.surf;
            const textC = green ? C.green : red ? C.red : reveal ? C.green : C.text;
            const keyBg = green ? C.green : red ? C.red : reveal ? `${C.green}33` : C.surf2;
            const keyTxt = green || red ? "#fff" : reveal ? C.green : C.text2;
            const ic = green ? "✓" : red ? "✗" : reveal ? "✓" : KEYS[i];
            return (
              <button key={i} onClick={() => onPick(i)} disabled={answered}
                className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-left" style={{ backgroundColor: bgC, border: `1px solid ${borderC}` }}>
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-[13px] font-extrabold" style={{ backgroundColor: keyBg, border: "1px solid rgba(255,255,255,0.08)", color: keyTxt }}>{ic}</span>
                <span className="flex-1 text-[13px] font-semibold" style={{ color: textC }}>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Result ────────────────────────────────────────────────────────────────────
function Result({ myScore, oppScore, myName, oppName, correct, pts, times, maxCombo, questions, claiming, claimed, onClaim, onRematch, onHome }: {
  myScore: number; oppScore: number; myName: string; oppName: string; correct: boolean[]; pts: number[]; times: number[]; maxCombo: number;
  questions: QuizQuestion[]; claiming: boolean; claimed: boolean; onClaim: (xp: number) => void; onRematch: () => void; onHome: () => void;
}) {
  const won = myScore > oppScore;
  const draw = myScore === oppScore;
  const nCorr = correct.filter(Boolean).length;
  const acc = Math.round((nCorr / 10) * 100);
  const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  const rDelta = won ? 24 : draw ? 0 : -18;
  const baseXP = won ? 200 : draw ? 100 : 50;
  const comboXP = maxCombo * 20;
  const accXP = Math.round(acc * 0.5);
  const totalXP = baseXP + comboXP + accXP;

  return (
    <div className="pb-6">
      {/* Outcome header */}
      <div className="px-5 pb-5 pt-6 text-center" style={{ borderBottom: "1px solid #2E211D" }}>
        <p className="text-[38px] font-black leading-none" style={{ color: won ? C.gold : draw ? C.brand : C.text2 }}>{won ? "🏆 Victory!" : draw ? "🤝 Draw!" : "😔 Defeat"}</p>
        <p className="mt-1 text-[13px] font-semibold" style={{ color: C.text2 }}>{won ? "You dominated the battle!" : draw ? "Too close to call!" : "Better luck next time"}</p>
        <div className="mt-4 flex items-center">
          <div className="flex-1">
            <p className="text-[11px] font-bold" style={{ color: C.text2 }}>{myName}</p>
            <p className="text-[52px] font-black leading-none" style={{ color: won ? C.gold : C.text }}>{myScore}</p>
          </div>
          <div className="h-[60px] w-px" style={{ backgroundColor: "#2E211D" }} />
          <div className="flex-1">
            <p className="text-[11px] font-bold" style={{ color: C.text2 }}>{oppName}</p>
            <p className="text-[52px] font-black leading-none" style={{ color: C.text }}>{oppScore}</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2" style={{ backgroundColor: C.surf, border: `1px solid ${C.brand}26` }}>
          <span className="text-sm font-bold" style={{ color: C.text2 }}>1,247</span>
          <span className="text-base font-extrabold" style={{ color: rDelta >= 0 ? C.green : C.red }}>→</span>
          <span className="text-base font-extrabold" style={{ color: rDelta >= 0 ? C.green : C.red }}>{1247 + rDelta}</span>
          <span className="text-xs font-bold" style={{ color: rDelta >= 0 ? C.green : C.red }}>({rDelta >= 0 ? "+" : ""}{rDelta})</span>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Stat row */}
        <div className="flex gap-2">
          <StatCard val={`${acc}%`} lbl="Accuracy" />
          <StatCard val={`${avg.toFixed(1)}s`} lbl="Avg speed" />
          <StatCard val={`x${maxCombo}`} lbl="Best combo" gold />
        </div>

        {/* XP card */}
        <div className="mt-3 flex items-center gap-3 rounded-2xl p-4" style={{ background: `linear-gradient(135deg,${C.gold}1F,${C.brand}14)`, border: `1px solid ${C.gold}33` }}>
          <span className="text-[28px]">⚡</span>
          <div>
            <p className="text-[22px] font-black" style={{ color: C.gold }}>+{totalXP} XP</p>
            <p className="text-[11px] font-semibold" style={{ color: C.text2 }}>Experience earned this battle</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {[`Win: +${baseXP}`, `Combo: +${comboXP}`, `Accuracy: +${accXP}`].map((t) => (
                <span key={t} className="rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${C.gold}1A`, color: C.gold }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Claim */}
        <button onClick={() => onClaim(totalXP)} disabled={claimed || claiming}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-extrabold"
          style={claimed ? { backgroundColor: C.surf, border: `1px solid ${C.green}66`, color: C.green } : { background: "linear-gradient(135deg,#047857,#10B981)", color: "#fff", boxShadow: "0 6px 16px rgba(16,185,129,0.4)" }}>
          {claiming ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : claimed ? "✓ Points Claimed" : `★ Claim ${totalXP} Points`}
        </button>

        {/* Review */}
        <p className="mt-3.5 text-xs font-extrabold tracking-[1px]" style={{ color: C.text2 }}>QUESTION REVIEW</p>
        <div className="mt-2.5 space-y-1.5">
          {questions.slice(0, correct.length).map((q, i) => {
            const ok = correct[i];
            const p = pts[i] ?? 0;
            const short = q.q.length > 55 ? q.q.slice(0, 55) + "…" : q.q;
            return (
              <div key={i} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5" style={{ backgroundColor: C.surf }}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ok ? C.green : C.red }} />
                <span className="flex-1 text-[11px] font-semibold leading-[1.4]" style={{ color: C.text }}>{short}</span>
                <span className="text-[11px] font-extrabold" style={{ color: ok ? C.green : C.red }}>{ok ? `+${p}` : "0"}</span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button onClick={onRematch} className="flex-1 rounded-2xl py-4 text-sm font-extrabold text-white" style={{ background: `linear-gradient(135deg,${C.brand},${C.brandDark})`, boxShadow: `0 6px 16px ${C.brand}59` }}>⚔️  Rematch</button>
          <button onClick={onHome} className="flex-1 rounded-2xl py-4 text-sm font-extrabold" style={{ backgroundColor: C.surf, border: "1px solid rgba(255,255,255,0.08)", color: C.text }}>Home</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ val, lbl, gold }: { val: string; lbl: string; gold?: boolean }) {
  return (
    <div className="flex-1 rounded-2xl py-3 text-center" style={{ backgroundColor: C.surf, border: `1px solid ${C.brand}26` }}>
      <p className="text-[22px] font-black leading-none" style={{ color: gold ? C.gold : C.text }}>{val}</p>
      <p className="mt-1 text-[10px] font-bold" style={{ color: C.text2 }}>{lbl}</p>
    </div>
  );
}
