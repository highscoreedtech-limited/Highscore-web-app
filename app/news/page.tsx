"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";

const FILTERS = ["All", "JAMB Update", "Exam Tips", "Results", "General"] as const;

interface Article { title: string; category: string; date: string; color: string; excerpt: string; }
const ARTICLES: Article[] = [
  { title: "JAMB announces 2026 UTME registration dates", category: "JAMB Update", date: "Jun 22, 2026", color: "#185FA5", excerpt: "Registration opens next month — here's everything you need to prepare your documents and avoid last-minute rush." },
  { title: "5 proven techniques to memorise faster", category: "Exam Tips", date: "Jun 18, 2026", color: "#7C3AED", excerpt: "Spaced repetition, active recall and more — the study science that actually moves your scores." },
  { title: "WAEC releases May/June results", category: "Results", date: "Jun 12, 2026", color: "#059669", excerpt: "How to check your results online, what to do if there's a discrepancy, and next steps for admission." },
  { title: "How to stay calm on exam day", category: "General", date: "Jun 6, 2026", color: "#DC2626", excerpt: "Practical, science-backed ways to manage nerves so your preparation actually shows up in the hall." },
  { title: "NECO timetable: what changed this year", category: "Exam Tips", date: "May 30, 2026", color: "#7C3AED", excerpt: "Key date shifts and how to re-plan your revision schedule around them." },
  { title: "Top scholarship opportunities for 2026", category: "General", date: "May 24, 2026", color: "#DC2626", excerpt: "Funding you can apply for right now — eligibility, deadlines and application tips." },
];

export default function NewsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const list = ARTICLES.filter((a) => filter === "All" || a.category === filter);

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-bold text-white">News & Updates</h1>
          </div>
          <p className="mt-1.5 text-sm text-white/70">Exam news, tips and announcements</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-4 lg:px-8">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${filter === f ? "bg-hs-blue text-white" : "border border-hs-border bg-white text-hs-navy"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="mt-4 space-y-3">
          {list.map((a, i) => (
            <motion.button
              key={a.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="w-full overflow-hidden rounded-2xl border border-hs-border bg-white p-4 text-left"
              style={{ borderLeft: `4px solid ${a.color}` }}
            >
              <div className="flex items-center gap-2">
                <span className="rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ backgroundColor: `${a.color}1A`, color: a.color }}>{a.category}</span>
                <span className="flex items-center gap-1 text-[11px] text-hs-muted"><CalendarDays size={12} /> {a.date}</span>
              </div>
              <p className="mt-2 text-base font-bold leading-snug text-hs-navy">{a.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-hs-muted">{a.excerpt}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: a.color }}>Read more <ArrowRight size={14} /></span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
