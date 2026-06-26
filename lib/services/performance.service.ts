// Performance service — analytics for the /analytics screen.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";
import type { SubjectPerformance } from "@/lib/domain/models";

export interface Performance {
  subjects: SubjectPerformance[];
  weekly: number[];
  trend: string;
}

const FALLBACK: Performance = {
  subjects: [
    { label: "Physics", score: 85, color: "#185FA5" },
    { label: "Chemistry", score: 72, color: "#7C3AED" },
    { label: "Mathematics", score: 91, color: "#059669" },
    { label: "Biology", score: 68, color: "#2563EB" },
    { label: "Literature", score: 55, color: "#DC2626" },
  ],
  weekly: [40, 62, 55, 78, 70, 88, 84],
  trend: "+12%",
};

export const performanceApi = {
  // Resolves to backend data when available, otherwise a sensible sample so the
  // screen never renders empty (behaviour preserved).
  async get(): Promise<Performance> {
    try {
      const p = await api<Partial<Performance>>(Endpoints.performance);
      return {
        subjects: p?.subjects?.length ? p.subjects : FALLBACK.subjects,
        weekly: p?.weekly?.length ? p.weekly : FALLBACK.weekly,
        trend: p?.trend ?? FALLBACK.trend,
      };
    } catch {
      return FALLBACK;
    }
  },
};
