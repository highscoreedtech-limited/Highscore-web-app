"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { realtime } from "@/lib/realtime/client";
import { gameApi } from "@/lib/api";
import { useAuth } from "@/app/hooks/useAuth";

interface Incoming {
  challenge_id: string;
  from_name: string;
  subject: string;
  seed: number;
  room_code: string;
}

/**
 * App-wide listener for incoming quiz-battle challenges. The web previously only
 * listened for "challenge_accepted" (the sender side), so a challenged player
 * never saw the invite. This shows an Accept/Decline prompt anywhere in the app.
 */
export default function IncomingChallengeWatcher() {
  const { user } = useAuth();
  const router = useRouter();
  const [inc, setInc] = useState<Incoming | null>(null);
  const [arena, setArena] = useState<{ code: string; from: string; subject: string } | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    realtime.connect(user.id);
    const off = realtime.on("challenge_received", (d: Record<string, unknown>) => {
      setInc({
        challenge_id: String(d.challenge_id ?? ""),
        from_name: String(d.from_name ?? "Someone"),
        subject: String(d.subject ?? "Mathematics"),
        seed: Number(d.seed) || 0,
        room_code: String(d.room_code ?? ""),
      });
    });
    const offA = realtime.on("arena_invite", (d: Record<string, unknown>) => {
      setArena({ code: String(d.code ?? ""), from: String(d.from_name ?? "A friend"), subject: String(d.subject ?? "Mathematics") });
    });
    return () => { off(); offA(); };
  }, [user?.id]);

  // Auto-dismiss if ignored.
  useEffect(() => {
    if (!inc) return;
    const t = setTimeout(() => setInc(null), 30000);
    return () => clearTimeout(t);
  }, [inc]);
  useEffect(() => {
    if (!arena) return;
    const t = setTimeout(() => setArena(null), 30000);
    return () => clearTimeout(t);
  }, [arena]);

  const accept = async () => {
    if (!inc) return;
    const c = inc;
    setInc(null);
    try { await gameApi.respondChallenge(c.challenge_id, true); } catch { /* ignore */ }
    // Hand the battle off to the quiz page: sessionStorage covers a fresh mount,
    // the window event covers already being on /quiz (same-route nav won't remount).
    const detail = { seed: c.seed, subject: c.subject, opp: c.from_name, roomCode: c.room_code };
    try { sessionStorage.setItem("hs_pending_battle", JSON.stringify(detail)); } catch { /* ignore */ }
    router.push("/quiz");
    // Fire after navigation so an already-mounted quiz page picks it up.
    setTimeout(() => window.dispatchEvent(new CustomEvent("hs:start-battle", { detail })), 60);
  };

  const decline = async () => {
    if (!inc) return;
    const c = inc;
    setInc(null);
    try { await gameApi.respondChallenge(c.challenge_id, false); } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {inc && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl bg-[#1A1210] p-6 text-center text-white ring-1 ring-white/10"
            initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <span className="text-5xl">⚔️</span>
            <p className="mt-3 text-xl font-extrabold">Battle invite!</p>
            <p className="mt-1.5 text-sm text-[#A08070]">
              <span className="font-bold text-[#FF9A62]">{inc.from_name}</span> challenged you to a{" "}
              <span className="font-bold text-white">{inc.subject}</span> quiz battle.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={decline} className="flex-1 rounded-full bg-white/10 py-3 text-sm font-bold text-[#A08070]">Decline</button>
              <button onClick={accept} className="flex-1 rounded-full py-3 text-sm font-extrabold text-white" style={{ background: "linear-gradient(135deg,#FF6624,#C03D27)" }}>Accept ⚔️</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {arena && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl bg-[#1A1210] p-6 text-center text-white ring-1 ring-white/10"
            initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <span className="text-5xl">👥</span>
            <p className="mt-3 text-xl font-extrabold">Group battle invite!</p>
            <p className="mt-1.5 text-sm text-[#A08070]">
              <span className="font-bold text-[#FF9A62]">{arena.from}</span> invited you to a{" "}
              <span className="font-bold text-white">{arena.subject}</span> group battle.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setArena(null)} className="flex-1 rounded-full bg-white/10 py-3 text-sm font-bold text-[#A08070]">Later</button>
              <button onClick={() => { const a = arena; setArena(null); router.push(`/arena?join=${a.code}`); }} className="flex-1 rounded-full py-3 text-sm font-extrabold text-white" style={{ background: "linear-gradient(135deg,#0EA5E9,#2563EB)" }}>Join 👥</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
