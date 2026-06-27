// Domain models — the canonical shapes the app reasons about.
// Pure types only; no I/O, no framework. Services map backend JSON → these.

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  exam_type: string;
  subscription_tier: string;
  avatar_color: string;
  avatar_url: string;
  streak_count: number;
  hst_balance: number;
  referral_code?: string | null;
  referral_count: number;
  referral_points: number;
}

export interface AuthData {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LeaderboardEntry {
  user_id?: string;
  rank: number;
  first_name: string;
  last_name: string;
  initials: string;
  total_score: number;
  state: string;
  badge: string;
  avatar_color: string;
}

export interface OnlineUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  initials?: string;
  badge: string;
  total_score: number;
  avatar_color?: string;
  is_friend?: boolean;
}

export interface SubjectPerformance {
  label: string;
  score: number;
  color: string;
}

export interface ReferralStats {
  code: string;
  referral_count: number;
  referral_points: number;
}

export interface PaymentInit {
  authorization_url: string;
  reference: string;
}
