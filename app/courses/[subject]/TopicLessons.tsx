"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, PlayCircle, BookOpen, Check, Clock, FileText, ListChecks, Maximize, RotateCcw, X, Bookmark, MoreVertical, BarChart3, Users, Play, Edit3, FolderOpen } from "lucide-react";
import type { TopicInfo } from "@/lib/topics";
import { QUIZ_BANK, QuizQuestion } from "@/lib/quiz-bank";
import { api } from "@/lib/api";

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
    out.push({ name: `${topic.name}, Part ${p}`, type: "video", minutes: 10 + p, summary: `Worked examples and deeper coverage of ${topic.name}.` });
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
  const [tab, setTab] = useState(0); // 0 Overview · 1 Notes · 2 Resources
  const [saved, setSaved] = useState(false);

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

  // Custom fullscreen that also rotates to landscape (Android). iOS Safari
  // ignores orientation lock, but the player still goes fullscreen.
  const playerRef = useRef<HTMLDivElement>(null);
  const goFullscreen = async () => {
    const el = playerRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> }) | null;
    if (!el) return;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      const o = (screen as unknown as { orientation?: { lock?: (s: string) => Promise<void> } }).orientation;
      if (o?.lock) { try { await o.lock("landscape"); } catch { /* unsupported */ } }
    } catch { /* fullscreen denied */ }
  };
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        const o = (screen as unknown as { orientation?: { unlock?: () => void } }).orientation;
        try { o?.unlock?.(); } catch { /* ignore */ }
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const activeLesson = active >= 0 ? lessons[active] : undefined;
  const totalMin = lessons.reduce((s, l) => s + l.minutes, 0);
  const pct = lessons.length ? Math.round((done.size / lessons.length) * 100) : 0;

  const activeNo = active >= 0 ? active + 1 : 1;
  const isVideo = activeLesson?.type === "video" && (activeLesson.videoUrl || activeLesson.youtubeId);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-white">
      {/* ── Dark top block: header + video + tabs + tab body ────────────────── */}
      <div className="rounded-b-3xl" style={{ backgroundColor: "#141B2B" }}>
        <div className="mx-auto max-w-3xl px-4 pb-5 pt-5 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: "#1E273A" }} aria-label="Back">
              <ArrowLeft size={17} className="text-[#ECEFF5]" />
            </button>
            <p className="flex-1 text-center text-[15px] font-bold text-[#ECEFF5]">
              Lesson <span className="text-hs-amber">{activeNo}</span> of {lessons.length}
            </p>
            <button onClick={() => setSaved((s) => !s)} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: "#1E273A" }} aria-label="Save">
              <Bookmark size={17} className={saved ? "fill-hs-amber text-hs-amber" : "text-[#ECEFF5]"} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: "#1E273A" }} aria-label="More">
              <MoreVertical size={17} className="text-[#ECEFF5]" />
            </button>
          </div>

          {/* Video / featured lesson */}
          <div className="mt-4">
            {isVideo ? (
              <div ref={playerRef} className={`group relative mx-auto overflow-hidden rounded-2xl bg-black ${activeLesson!.portrait ? "max-w-[300px] sm:max-w-[340px]" : ""}`}>
                <div className="relative w-full" style={{ paddingTop: activeLesson!.portrait ? "177.78%" : "56.25%" }}>
                  {activeLesson!.videoUrl ? (
                    <video key={activeLesson!.videoUrl} className="absolute inset-0 h-full w-full bg-black" src={activeLesson!.videoUrl} controls playsInline controlsList="nodownload" />
                  ) : (
                    <iframe key={activeLesson!.youtubeId} className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${activeLesson!.youtubeId}?rel=0&modestbranding=1&playsinline=1&fs=1`}
                      title={activeLesson!.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share" allowFullScreen />
                  )}
                </div>
              </div>
            ) : activeLesson?.type === "practice" ? (
              <PracticeQuiz subjectName={subjectName} color={color} onFinished={() => { if (active >= 0 && !done.has(active)) toggleDone(active); }} />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl text-center" style={{ backgroundColor: "#1E273A" }}>
                <PlayCircle size={40} className="text-[#6BA8E0]" />
                <p className="mt-2 text-sm font-semibold text-[#ECEFF5]">{activeLesson?.name ?? "Select a lesson"}</p>
                <p className="mt-0.5 text-xs text-[#9AA6BD]">Video for this lesson is coming soon.</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-5 flex border-b" style={{ borderColor: "#2C3852" }}>
            {["Overview", "Notes", "Resources"].map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className={`flex-1 border-b-2 py-3 text-[13.5px] ${tab === i ? "font-bold text-[#ECEFF5]" : "font-medium text-[#9AA6BD]"}`}
                style={{ borderColor: tab === i ? color : "transparent" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Tab body */}
          <div className="py-5">
            {tab === 0 && activeLesson && (
              <>
                <span className="inline-block rounded px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide" style={{ backgroundColor: `${color}33`, color: "#6BA8E0" }}>
                  {TYPE_META[activeLesson.type].label}
                </span>
                <h1 className="mt-3 text-2xl font-extrabold leading-tight text-[#ECEFF5]">{activeLesson.name}</h1>
                <p className="mt-1.5 text-sm leading-relaxed text-[#9AA6BD]">{activeLesson.summary}</p>
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  <StatChip icon={<Clock size={15} />} value={`${activeLesson.minutes} min`} label="Duration" />
                  <StatChip icon={<BarChart3 size={15} />} value="Beginner" label="Level" />
                  <StatChip icon={<Users size={15} />} value="2.4k" label="Students" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => active >= 0 && toggleDone(active)}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold"
                    style={done.has(active) ? { backgroundColor: color, color: "#fff" } : { border: `1px solid ${color}`, color: "#6BA8E0" }}>
                    <Check size={15} /> {done.has(active) ? "Completed" : "Mark complete"}
                  </button>
                  {isVideo && (
                    <button onClick={goFullscreen} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-[#ECEFF5]" style={{ border: "1px solid #2C3852" }}>
                      <Maximize size={15} /> Fullscreen
                    </button>
                  )}
                </div>
              </>
            )}
            {tab === 1 && <EmptyTab icon={<Edit3 size={30} />} title="Your notes" sub="Notes you take while watching will appear here." />}
            {tab === 2 && <EmptyTab icon={<FolderOpen size={30} />} title="Resources" sub="Downloadable materials for this lesson will show up here." />}
          </div>
        </div>
      </div>

      {/* ── White "Lessons in this course" section ───────────────────────────── */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-hs-navy">Lessons in this course</h2>
          <span className="text-xs font-semibold text-hs-blue">{lessons.length} lessons</span>
        </div>
        <div className="space-y-2.5">
          {lessons.map((l, i) => {
            const Meta = TYPE_META[l.type].icon;
            const isActive = i === active;
            const isDone = done.has(i);
            return (
              <button key={i} onClick={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition-colors ${isActive ? "" : "hover:bg-hs-bg"}`}
                style={isActive ? { borderColor: color, backgroundColor: `${color}0D` } : { borderColor: "var(--hs-border, #EAEAEA)" }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: isDone ? color : `${color}1A`, color: isDone ? "#fff" : color }}>
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

      {/* ── Bottom bar ───────────────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 border-t border-hs-border bg-white px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button onClick={() => active >= 0 && setActive(active)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white" style={{ backgroundColor: color }}>
            <Play size={18} /> Continue Learning
          </button>
          <button onClick={() => setSaved((s) => !s)} className="flex flex-col items-center rounded-full border border-hs-border px-5 py-2.5">
            <Bookmark size={18} className={saved ? "fill-hs-blue text-hs-blue" : "text-hs-navy"} />
            <span className="text-[10px] font-semibold text-hs-navy">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl p-3" style={{ backgroundColor: "#1E273A" }}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6BA8E0]" style={{ backgroundColor: "#185FA533" }}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-extrabold text-[#ECEFF5]">{value}</p>
        <p className="text-[10px] text-[#9AA6BD]">{label}</p>
      </div>
    </div>
  );
}

function EmptyTab({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl px-4 py-7 text-center" style={{ backgroundColor: "#1E273A" }}>
      <span className="text-[#9AA6BD]">{icon}</span>
      <p className="mt-2.5 text-sm font-bold text-[#ECEFF5]">{title}</p>
      <p className="mt-1 text-xs text-[#9AA6BD]">{sub}</p>
    </div>
  );
}

// ── Practice quiz (end of study session) ─────────────────────────────────────
// 5 quick questions from the subject bank with instant feedback. Finishing
// marks the lesson complete and counts toward the weekly goal.
function PracticeQuiz({ subjectName, color, onFinished }: {
  subjectName: string; color: string; onFinished: () => void;
}) {
  const questions = useMemo<QuizQuestion[]>(() => {
    const bank = QUIZ_BANK[subjectName] ?? [];
    return [...bank].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [subjectName]);

  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const reported = useRef(false);

  useEffect(() => {
    if (!finished || reported.current) return;
    reported.current = true;
    onFinished();
    api("/api/user/goal/progress", { method: "POST", body: { count: questions.length } }).catch(() => {});
  }, [finished]); // eslint-disable-line

  const restart = () => { setQi(0); setPicked(null); setScore(0); setFinished(false); reported.current = false; };

  if (questions.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-hs-border bg-white text-sm text-hs-muted">
        Practice questions for this subject are coming soon.
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex w-full flex-col items-center rounded-2xl border border-hs-border bg-white p-8 text-center">
        <span className="text-5xl">{pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📚"}</span>
        <p className="mt-3 text-2xl font-extrabold text-hs-navy">{score} / {questions.length}</p>
        <p className="mt-1 text-sm text-hs-muted">
          {pct >= 80 ? "Excellent! You've mastered this topic." : pct >= 50 ? "Good work — one more review and you've got it." : "Rewatch the lesson and try again, you'll get there."}
        </p>
        <button onClick={restart} className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-hs-border px-5 py-2.5 text-sm font-semibold text-hs-navy hover:bg-hs-bg">
          <RotateCcw size={15} /> Try again
        </button>
      </div>
    );
  }

  const q = questions[qi];
  return (
    <div className="rounded-2xl border border-hs-border bg-white p-5">
      <div className="flex items-center justify-between text-xs text-hs-muted">
        <span className="font-bold uppercase tracking-wide" style={{ color }}>Practice quiz</span>
        <span>Question {qi + 1} of {questions.length}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-hs-border">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((qi + (picked !== null ? 1 : 0)) / questions.length) * 100}%`, backgroundColor: color }} />
      </div>

      <p className="mt-4 text-base font-semibold text-hs-navy">{q.q}</p>
      <div className="mt-4 space-y-2.5">
        {q.opts.map((opt, i) => {
          const show = picked !== null;
          const isRight = i === q.ans;
          const isPicked = i === picked;
          let cls = "border-hs-border bg-white text-hs-navy hover:bg-hs-bg";
          if (show && isRight) cls = "border-green-500 bg-green-50 text-green-700";
          else if (show && isPicked && !isRight) cls = "border-red-400 bg-red-50 text-red-600";
          return (
            <button
              key={i}
              disabled={show}
              onClick={() => { setPicked(i); if (i === q.ans) setScore((s) => s + 1); }}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default ${cls}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                {show && isRight ? <Check size={13} /> : show && isPicked ? <X size={13} /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <button
          onClick={() => { if (qi + 1 >= questions.length) setFinished(true); else { setQi(qi + 1); setPicked(null); } }}
          className="mt-4 w-full rounded-full py-3 text-sm font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {qi + 1 >= questions.length ? "See my score" : "Next question"}
        </button>
      )}
    </div>
  );
}
