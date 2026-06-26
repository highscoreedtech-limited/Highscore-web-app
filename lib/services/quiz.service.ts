// Quiz service — credit earned points to the backend leaderboard/wallet.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";

export const quizApi = {
  credit(input: { score: number; total: number; exam_type: string; subject?: string }): Promise<void> {
    return api(Endpoints.quiz.credit, { method: "POST", body: input }).then(() => {});
  },
};
