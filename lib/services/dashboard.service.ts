// Dashboard service — leaderboard + rank for the home tab.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";
import type { LeaderboardEntry } from "@/lib/domain/models";

export const dashApi = {
  leaderboard(examType: string, limit = 5): Promise<LeaderboardEntry[]> {
    return api<LeaderboardEntry[]>(`${Endpoints.leaderboard.list}?exam_type=${encodeURIComponent(examType)}&limit=${limit}`);
  },
  myRank(examType: string): Promise<{ rank: number; badge?: string }> {
    return api<{ rank: number; badge?: string }>(`${Endpoints.leaderboard.myRank}?exam_type=${encodeURIComponent(examType)}`);
  },
};
