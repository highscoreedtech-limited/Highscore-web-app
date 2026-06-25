"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlayCircle, Laptop, Gamepad2, Medal, LineChart, Gift,
  ArrowRight, Check, Menu, X, GraduationCap,
} from "lucide-react";

const SUBJECTS = ["English", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature"];

const FEATURES = [
  { icon: PlayCircle, title: "Video lessons", desc: "Bite-sized lessons for every JAMB, WAEC & NECO topic, taught by top teachers.", color: "#185FA5", bg: "#E6F1FB" },
  { icon: Laptop, title: "CBT practice", desc: "Real exam-style computer-based tests with instant scoring and explanations.", color: "#185FA5", bg: "#E6F1FB" },
  { icon: Gamepad2, title: "Quiz battles", desc: "Challenge friends in live 1-v-1 quiz games and climb the ranks.", color: "#854F0B", bg: "#FAEEDA" },
  { icon: Medal, title: "Leaderboards", desc: "Compete with students across Nigeria and earn your spot at the top.", color: "#854F0B", bg: "#FAEEDA" },
  { icon: LineChart, title: "Analytics", desc: "Track your progress, spot weak topics and study smarter, not harder.", color: "#185FA5", bg: "#E6F1FB" },
  { icon: Gift, title: "Rewards", desc: "Earn points and streaks as you learn — and turn them into real rewards.", color: "#854F0B", bg: "#FAEEDA" },
];

export default function MarketingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-hs-body">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-hs-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
          <Image src="/highscore-logo-final.png" alt="HighScore" width={150} height={38} className="h-9 w-auto object-contain" priority />

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-hs-navy hover:text-hs-blue">Features</a>
            <a href="#subjects" className="text-sm font-medium text-hs-navy hover:text-hs-blue">Subjects</a>
            <a href="#pricing" className="text-sm font-medium text-hs-navy hover:text-hs-blue">Pricing</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-hs-navy hover:bg-hs-bg">Log in</Link>
            <Link href="/signup" className="rounded-full bg-hs-blue px-5 py-2 text-sm font-semibold text-white hover:bg-hs-blueDeep">Get started</Link>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-hs-border bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#features" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-hs-navy">Features</a>
              <a href="#subjects" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-hs-navy">Subjects</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-hs-navy">Pricing</a>
              <Link href="/login" className="rounded-full border border-hs-border px-4 py-2 text-center text-sm font-semibold text-hs-navy">Log in</Link>
              <Link href="/signup" className="rounded-full bg-hs-blue px-4 py-2 text-center text-sm font-semibold text-white">Get started</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
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
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-hs-amber px-6 py-3 font-semibold text-hs-amberDark hover:opacity-90">
                Start learning free <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-hs-border px-6 py-3 font-semibold text-hs-navy hover:bg-hs-bg">
                I have an account
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-hs-muted">
              <span className="flex items-center gap-1.5"><Check size={16} className="text-hs-blue" /> 10 core subjects</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-hs-blue" /> Thousands of past questions</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-hs-blue" /> Learn anywhere</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-hs-border shadow-xl">
              <Image src="/hero-students-computers.png" alt="Students learning with HighScore" width={720} height={540} className="h-full w-full object-cover" priority />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden items-center gap-2 rounded-2xl bg-hs-navy px-4 py-3 text-white shadow-lg sm:flex">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-sm font-bold">7-day streak</p>
                <p className="text-[11px] text-[#B8CCE0]">keep it going!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-hs-border bg-hs-bg">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center sm:grid-cols-4 lg:px-8">
          {[["50k+", "Past questions"], ["10", "Core subjects"], ["1-v-1", "Quiz battles"], ["24/7", "Learn anytime"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-2xl font-extrabold text-hs-navy lg:text-3xl">{v}</p>
              <p className="mt-1 text-sm text-hs-muted">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-hs-navy lg:text-4xl">Everything you need to ace it</h2>
          <p className="mt-3 text-hs-muted">One app for lessons, practice, competition and tracking — built for Nigerian students.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-hs-border bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: f.bg }}>
                  <Icon size={24} style={{ color: f.color }} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-hs-navy">{f.title}</h3>
                <p className="mt-1.5 text-sm text-hs-muted">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="bg-hs-navy py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-white lg:text-4xl">Every subject, covered</h2>
            <p className="mt-3 text-[#B8CCE0]">From English to Further Maths — full curricula aligned to your exam.</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {SUBJECTS.map((s) => (
              <span key={s} className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-hs-amber px-6 py-3 font-semibold text-hs-amberDark hover:opacity-90">
              Explore all subjects <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-hs-navy lg:text-4xl">Simple, affordable plans</h2>
          <p className="mt-3 text-hs-muted">Start free. Upgrade when you&apos;re ready to go all-in.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-hs-border bg-white p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-hs-muted">Free</p>
            <p className="mt-2 text-3xl font-extrabold text-hs-navy">₦0</p>
            <ul className="mt-5 space-y-3 text-sm text-hs-body">
              {["Daily free lessons", "Limited CBT practice", "Join quiz battles", "Leaderboard access"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check size={16} className="text-hs-blue" /> {t}</li>
              ))}
            </ul>
            <Link href="/signup" className="mt-6 block rounded-full border border-hs-border py-3 text-center font-semibold text-hs-navy hover:bg-hs-bg">Get started</Link>
          </div>
          <div className="rounded-2xl border-2 border-hs-blue bg-white p-7 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-hs-blue">Premium</p>
              <span className="rounded-full bg-hs-blueTint px-2.5 py-1 text-xs font-bold text-hs-blue">Most popular</span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-hs-navy">₦2,500<span className="text-base font-medium text-hs-muted">/mo</span></p>
            <ul className="mt-5 space-y-3 text-sm text-hs-body">
              {["Unlimited lessons & CBT", "All subjects unlocked", "Detailed analytics", "Downloads for offline study", "Priority rewards"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check size={16} className="text-hs-blue" /> {t}</li>
              ))}
            </ul>
            <Link href="/signup" className="mt-6 block rounded-full bg-hs-blue py-3 text-center font-semibold text-white hover:bg-hs-blueDeep">Go Premium</Link>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-hs-blueTint">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold text-hs-navy lg:text-4xl">Ready to score higher?</h2>
          <p className="mt-3 text-hs-muted">Join thousands of Nigerian students already learning on HighScore.</p>
          <Link href="/signup" className="mt-7 inline-flex items-center gap-2 rounded-full bg-hs-blue px-7 py-3.5 font-semibold text-white hover:bg-hs-blueDeep">
            Create your free account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hs-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-hs-muted sm:flex-row lg:px-8">
          <Image src="/highscore-logo-final.png" alt="HighScore" width={130} height={32} className="h-8 w-auto object-contain" />
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
