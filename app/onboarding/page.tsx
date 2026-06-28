"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { session } from "@/lib/api";

const ARENA = "#0A1628";
const AMBER = "#EF9F27";

const SLIDES = [
  { svg: "/onboarding/video.svg", title: "Video lessons\nfor every topic", subtitle: "Watch expert-taught videos on any subject, anytime — even offline." },
  { svg: "/onboarding/gaming.svg", title: "Battle friends in\nlive quiz games", subtitle: "Challenge classmates to real-time quizzes and prove who's the champion." },
  { svg: "/onboarding/analytics.svg", title: "Track progress &\nclimb the rank", subtitle: "See exactly where you stand, earn streaks, and watch your score grow." },
];

const SEEN_KEY = "hs_onboarding_seen";

export default function OnboardingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"splash" | "slides">("splash");
  const [index, setIndex] = useState(0); // 0..2 slides, 3 = CTA

  // Splash → route like the mobile splash_screen.
  useEffect(() => {
    const t = setTimeout(() => {
      if (session.isAuthenticated) { router.replace("/dashboard"); return; }
      const seen = typeof window !== "undefined" && localStorage.getItem(SEEN_KEY) === "1";
      if (seen) { router.replace("/login"); return; }
      setPhase("slides");
    }, 2300);
    return () => clearTimeout(t);
  }, [router]);

  const finish = (to: string) => {
    localStorage.setItem(SEEN_KEY, "1");
    router.push(to);
  };

  const isCta = index === SLIDES.length;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: ARENA }}>
      <AnimatePresence mode="wait">
        {phase === "splash" ? (
          <Splash key="splash" />
        ) : (
          <motion.div key="slides" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen flex-col px-6 pb-8 pt-6">
            {/* Skip */}
            <div className="flex justify-end">
              {!isCta && (
                <button onClick={() => finish("/signup")} className="text-sm font-semibold text-white/70">Skip</button>
              )}
            </div>

            {/* Pager */}
            <div className="flex flex-1 items-center justify-center">
              <AnimatePresence mode="wait">
                {isCta ? (
                  <CtaPage key="cta" />
                ) : (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={SLIDES[index].svg} alt="" className="h-64 w-64 object-contain sm:h-72 sm:w-72" />
                    <h2 className="mt-10 whitespace-pre-line text-2xl font-extrabold leading-tight text-white">{SLIDES[index].title}</h2>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">{SLIDES[index].subtitle}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="mb-6 flex justify-center gap-2">
              {Array.from({ length: SLIDES.length + 1 }).map((_, i) => (
                <span key={i} className="h-2 rounded-full transition-all" style={{ width: i === index ? 22 : 8, backgroundColor: i === index ? AMBER : "rgba(255,255,255,0.25)" }} />
              ))}
            </div>

            {/* Actions */}
            {isCta ? (
              <div className="space-y-3">
                <button onClick={() => finish("/signup")} className="w-full rounded-2xl py-4 text-base font-extrabold text-hs-amberDark" style={{ backgroundColor: AMBER }}>Create Account</button>
                <button onClick={() => finish("/login")} className="w-full rounded-2xl border border-white/20 py-4 text-base font-semibold text-white">I already have an account</button>
              </div>
            ) : (
              <button onClick={() => setIndex((i) => i + 1)} className="w-full rounded-2xl py-4 text-base font-extrabold text-hs-amberDark" style={{ backgroundColor: AMBER }}>Next</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Splash (matches mobile splash_screen) ──────────────────────────────────────
function Splash() {
  return (
    <motion.div key="splash" exit={{ opacity: 0 }} className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-[3] items-end" />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative flex h-44 w-44 items-center justify-center"
      >
        {/* Dashed amber ring */}
        <svg className="absolute inset-0 animate-spin" style={{ animationDuration: "12s" }} viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="86" fill="none" stroke={AMBER} strokeWidth="1.5" strokeDasharray="6 9" opacity="0.8" />
        </svg>
        {/* Logo in white circle with amber glow */}
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white p-3" style={{ boxShadow: `0 0 24px 4px ${AMBER}59` }}>
          <Image src="/highscore-logo-final.png" alt="HighScore" width={90} height={90} className="h-full w-full object-contain" priority />
        </div>
      </motion.div>

      <div className="flex flex-[3] items-center" />

      {/* Progress bar */}
      <div className="w-full max-w-xs px-12">
        <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ backgroundColor: "#1E2D47" }}>
          <motion.div className="h-full rounded-full" style={{ backgroundColor: AMBER }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.1, ease: "easeInOut" }} />
        </div>
        <p className="mt-2.5 text-center text-[11px] tracking-[2px] text-[#7A8499]">excellence loading</p>
      </div>
      <div className="flex flex-[2]" />
    </motion.div>
  );
}

function CtaPage() {
  return (
    <motion.div key="cta" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full text-5xl" style={{ backgroundColor: `${AMBER}26`, border: `1px solid ${AMBER}4D` }}>🏆</div>
      <p className="mt-6 text-lg font-bold" style={{ color: AMBER }}>Hey champion,</p>
      <h2 className="mt-1 text-3xl font-extrabold leading-tight text-white">Ready to rise<br />to the top?</h2>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">Join thousands of Nigerian students ascending to the top of their class.</p>
    </motion.div>
  );
}
