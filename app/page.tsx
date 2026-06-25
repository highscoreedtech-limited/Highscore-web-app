"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  PlayCircle, Laptop, Gamepad2, Medal, LineChart, Gift,
  ArrowRight, Check, Menu, X, GraduationCap, Play, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Reveal, stagger, item } from "@/components/Reveal";
import LottieIcon from "@/components/LottieIcon";

const FEATURES = [
  { icon: PlayCircle, lottie: "/lottie/video-player.json", title: "Video lessons", desc: "Bite-sized lessons for every JAMB, WAEC & NECO topic, taught by top teachers.", color: "#185FA5", bg: "#E6F1FB" },
  { icon: Laptop, lottie: "/lottie/cbt.json", title: "CBT practice", desc: "Real exam-style computer-based tests with instant scoring and explanations.", color: "#185FA5", bg: "#E6F1FB" },
  { icon: Gamepad2, lottie: "/lottie/quiz-games.json", title: "Quiz battles", desc: "Challenge friends in live 1-v-1 quiz games and climb the ranks.", color: "#854F0B", bg: "#FAEEDA" },
  { icon: Medal, lottie: "/lottie/chart-growup.json", title: "Leaderboards", desc: "Compete with students across Nigeria and earn your spot at the top.", color: "#854F0B", bg: "#FAEEDA" },
  { icon: LineChart, lottie: "/lottie/graph.json", title: "Analytics", desc: "Track your progress, spot weak topics and study smarter, not harder.", color: "#185FA5", bg: "#E6F1FB" },
  { icon: Gift, lottie: "/lottie/reward.json", title: "Rewards", desc: "Earn points and streaks as you learn — and turn them into real rewards.", color: "#854F0B", bg: "#FAEEDA" },
];

const PLANS = [
  { label: "Free Trial", price: "₦0", per: "", note: "2 days of full access", cta: "Start free trial", popular: false },
  { label: "Weekly", price: "₦650", per: "/wk", note: "₦93/day · manual or auto-renew", cta: "Choose weekly", popular: false },
  { label: "Monthly", price: "₦2,100", per: "/mo", note: "₦70/day · save ₦712 vs weekly", cta: "Choose monthly", popular: true },
];

const PLAN_FEATURES = [
  "Access to all 9 subjects",
  "Unlimited CBT practice questions",
  "Real-time multiplayer quiz battles",
  "Detailed performance analytics",
  "Download study materials (PDF & video)",
  "Daily streak rewards & points",
  "JAMB, WAEC, NECO, GCE & Nursing past questions",
  "Live leaderboard ranking",
  "Referral rewards & scholarship access",
];

const LIBRARY = [
  { subject: "English Language", topic: "Comprehension & Summary", img: "/english.jpg" },
  { subject: "Mathematics", topic: "Quadratic Equations", img: "/maths.jpg" },
  { subject: "Physics", topic: "The Velocity–Time Graph", img: "/physics.jpg" },
  { subject: "Chemistry", topic: "The Mole Concept", img: "/chem.jpg" },
  { subject: "Biology", topic: "Immunity & Defence", img: "/study-background.jpg" },
  { subject: "Economics", topic: "Demand & Supply", img: "/ai.jpg" },
];

