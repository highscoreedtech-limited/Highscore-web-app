"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { Reveal, stagger, item } from "@/components/Reveal";

const POSTS = [
  { title: "JAMB 2026: 7 study habits that actually move your score", tag: "JAMB", date: "Jun 20, 2026", img: "/study-background.jpg", excerpt: "The difference between a 200 and a 300 isn't talent — it's these repeatable habits you can start today." },
  { title: "How to master CBT practice before exam day", tag: "CBT", date: "Jun 14, 2026", img: "/cbt-banner.jpg", excerpt: "Timed practice, error logs and spaced repetition — a simple system for walking into the hall calm and ready." },
  { title: "WAEC vs NECO: what really changes in your prep", tag: "WAEC", date: "Jun 8, 2026", img: "/english.jpg", excerpt: "Same syllabus, different examiners. Here's how to tune your revision for each board." },
  { title: "Beat exam anxiety with quiz battles", tag: "Wellbeing", date: "Jun 1, 2026", img: "/quiz.jpg", excerpt: "Turning revision into a game lowers stress and boosts recall. The science — and how to use it." },
  { title: "The maths topics that show up every single year", tag: "Mathematics", date: "May 25, 2026", img: "/maths.jpg", excerpt: "Focus your energy where it counts. These high-frequency topics deserve the most practice." },
  { title: "From the bottom to top 10: a HighScore streak story", tag: "Story", date: "May 18, 2026", img: "/physics.jpg", excerpt: "How a 7-day streak turned into a habit — and a leaderboard climb that changed one student's results." },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-hs-body">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-hs-border bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-hs-navy">
            <ArrowLeft size={18} />
            <Image src="/highscore-logo-final.png" alt="HighScore" width={200} height={52} className="h-11 w-auto object-contain lg:h-12" priority />
          </Link>
          <Link href="/signup" className="rounded-full bg-hs-blue px-5 py-2 text-sm font-semibold text-white hover:bg-hs-blueDeep">Get started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 lg:px-8 lg:pt-16">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-hs-blueTint px-3 py-1 text-xs font-semibold text-hs-blue">
            HighScore Blog
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-hs-navy lg:text-5xl">
            Tips, guides & stories to help you <span className="text-hs-blue">score higher.</span>
          </h1>
          <p className="mt-3 max-w-xl text-lg text-hs-muted">Exam strategy, study science and real student wins — straight from the HighScore team.</p>
        </Reveal>
      </section>

      {/* Posts */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {POSTS.map((p) => (
            <motion.article
              key={p.title}
              variants={item}
              whileHover={{ y: -8 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-hs-border bg-white shadow-[0_10px_30px_-8px_rgba(4,44,83,0.16)] hover:shadow-[0_22px_44px_-12px_rgba(4,44,83,0.28)]"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-hs-blue">{p.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex items-center gap-1.5 text-[11px] text-hs-muted"><CalendarDays size={13} /> {p.date}</p>
                <h2 className="mt-2 text-lg font-bold leading-snug text-hs-navy">{p.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-hs-muted">{p.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-hs-blue">
                  Read more <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-hs-blueTint">
        <Reveal className="mx-auto max-w-6xl px-4 py-14 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold text-hs-navy lg:text-4xl">Put these tips into practice</h2>
          <p className="mt-3 text-hs-muted">Create a free account and start learning the HighScore way.</p>
          <Link href="/signup" className="mt-7 inline-flex items-center gap-2 rounded-full bg-hs-blue px-7 py-3.5 font-semibold text-white hover:bg-hs-blueDeep">
            Get started free <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>

      <footer className="border-t border-hs-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-hs-muted lg:px-8">
          <Image src="/highscore-logo-final.png" alt="HighScore" width={170} height={42} className="h-11 w-auto object-contain" />
          <p>© {new Date().getFullYear()} HighScore EdTech</p>
        </div>
      </footer>
    </div>
  );
}
