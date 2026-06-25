"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, PlayCircle, Clock, BookOpen, Check } from "lucide-react";
import { SUBJECTS } from "@/lib/subjects";
import { TOPICS } from "@/lib/topics";

export default function SubjectDetailPage() {
  const router = useRouter();
  const params = useParams<{ subject: string }>();
  const name = decodeURIComponent(params.subject || "");

  const subject = SUBJECTS.find((s) => s.name === name);
  const topics = TOPICS[name] || [];
  const color = subject?.color || "#185FA5";

  const totalLessons = topics.reduce((n, t) => n + t.lessons, 0);
  const totalHours = topics.reduce((n, t) => n + t.hours, 0);
  const done = topics.filter((t) => t.progress >= 1).length;

  return (
    <div className="min-h-screen bg-hs-bg pb-12">
      {/* Header */}
      <header className="px-4 pb-6 pt-5 lg:px-8 lg:pt-7" style={{ backgroundColor: color }}>
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/courses")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white"
              aria-label="Back"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="flex-1 truncate text-lg font-bold text-white">{name || "Subject"}</h1>
          </div>

          {subject && (
            <div className="mt-5 flex items-center gap-6 text-white">
              <Stat value={`${subject.percent}%`} label="Complete" />
              <Stat value={`${topics.length}`} label="Topics" />
              <Stat value={`${totalLessons}`} label="Lessons" />
              <Stat value={`${totalHours}h`} label="Content" />
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-5 lg:px-8">
        {subject && (
          <div className="mb-4 rounded-2xl border border-hs-border bg-white p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-hs-navy">Your progress</span>
              <span className="text-hs-muted">{done}/{topics.length} topics done</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-hs-border">
              <div className="h-full rounded-full" style={{ width: `${subject.percent}%`, backgroundColor: color }} />
            </div>
          </div>
        )}

        <h2 className="mb-3 text-sm font-bold text-hs-navy">Topics</h2>

        {topics.length === 0 && (
          <p className="rounded-xl border border-hs-border bg-white px-4 py-6 text-center text-sm text-hs-muted">
            Topics for this subject are coming soon.
          </p>
        )}

        <div className="space-y-2.5">
          {topics.map((t, i) => {
            const pct = Math.round(t.progress * 100);
            const complete = t.progress >= 1;
            return (
              <button
                key={i}
                onClick={() => toast.info(`${t.name} — lessons coming soon`)}
                className="flex w-full items-center gap-3 rounded-2xl border border-hs-border bg-white p-3.5 text-left hover:bg-hs-bg"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${color}1A`, color }}
                >
                  {complete ? <Check size={20} /> : <PlayCircle size={20} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-hs-navy">{t.name}</p>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-hs-muted">
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {t.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {t.hours}h</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-hs-border">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-hs-navy">{pct}%</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[11px] opacity-80">{label}</p>
    </div>
  );
}
