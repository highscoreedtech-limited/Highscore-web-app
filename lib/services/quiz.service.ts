// Quiz service — credit earned points to the backend leaderboard/wallet.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";

export const quizApi = {
  // Backend contract: POST /api/quiz/credit { subject, points }. Points are
  // clamped/capped server-side; this records a quiz_attempt that flows into the
  // leaderboard total and the spendable balance.
  credit(subject: string, points: number): Promise<void> {
    return api(Endpoints.quiz.credit, { method: "POST", body: { subject, points } }).then(() => {});
  },
};
