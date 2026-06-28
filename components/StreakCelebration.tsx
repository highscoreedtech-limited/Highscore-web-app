"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LottieIcon from "@/components/LottieIcon";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Full-screen daily-streak celebration. Plays a short sequence — flame burst →
 * count-up → "day streak" → weekday tracker — then can be dismissed.
 *
 * Sequence mirrors the reference reel (built original, brand-themed): an orange
 * takeover with our fire animation, animated count and a week progress row.
 */
export default function StreakCelebration({
  count,
  points,
  onDone,
}: {
  count: number;
  points: number;
  onDone: () => void;
}) {
  // Count-up: roll from 0 to the streak value (starts after the flame burst).
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const duration = 1200;
    let raf = 0;
    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setShown(Math.round(eased * count));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => { raf = requestAnimationFrame(tick); }, 450);
    return () => { clearTimeout(delay); cancelAnimationFrame(raf); };
  }, [count]);

  // Auto-dismiss after the sequence has had time to play.
  useEffect(() => {
    const t = setTimeout(onDone, 6000);
    return () => clearTimeout(t);
  }, [onDone]);

  // Real week progress: days before today done, today just completed.
  const todayIdx = new Date().getDay(); // 0 = Sun
  const weekDone = Math.min(count, todayIdx + 1);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden px-8 text-center text-white"
      style={{ background: "linear-gradient(160deg,#FF8A00 0%,#F97A00 45%,#EA6A00 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
    >
      {/* Spark particles */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const dist = 120 + (i % 3) * 40;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-yellow-200"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - 60,
              opacity: [0, 1, 0],
              scale: [0.4, 1, 0.2],
            }}
            transition={{ duration: 1.4, delay: 0.25 + (i % 5) * 0.05, ease: "easeOut" }}
          />
        );
      })}

      {/* Flame */}
      <motion.div
        className="relative h-44 w-44"
        initial={{ scale: 0.2, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <LottieIcon src="/lottie/fire.json" className="h-44 w-44" fallback={<span className="text-8xl">🔥</span>} />
        </motion.div>
      </motion.div>

      {/* Count */}
      <motion.p
        className="mt-2 text-8xl font-extrabold leading-none drop-shadow-[0_4px_14px_rgba(0,0,0,0.2)]"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 14 }}
      >
        {shown}
      </motion.p>
      <motion.p
        className="mt-1 text-xl font-bold tracking-wide text-white/90"
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        day streak
      </motion.p>

      {/* Weekday tracker */}
      <motion.div
        className="mt-8 flex items-center gap-2.5"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        {DAYS.map((d, i) => {
          const done = i < weekDone;
          const isToday = i === todayIdx;
          return (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-semibold text-white/70">{d}</span>
              <motion.span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  isToday
                    ? "bg-white text-[#EA6A00] ring-2 ring-white"
                    : done
                    ? "bg-white/90 text-[#EA6A00]"
                    : "bg-white/20 text-white/60"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 + i * 0.06, type: "spring", stiffness: 300, damping: 16 }}
              >
                {done || isToday ? "✓" : ""}
              </motion.span>
            </div>
          );
        })}
      </motion.div>

      {/* Points + CTA */}
      <motion.div
        className="mt-9 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 font-bold">
          <span className="text-lg">⚡</span> +{points} points earned
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDone(); }}
          className="rounded-full bg-white px-10 py-3.5 font-extrabold text-[#EA6A00] shadow-lg active:scale-95"
        >
          Keep it going
        </button>
      </motion.div>
    </motion.div>
  );
}