export default function MarketingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slide = (dir: number) => sliderRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white font-sans text-hs-body">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-hs-border bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
          <Image src="/highscore-logo-final.png" alt="HighScore" width={200} height={52} className="h-12 w-auto object-contain lg:h-14" priority />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-hs-navy hover:text-hs-blue">Features</a>
            <a href="#library" className="text-sm font-medium text-hs-navy hover:text-hs-blue">Video library</a>
            <a href="#pricing" className="text-sm font-medium text-hs-navy hover:text-hs-blue">Pricing</a>
            <Link href="/blog" className="text-sm font-medium text-hs-navy hover:text-hs-blue">Blog</Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-hs-navy hover:bg-hs-bg">Log in</Link>
            <Link href="/signup" className="rounded-full bg-hs-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-hs-blueDeep">Get started</Link>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-hs-border bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#features" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-hs-navy">Features</a>
              <a href="#library" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-hs-navy">Video library</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-hs-navy">Pricing</a>
              <Link href="/blog" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-hs-navy">Blog</Link>
              <Link href="/login" className="rounded-full border border-hs-border px-4 py-2 text-center text-sm font-semibold text-hs-navy">Log in</Link>
              <Link href="/signup" className="rounded-full bg-hs-blue px-4 py-2 text-center text-sm font-semibold text-white">Get started</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-hs-blueTint px-3 py-1 text-xs font-semibold text-hs-blue">
              <GraduationCap size={14} /> JAMB · WAEC · NECO · Post-UTME
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-hs-navy lg:text-5xl">
              Pass your exams with <span className="text-hs-blue">confidence.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-hs-muted">
              Nigeria&apos;s smartest learning app — video lessons, CBT practice, quiz battles
              and leaderboards, all in one place. Study smarter and score higher.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-hs-amber px-6 py-3 font-semibold text-hs-amberDark">
                  Start learning free <ArrowRight size={18} />
                </Link>
              </motion.div>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-hs-border px-6 py-3 font-semibold text-hs-navy hover:bg-hs-bg">
                I have an account
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-hs-muted">
              <span className="flex items-center gap-1.5"><Check size={16} className="text-hs-blue" /> 10 core subjects</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-hs-blue" /> Thousands of past questions</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-hs-blue" /> Learn anywhere</span>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="overflow-hidden rounded-3xl border-4 border-white shadow-[0_30px_70px_-15px_rgba(4,44,83,0.55)] ring-1 ring-hs-border">
              <Image src="/hero-students-computers.png" alt="Students learning with HighScore" width={720} height={540} className="h-full w-full object-cover" priority />
            </div>
            <motion.div
              className="absolute -bottom-4 -left-4 hidden items-center gap-2 rounded-2xl bg-hs-navy px-4 py-3 text-white shadow-lg sm:flex"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-sm font-bold">7-day streak</p>
                <p className="text-[11px] text-[#B8CCE0]">keep it going!</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-hs-border bg-hs-bg">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center sm:grid-cols-4 lg:px-8">
          {[["50k+", "Past questions"], ["10", "Core subjects"], ["1-v-1", "Quiz battles"], ["24/7", "Learn anytime"]].map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.06}>
              <p className="text-2xl font-extrabold text-hs-navy lg:text-3xl">{v}</p>
              <p className="mt-1 text-sm text-hs-muted">{l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-hs-navy lg:text-4xl">Everything you need to ace it</h2>
          <p className="mt-3 text-hs-muted">One app for lessons, practice, competition and tracking — built for Nigerian students.</p>
        </Reveal>
        <motion.div
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={item}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-2xl border border-hs-border bg-white p-6 shadow-[0_10px_30px_-8px_rgba(4,44,83,0.16)] hover:shadow-[0_22px_44px_-12px_rgba(4,44,83,0.28)]"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: f.bg }}>
                  <LottieIcon
                    src={f.lottie}
                    className="h-11 w-11"
                    fallback={<Icon size={24} style={{ color: f.color }} />}
                  />
                </span>
                <h3 className="mt-4 text-lg font-bold text-hs-navy">{f.title}</h3>
                <p className="mt-1.5 text-sm text-hs-muted">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Video library */}
      <section id="library" className="bg-hs-navy py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-hs-amber">
              <Play size={13} /> Video library
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-white lg:text-4xl">Dive into our vast video library</h2>
            <p className="mt-3 text-[#B8CCE0]">Animated, exam-focused lessons across every subject we cover — from English to Further Maths.</p>
          </Reveal>

          <div className="relative mt-12">
            {/* Slider arrows (desktop) */}
            <button
              onClick={() => slide(-1)}
              aria-label="Previous"
              className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2.5 text-hs-navy shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-hs-bg lg:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => slide(1)}
              aria-label="Next"
              className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2.5 text-hs-navy shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-hs-bg lg:flex"
            >
              <ChevronRight size={20} />
            </button>

            <div
              ref={sliderRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {LIBRARY.map((v) => (
                <motion.div
                  key={v.subject}
                  whileHover={{ y: -6 }}
                  className="group w-[280px] shrink-0 snap-start sm:w-[330px]"
                >
                  <Link href="/signup" className="block overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]">
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={v.img} alt={v.subject} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                      <motion.span
                        className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-hs-blue shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                        whileHover={{ scale: 1.12 }}
                      >
                        <Play size={24} className="ml-0.5 fill-hs-blue" />
                      </motion.span>
                    </div>
                    <div className="p-4">
                      <p className="text-base font-bold text-hs-blue">{v.subject}</p>
                      <p className="mt-0.5 text-sm text-hs-muted">{v.topic}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-hs-amber px-6 py-3 font-semibold text-hs-amberDark hover:opacity-90">
              Watch the full library <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-hs-navy lg:text-4xl">Simple, affordable plans</h2>
          <p className="mt-3 text-hs-muted">Same full experience on every plan — no hidden locks. Start with a free trial.</p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 sm:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.08} className="h-full">
              <div className={`relative flex h-full flex-col rounded-2xl bg-white p-7 ${p.popular ? "border-2 border-hs-blue shadow-[0_18px_40px_-12px_rgba(24,95,165,0.35)]" : "border border-hs-border shadow-[0_8px_24px_-10px_rgba(4,44,83,0.12)]"}`}>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-hs-blue px-3 py-1 text-xs font-bold text-white">Best value</span>
                )}
                <p className="text-sm font-semibold uppercase tracking-wide text-hs-blue">{p.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-hs-navy">{p.price}<span className="text-base font-medium text-hs-muted">{p.per}</span></p>
                <p className="mt-1 text-xs text-hs-muted">{p.note}</p>
                <Link href="/signup" className={`mt-6 block rounded-full py-3 text-center font-semibold ${p.popular ? "bg-hs-blue text-white hover:bg-hs-blueDeep" : "border border-hs-border text-hs-navy hover:bg-hs-bg"}`}>{p.cta}</Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-10 max-w-3xl rounded-2xl border border-hs-border bg-hs-bg p-6">
          <p className="text-center text-sm font-bold text-hs-navy">Every plan unlocks the full experience</p>
          <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {PLAN_FEATURES.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-hs-body"><Check size={16} className="shrink-0 text-hs-blue" /> {t}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* CTA band */}
      <section className="bg-hs-blueTint">
        <Reveal className="mx-auto max-w-6xl px-4 py-14 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold text-hs-navy lg:text-4xl">Ready to score higher?</h2>
          <p className="mt-3 text-hs-muted">Join thousands of Nigerian students already learning on HighScore.</p>
          <motion.div className="mt-7 inline-block" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-hs-blue px-7 py-3.5 font-semibold text-white">
              Create your free account <ArrowRight size={18} />
            </Link>
          </motion.div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-hs-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-hs-muted sm:flex-row lg:px-8">
          <Image src="/highscore-logo-final.png" alt="HighScore" width={170} height={42} className="h-11 w-auto object-contain" />
          <p>© {new Date().getFullYear()} HighScore EdTech. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-hs-blue">Log in</Link>
            <Link href="/signup" className="hover:text-hs-blue">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
