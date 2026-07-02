"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Users, Copy, Check } from "lucide-react";
import { QUIZ_BANK, QuizQuestion } from "@/lib/quiz-bank";
import { useAuth } from "../hooks/useAuth";
import { api, gameApi, OnlineUser } from "@/lib/api";

const WS = "wss://highscore-mobile-production.up.railway.app";
const SUBJECTS = Object.keys(QUIZ_BANK);
const KEYS = ["A", "B", "C", "D"];
const C = {
  bg: "#120C0A", surf: "#1A1210", surf2: "#241A17", brand: "#FF6624",
  brandDark: "#C03D27", brandLight: "#FF9A62", green: "#2ECC71", text: "#F5EDE8", text2: "#A08070",
};

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

interface Player { id: string; name: string; score: number; rank?: number }
type Screen = "entry" | "lobby" | "battle" | "result";

export default function ArenaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const myId = user?.id || "";
  const myName = user?.first_name ? `${user.first_name}${user.last_name ? " " + user.last_name[0] : ""}` : "You";

  const [screen, setScreen] = useState<Screen>("entry");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [code, setCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [hostId, setHostId] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [count, setCount] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [friends, setFriends] = useState<OnlineUser[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const answeredRef = useRef(false);
  const qRef = useRef(0);

  const joinedRef = useRef(false);
  const clearTimer = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
  const closeWs = () => { try { wsRef.current?.close(); } catch { /* ignore */ } wsRef.current = null; };
  useEffect(() => () => { clearTimer(); closeWs(); }, []);

  const send = (v: object) => { try { wsRef.current?.send(JSON.stringify(v)); } catch { /* ignore */ } };

  const startTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(15); answeredRef.current = false; setAnswered(false); setSelectedIdx(null);
    timer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          if (!answeredRef.current) { answeredRef.current = true; setAnswered(true); send({ type: "answer", qi: qRef.current, correct: false, pts: 0 }); }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const handle = useCallback((m: Record<string, unknown>) => {
    switch (m.type) {
      case "lobby":
        setPlayers((m.players as Player[]) || []);
        setHostId(String(m.host_id || ""));
        setScreen((s) => (s === "battle" || s === "result" ? s : "lobby"));
        break;
      case "countdown":
        setCount(Number(m.value));
        break;
      case "game_start": {
        const subj = String(m.subject || subject);
        const bank = QUIZ_BANK[subj] || QUIZ_BANK[SUBJECTS[0]];
        setSubject(subj);
        setQuestions(seededShuffle(bank, Number(m.seed) || 1).slice(0, 10));
        setCurrentQ(0); qRef.current = 0; setCount(null); setScreen("battle");
        startTimer();
        break;
      }
      case "scoreboard":
        setPlayers((m.players as Player[]) || []);
        break;
      case "next_question":
        setCurrentQ(Number(m.qi)); qRef.current = Number(m.qi);
        startTimer();
        break;
      case "game_over":
        clearTimer();
        setPlayers((m.players as Player[]) || []);
        setScreen("result");
        break;
      case "full":
        toast.error("That battle is full or already started.");
        closeWs();
        break;
    }
  }, [subject, startTimer]);

  const connect = useCallback((arenaCode: string) => {
    closeWs();
    const ws = new WebSocket(`${WS}/ws/arena/${arenaCode}?user_id=${encodeURIComponent(myId)}&name=${encodeURIComponent(myName)}`);
    wsRef.current = ws;
    ws.onmessage = (ev) => { try { handle(JSON.parse(ev.data as string)); } catch { /* ignore */ } };
    ws.onclose = () => { if (wsRef.current === ws) wsRef.current = null; };
  }, [myId, myName, handle]);

  const create = async () => {
    setBusy(true);
    try {
      const d = await api<{ code: string }>("/api/arena/create", { method: "POST", body: { subject } });
      setCode(d.code); connect(d.code);
    } catch { toast.error("Could not create the battle."); } finally { setBusy(false); }
  };

  const join = async () => {
    const c = joinCode.trim().toUpperCase();
    if (c.length < 4) { toast.error("Enter a valid code."); return; }
    setBusy(true);
    try {
      await api(`/api/arena/${c}`);
      setCode(c); connect(c);
    } catch { toast.error("Battle not found. Check the code."); } finally { setBusy(false); }
  };

  const start = () => send({ type: "start" });

  // Load friends (to invite) and auto-join if arriving from an invite (?join=CODE).
  useEffect(() => {
    if (!myId) return;
    gameApi.friends().then((f) => setFriends(Array.isArray(f) ? f : [])).catch(() => {});
    if (joinedRef.current) return;
    const p = new URLSearchParams(window.location.search).get("join");
    if (p) { joinedRef.current = true; const cc = p.toUpperCase(); setCode(cc); connect(cc); }
  }, [myId, connect]);

  const invite = async (u: OnlineUser) => {
    try { await gameApi.arenaInvite(code, u.id); toast.success(`Invited ${u.first_name || "friend"} 👋`); }
    catch { toast.error("Could not invite."); }
  };

  const pick = (idx: number) => {
    if (answeredRef.current) return;
    const q = questions[currentQ];
    if (!q) return;
    clearTimer();
    const ok = idx === q.ans;
    const bonus = timeLeft >= 10 ? 50 : timeLeft >= 5 ? 25 : 0;
    const pts = ok ? 100 + bonus : 0;
    answeredRef.current = true; setAnswered(true); setSelectedIdx(idx);
    send({ type: "answer", qi: currentQ, correct: ok, pts });
  };

  const leave = () => { closeWs(); router.push("/quiz"); };
  const copyCode = () => { navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }).catch(() => {}); };

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const isHost = hostId === myId;

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text, fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
      <div className="mx-auto max-w-xl px-4 pb-10 pt-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={leave} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: C.surf2, color: C.text }}><ArrowLeft size={16} /></button>
          <span className="text-xl font-extrabold">Group Battle</span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ backgroundColor: `${C.brand}22`, color: C.brandLight }}><Users size={13} /> {players.length}/8</span>
        </div>

        {/* ── Entry ── */}
        {screen === "entry" && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl p-5" style={{ backgroundColor: C.surf }}>
              <p className="text-sm font-bold">Create a battle</p>
              <p className="mt-1 text-xs" style={{ color: C.text2 }}>Pick a subject, then share the code with friends (up to 8 players).</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {SUBJECTS.slice(0, 6).map((s) => (
                  <button key={s} onClick={() => setSubject(s)} className="rounded-xl px-3 py-2.5 text-xs font-bold"
                    style={subject === s ? { backgroundColor: `${C.brand}33`, border: `1px solid ${C.brand}`, color: C.brandLight } : { backgroundColor: C.surf2, color: C.text2 }}>{s}</button>
                ))}
              </div>
              <button onClick={create} disabled={busy} className="mt-4 w-full rounded-full py-3 text-sm font-extrabold text-white disabled:opacity-50" style={{ background: `linear-gradient(135deg,${C.brand},${C.brandDark})` }}>Create battle</button>
            </div>

            <div className="rounded-2xl p-5" style={{ backgroundColor: C.surf }}>
              <p className="text-sm font-bold">Join with a code</p>
              <div className="mt-3 flex gap-2">
                <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" maxLength={5}
                  className="flex-1 rounded-xl px-4 py-3 text-center text-lg font-extrabold tracking-[0.3em] outline-none" style={{ backgroundColor: C.surf2, color: C.text }} />
                <button onClick={join} disabled={busy} className="rounded-xl px-5 text-sm font-bold text-white disabled:opacity-50" style={{ backgroundColor: C.brand }}>Join</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Lobby ── */}
        {screen === "lobby" && (
          <div className="mt-8">
            <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: C.surf }}>
              <p className="text-xs font-semibold" style={{ color: C.text2 }}>SHARE THIS CODE</p>
              <button onClick={copyCode} className="mt-2 inline-flex items-center gap-2">
                <span className="text-4xl font-black tracking-[0.3em]" style={{ color: C.brandLight }}>{code}</span>
                {copied ? <Check size={18} style={{ color: C.green }} /> : <Copy size={16} style={{ color: C.text2 }} />}
              </button>
              {count !== null && <p className="mt-3 text-lg font-extrabold" style={{ color: C.brand }}>{count > 0 ? `Starting in ${count}…` : "GO!"}</p>}
            </div>

            <p className="mt-6 text-sm font-bold">Players ({players.length})</p>
            <div className="mt-3 space-y-2">
              {sorted.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: C.surf, border: p.id === myId ? `1px solid ${C.brand}66` : "1px solid transparent" }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: C.surf2, color: C.brandLight }}>{p.name[0]?.toUpperCase()}</span>
                  <span className="flex-1 text-sm font-semibold">{p.name}{p.id === myId ? " (you)" : ""}</span>
                  {p.id === hostId && <span className="rounded-md px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${C.brand}26`, color: C.brandLight }}>HOST</span>}
                </div>
              ))}
            </div>

            {/* Invite friends */}
            <p className="mt-6 text-sm font-bold">Invite friends</p>
            {friends.length === 0 ? (
              <p className="mt-2 text-xs" style={{ color: C.text2 }}>No friends yet. Add some from Find Players.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {friends.map((f) => {
                  const already = players.some((p) => p.id === f.id);
                  return (
                    <div key={f.id} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: C.surf2, color: C.brandLight }}>{(f.first_name || "?")[0]?.toUpperCase()}</span>
                      <span className="flex-1 truncate text-sm font-semibold">{`${f.first_name ?? ""} ${f.last_name ?? ""}`.trim() || "Friend"}</span>
                      <button onClick={() => !already && invite(f)} disabled={already} className="rounded-full px-3.5 py-1.5 text-xs font-bold" style={already ? { backgroundColor: C.surf2, color: C.text2 } : { backgroundColor: `${C.brand}33`, color: C.brandLight, border: `1px solid ${C.brand}66` }}>{already ? "Joined" : "Invite"}</button>
                    </div>
                  );
                })}
              </div>
            )}

            {isHost ? (
              <button onClick={start} disabled={players.length < 2 || count !== null} className="mt-6 w-full rounded-full py-3.5 text-sm font-extrabold text-white disabled:opacity-40" style={{ background: `linear-gradient(135deg,${C.brand},${C.brandDark})` }}>
                {players.length < 2 ? "Waiting for players…" : "Start battle ⚔️"}
              </button>
            ) : (
              <p className="mt-6 text-center text-sm" style={{ color: C.text2 }}>Waiting for the host to start…</p>
            )}
          </div>
        )}

        {/* ── Battle ── */}
        {screen === "battle" && questions[currentQ] && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs" style={{ color: C.text2 }}>
              <span>Question {currentQ + 1} / 10</span>
              <span className="font-bold" style={{ color: timeLeft <= 5 ? C.brand : C.text2 }}>⏱ {timeLeft}s</span>
            </div>
            {/* Live leaderboard */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
              {sorted.map((p, i) => (
                <div key={p.id} className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ backgroundColor: p.id === myId ? `${C.brand}33` : C.surf2, color: p.id === myId ? C.brandLight : C.text2 }}>
                  <span>{i === 0 ? "👑" : `#${i + 1}`}</span>{p.name.split(" ")[0]} <span style={{ color: C.text }}>{p.score}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl p-5" style={{ backgroundColor: C.surf }}>
              <p className="text-base font-bold leading-snug">{questions[currentQ].q}</p>
            </div>
            <div className="mt-3 space-y-2.5">
              {questions[currentQ].opts.map((opt, i) => {
                const correctIdx = questions[currentQ].ans;
                const show = answered;
                const isRight = i === correctIdx;
                const isPicked = i === selectedIdx;
                let bg = C.surf, border = "1px solid rgba(255,255,255,0.08)";
                if (show && isRight) { bg = `${C.green}26`; border = `1px solid ${C.green}`; }
                else if (show && isPicked && !isRight) { bg = "#E7484826"; border = "1px solid #E74848"; }
                return (
                  <button key={i} onClick={() => pick(i)} disabled={answered} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold disabled:cursor-default" style={{ backgroundColor: bg, border }}>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: C.surf2, color: C.brandLight }}>{KEYS[i]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && <p className="mt-4 text-center text-sm" style={{ color: C.text2 }}>Waiting for the round to advance…</p>}
          </div>
        )}

        {/* ── Result ── */}
        {screen === "result" && (
          <div className="mt-8 text-center">
            <span className="text-6xl">🏆</span>
            <p className="mt-3 text-2xl font-black">Battle over!</p>
            <div className="mt-6 space-y-2 text-left">
              {sorted.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl p-3.5" style={{ backgroundColor: i === 0 ? `${C.brand}22` : C.surf, border: p.id === myId ? `1px solid ${C.brand}66` : "1px solid transparent" }}>
                  <span className="w-7 text-center text-lg font-black" style={{ color: i === 0 ? C.brandLight : C.text2 }}>{i === 0 ? "👑" : i + 1}</span>
                  <span className="flex-1 font-bold">{p.name}{p.id === myId ? " (you)" : ""}</span>
                  <span className="font-extrabold" style={{ color: C.brandLight }}>{p.score}</span>
                </div>
              ))}
            </div>
            <button onClick={leave} className="mt-7 w-full rounded-full py-3.5 text-sm font-extrabold text-white" style={{ background: `linear-gradient(135deg,${C.brand},${C.brandDark})` }}>Back to Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}
