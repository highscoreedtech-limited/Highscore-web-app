"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, PlayCircle, Download, Search } from "lucide-react";
import { api } from "@/lib/api";

interface Material {
  id: string; title: string; subject: string; type: "pdf" | "video";
  file_size: number; url: string; category: string;
}

const SUBJECT_COLOR: Record<string, string> = {
  Physics: "#185FA5", Chemistry: "#C0396A", Biology: "#059669",
  Mathematics: "#E05B5B", "English Language": "#185FA5", English: "#185FA5",
};

const SAMPLE: Material[] = [
  { id: "1", title: "Physics: Mechanics & Motion — Complete Notes", subject: "Physics", type: "pdf", file_size: 13_000_000, url: "#", category: "Notes" },
  { id: "2", title: "Chemistry: The Mole Concept (Video)", subject: "Chemistry", type: "video", file_size: 48_000_000, url: "#", category: "Video" },
  { id: "3", title: "Mathematics: Quadratic Equations — Past Questions", subject: "Mathematics", type: "pdf", file_size: 4_200_000, url: "#", category: "Past Questions" },
  { id: "4", title: "Biology: Cell Structure & Function (Video)", subject: "Biology", type: "video", file_size: 52_000_000, url: "#", category: "Video" },
  { id: "5", title: "English: Comprehension & Summary — Notes", subject: "English Language", type: "pdf", file_size: 2_800_000, url: "#", category: "Notes" },
];

function sizeLabel(b: number) {
  return b >= 1024 * 1024 ? `${(b / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;
}

export default function DownloadsTab() {
  const [items, setItems] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");

  useEffect(() => {
    let active = true;
    api<Material[]>("/api/materials")
      .then((m) => { if (active) setItems(Array.isArray(m) && m.length ? m : SAMPLE); })
      .catch(() => { if (active) setItems(SAMPLE); })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const subjects = useMemo(() => ["all", ...Array.from(new Set(items.map((m) => m.subject)))], [items]);
  const filtered = items.filter((m) =>
    (subject === "all" || m.subject === subject) &&
    (q === "" || m.title.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="pb-6">
      <header className="bg-hs-navy px-4 pb-6 pt-5 lg:px-8 lg:pt-7">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-bold text-white">Downloads</h1>
          <p className="mt-1.5 text-sm text-white/70">Study materials — notes, past questions & videos</p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5">
            <Search size={18} className="text-hs-placeholder" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search materials…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-hs-placeholder"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-4 lg:px-8">
        {/* Subject filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${subject === s ? "bg-hs-blue text-white" : "border border-hs-border bg-white text-hs-navy"}`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm font-bold text-hs-navy">Available to download</p>

        {loading ? (
          <p className="mt-4 text-center text-sm text-hs-muted">Loading materials…</p>
        ) : (
          <div className="mt-3 space-y-2.5">
            {filtered.map((m, i) => {
              const color = SUBJECT_COLOR[m.subject] || "#185FA5";
              const isVideo = m.type === "video";
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 rounded-2xl border border-hs-border bg-white p-3.5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}1A`, color }}>
                    {isVideo ? <PlayCircle size={22} /> : <FileText size={22} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-hs-navy">{m.title}</p>
                    <p className="text-[11px] text-hs-muted">{m.subject} · {m.category} · {sizeLabel(m.file_size)}</p>
                  </div>
                  <button
                    onClick={() => { if (m.url && m.url !== "#") window.open(m.url, "_blank"); }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hs-blueTint text-hs-blue hover:bg-hs-blue hover:text-white"
                    aria-label="Download"
                  >
                    <Download size={17} />
                  </button>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <p className="rounded-xl border border-hs-border bg-white px-4 py-6 text-center text-sm text-hs-muted">No materials found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
