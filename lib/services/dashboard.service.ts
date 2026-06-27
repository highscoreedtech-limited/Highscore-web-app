// Dashboard service — leaderboard + rank for the home tab.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";
import type { LeaderboardEntry } from "@/lib/domain/models";

export const dashApi = {
  // examType "" or "All" → global board (no exam filter) so the true top scorer
  // always shows, matching the mobile All-exams board.
  leaderboard(examType: string, limit = 5): Promise<LeaderboardEntry[]> {
    const exam = examType && examType !== "All" ? `exam_type=${encodeURIComponent(examType)}&` : "";
    return api<LeaderboardEntry[]>(`${Endpoints.leaderboard.list}?${exam}limit=${limit}`);
  },
  // examType "" or "All" → rank within the global board (same scope as
  // leaderboard()), so the "your rank" bar matches the list being shown.
  myRank(examType: string): Promise<MyRank> {
    const exam = examType && examType !== "All" ? `exam_type=${encodeURIComponent(examType)}` : "";
    return api<MyRank>(`${Endpoints.leaderboard.myRank}${exam ? `?${exam}` : ""}`);
  },
};

export interface MyRank {
  rank: number;
  badge?: string;
  // Spendable balance = lifetime score minus points already converted.
  spendable_points?: number;
  total_score?: number;
}

// Resolve the user's usable points balance from a my-rank response.
export const pointsFromRank = (r: MyRank): number => r.spendable_points ?? r.total_score ?? 0;
