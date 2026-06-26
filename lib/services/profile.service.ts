// Profile service — read/update the current user.
import { api } from "@/lib/api/http";
import { Endpoints } from "@/lib/api/endpoints";
import { session } from "@/lib/api/session";
import type { User } from "@/lib/domain/models";

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  exam_type?: string;
  state?: string;
  phone_number?: string;
  avatar_url?: string;
}

export const profileApi = {
  get(): Promise<User> {
    return api<User>(Endpoints.user.profile).then((u) => { session.saveUser(u); return u; });
  },
  update(patch: ProfileUpdate): Promise<void> {
    return api(Endpoints.user.profile, { method: "PUT", body: patch }).then(() => {});
  },
  setAvatar(avatarUrl: string): Promise<void> {
    return this.update({ avatar_url: avatarUrl });
  },
  // Backend-authoritative daily streak: POST increments at most once per day
  // and returns the real streak count.
  touchStreak(): Promise<{ streak_count: number }> {
    return api<{ streak_count: number }>(Endpoints.user.streak, { method: "POST", body: {} });
  },
};

// Streak bonus points for a given streak day (mirrors mobile _streakPoints).
export function streakPoints(day: number): number {
  if (day <= 0) return 10;
  if (day === 7) return 70;
  if (day === 14) return 100;
  if (day === 30) return 300;
  if (day % 7 === 0) return 70;
  return 10;
}
