// Referral service — code + stats for the /referral screen.
// Prefers the dedicated endpoints, falls back to the cached user object so the
// screen still works if those endpoints aren't populated yet.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";
import { session } from "@/lib/api/session";
import type { ReferralStats } from "@/lib/domain/models";

export const referralApi = {
  async get(): Promise<ReferralStats> {
    const user = session.getUser();
    const fallback: ReferralStats = {
      code: user?.referral_code || "------",
      referral_count: user?.referral_count ?? 0,
      referral_points: user?.referral_points ?? 0,
    };
    try {
      const [codeRes, stats] = await Promise.all([
        api<{ code?: string }>(Endpoints.referral.code).catch(() => null),
        api<Partial<ReferralStats>>(Endpoints.referral.stats).catch(() => null),
      ]);
      return {
        code: codeRes?.code || fallback.code,
        referral_count: stats?.referral_count ?? fallback.referral_count,
        referral_points: stats?.referral_points ?? fallback.referral_points,
      };
    } catch {
      return fallback;
    }
  },
};
