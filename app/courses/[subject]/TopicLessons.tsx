"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, PlayCircle, BookOpen, Check, Clock, FileText, ListChecks } from "lucide-react";
import type { TopicInfo } from "@/lib/topics";

type LessonType = "video" | "reading" | "practice";
interface Lesson { name: string; type: LessonType; minutes: number; youtubeId?: string; videoUrl?: string; portrait?: boolean; summary: string; }

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

// Mirrors the mobile `effectiveLessons` generator (subject_data.dart).
function buildLessons(topic: TopicInfo): Lesson[] {
  const core = clamp(topic.lessons, 2, 5);
  const hasVideo = !!(topic.youtubeId || topic.videoUrl);
  const out: Lesson[] = [
    {
      name: `Introduction to ${topic.name}`,
      type: hasVideo ? "video" : "reading",
      minutes: hasVideo ? clamp(topic.hours, 1, 20) : 8,
      youtubeId: topic.youtubeId,
      videoUrl: topic.videoUrl,
      portrait: topic.portrait,
      summary: `Core concepts and overview of ${topic.name}.`,
    },
  ];
  for (let p = 2; p <= core; p++) {
    out.push({ name: `${topic.name} — Part ${p}`, type: "video", minutes: 10 + p, summary: `Worked examples and deeper coverage of ${topic.name}.` });
  }
  out.push({ name: "Key points & summary", type: "reading", minutes: 6, summary: `Quick revision notes for ${topic.name}.` });
  out.push({ name: "Practice questions", type: "practice", minutes: 12, summary: `Test yourself on ${topic.name}.` });
  return out;
}

const TYPE_META: Record<LessonType, { icon: typeof PlayCircle; label: string }> = {
  video: { icon: PlayCircle, label: "Video" },
  reading: { icon: FileText, label: "Reading" },
  practice: { icon: ListChecks, label: "Practice" },
};

export default function TopicLessons({
  subjectName,
  color,
  topic,
  onBack,
}: {
  subjectName: string;
  color: string;
  topic: TopicInfo;
  onBack: () => void;
}) {
  const lessons = useMemo(() => buildLessons(topic), [topic]);
  const storeKey = `lessons_done_${subjectName}_${topic.name}`;

  const [done, setDone] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number>(() => lessons.findIndex((l) => l.type === "video" && (l.youtubeId || l.videoUrl)));

  // Restore completion.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) setDone(new Set(JSON.parse(raw) as number[]));
    } catch { /* ignore */ }
  }, [storeKey]);

  const toggleDone = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      try { localStorage.setItem(storeKey, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const activeLesson = active >= 0 ? lessons[active] : undefined;
  const totalMin = lessons.reduce((s, l) => s + l.minutes, 0);
  const pct = lessons.length ? Math.round((done.size / lessons.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-hs-bg">
      {/* Header */}
      <header className="px-4 pb-6 pt-5 lg:px-8 lg:pt-7" style={{ backgroundColor: color }}>
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">{subjectName}</p>
              <h1 className="truncate text-lg font-bold text-white">{topic.name}</h1>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-5 text-white">
            <span className="flex items-center gap-1.5 text-sm"><BookOpen size={15} /> {lessons.length} lessons</span>
            <span className="flex items-center gap-1.5 text-sm"><Clock size={15} /> {totalMin} min</span>
            <span className="text-sm font-semibold">{pct}% done</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-5 lg:px-8">
        {/* Video player / featured lesson */}
        {activeLesson?.type === "video" && (activeLesson.videoUrl || activeLesson.youtubeId) ? (
          <div
            className={`mx-auto overflow-hidden rounded-2xl border border-hs-border bg-black ${activeLesson.portrait ? "max-w-[300px] sm:max-w-[340px]" : ""}`}
          >
            <div className="relative w-full" style={{ paddingTop: activeLesson.portrait ? "177.78%" : "56.25%" }}>
              {activeLesson.videoUrl ? (
                // Self-hosted video — no related/other videos, full control.
                <video
                  key={activeLesson.videoUrl}
                  className="absolute inset-0 h-full w-full bg-black"
                  src={activeLesson.videoUrl}
                  controls
                  playsInline
                  controlsList="nodownload"
                />
              ) : (
                // YouTube fallback, hardened (privacy domain, fewer related videos).
                <iframe
                  key={activeLesson.youtubeId}
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${activeLesson.youtubeId}?rel=0&modestbranding=1&playsinline=1&fs=1`}
                  title={activeLesson.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-hs-border bg-white text-center">
            <PlayCircle size={40} style={{ color }} />
            <p className="mt-2 text-sm font-semibold text-hs-navy">{activeLesson?.name ?? "Select a lesson"}</p>
            <p className="mt-0.5 text-xs text-hs-muted">Video for this lesson is coming soon.</p>
          </div>
        )}

        {activeLesson && (
          <div className="mt-3 rounded-xl border border-hs-border bg-white p-4">
            <p className="text-sm font-bold text-hs-navy">{activeLesson.name}</p>
            <p className="mt-1 text-sm text-hs-muted">{activeLesson.summary}</p>
            <button
              onClick={() => active >= 0 && toggleDone(active)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              <Check size={15} /> {done.has(active) ? "Completed" : "Mark complete"}
            </button>
          </div>
        )}

        {/* Lessons list */}
        <h2 className="mb-3 mt-6 text-sm font-bold text-hs-navy">Lessons</h2>
        <div className="space-y-2.5">
          {lessons.map((l, i) => {
            const Meta = TYPE_META[l.type].icon;
            const isActive = i === active;
            const isDone = done.has(i);
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition-colors ${isActive ? "" : "hover:bg-hs-bg"}`}
                style={isActive ? { borderColor: color, backgroundColor: `${color}0D` } : { borderColor: "var(--hs-border, #EAEAEA)" }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: isDone ? color : `${color}1A`, color: isDone ? "#fff" : color }}
                >
                  {isDone ? <Check size={18} /> : <Meta size={18} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-hs-navy">{l.name}</p>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-hs-muted">
                    <span>{TYPE_META[l.type].label}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {l.minutes} min</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
