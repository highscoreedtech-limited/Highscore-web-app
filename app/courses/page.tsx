"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft, Bell, LayoutGrid, List as ListIcon, TrendingUp,
  BookOpenText, Calculator, Atom, FlaskConical, Leaf, BookText,
  LineChart, Landmark, Sprout, Sigma,
} from "lucide-react";
import { SUBJECTS, SubjectInfo } from "@/lib/subjects";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "English Language": BookOpenText,
  Mathematics: Calculator,
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Leaf,
  "Literature in English": BookText,
  Economics: LineChart,
  Government: Landmark,
  "Agricultural Science": Sprout,
  "Further Mathematics": Sigma,
};

type Filter = "all" | "science" | "arts";

export default function CoursesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [grid, setGrid] = useState(true);

  const items = SUBJECTS.filter((s) => filter === "all" || s.category === filter);

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      {/* Navy header */}
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white"
              aria-label="Back"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="flex-1 text-lg font-bold text-white">My Courses</h1>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white">
              <Bell size={18} />
            </span>
          </div>

          <div className="mt-5 flex">
            <HeaderStat value={`${SUBJECTS.length}`} label="Active" />
            <Divider />
            <HeaderStat value="72%" label="Avg Score" />
            <Divider />
            <HeaderStat value="210+" label="Topics done" />
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="mx-auto mt-4 max-w-5xl px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Chip label="All" value="all" active={filter} onTap={setFilter} />
          <Chip label="Science" value="science" active={filter} onTap={setFilter} />
          <Chip label="Arts" value="arts" active={filter} onTap={setFilter} />
          <div className="ml-auto flex rounded-lg border border-hs-border bg-white p-0.5">
            <button
              onClick={() => setGrid(true)}
              className={`rounded-md p-1.5 ${grid ? "bg-hs-blueTint text-hs-blue" : "text-hs-placeholder"}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setGrid(false)}
              className={`rounded-md p-1.5 ${!grid ? "bg-hs-blueTint text-hs-blue" : "text-hs-placeholder"}`}
              aria-label="List view"
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>

        {/* Subjects */}
        <div
          className={
            grid
              ? "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              : "mt-4 flex flex-col gap-2.5"
          }
        >
          {items.map((s) =>
            grid ? (
              <SubjectCard key={s.name} s={s} onClick={() => toast.info(`${s.name} — opening soon`)} />
            ) : (
              <SubjectRow key={s.name} s={s} onClick={() => toast.info(`${s.name} — opening soon`)} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

function HeaderStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="mt-0.5 text-[11px] text-[#B8CCE0]">{label}</p>
    </div>
  );
}
function Divider() {
  return <div className="mx-1 w-px self-stretch bg-white/15" />;
}

function Chip({ label, value, active, onTap }: { label: string; value: Filter; active: Filter; onTap: (v: Filter) => void }) {
  const on = active === value;
  return (
    <button
      onClick={() => onTap(value)}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        on ? "bg-hs-blue text-white" : "border border-hs-border bg-white text-hs-navy"
      }`}
    >
      {label}
    </button>
  );
}

function SubjectIcon({ s, size = 22 }: { s: SubjectInfo; size?: number }) {
  const Icon = ICONS[s.name] ?? BookOpenText;
  return (
    <span
      className="flex items-center justify-center rounded-xl"
      style={{ backgroundColor: `${s.color}1F`, width: size + 18, height: size + 18 }}
    >
      <Icon size={size} style={{ color: s.color }} />
    </span>
  );
}

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-hs-border">
      <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
    </div>
  );
}

function SubjectCard({ s, onClick }: { s: SubjectInfo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-2xl border border-hs-border bg-white p-3.5 text-left shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <SubjectIcon s={s} />
        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-hs-blue">
          <TrendingUp size={12} /> {s.trend}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm font-bold text-hs-navy">{s.name}</p>
      <span className="mt-1 inline-block w-fit rounded-full bg-hs-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-hs-muted">
        {s.category}
      </span>
      <ProgressBar percent={s.percent} color={s.color} />
      <div className="mt-1.5 flex items-center justify-between text-[11px] text-hs-muted">
        <span>{s.topicsLabel}</span>
        <span className="font-bold text-hs-navy">{s.percent}%</span>
      </div>
      <p className="mt-1 text-[10px] text-hs-placeholder">Last studied {s.lastStudied}</p>
    </button>
  );
}

function SubjectRow({ s, onClick }: { s: SubjectInfo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-hs-border bg-white p-3 text-left shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
    >
      <SubjectIcon s={s} size={20} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-bold text-hs-navy">{s.name}</p>
          <span className="ml-2 text-sm font-bold text-hs-navy">{s.percent}%</span>
        </div>
        <ProgressBar percent={s.percent} color={s.color} />
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-hs-muted">
          <span>{s.topicsLabel}</span>
          <span>Last studied {s.lastStudied}</span>
        </div>
      </div>
    </button>
  );
}
