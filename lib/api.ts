// lib/api.ts — backward-compatible facade over the layered architecture.
//
// Internals now live in focused modules:
//   api/config       network origins
//   api/endpoints    endpoint registry
//   api/session      token storage
//   api/http         the request client (api, ApiError)
//   api/realtime     websocket URLs
//   domain/models    pure domain types
//   services/*       one module per feature (auth, dashboard, game, …)
//
// This file re-exports them so existing `@/lib/api` imports keep working.
// New code should import the specific module (e.g. `@/lib/services/auth.service`).

export { API_BASE, WS_BASE } from "./api/config";
export { Endpoints } from "./api/endpoints";
export { session } from "./api/session";
export { api, ApiError } from "./api/http";
export type { RequestOptions } from "./api/http";
export { presenceWsUrl } from "./api/realtime";

export type {
  User,
  AuthData,
  LeaderboardEntry,
  OnlineUser,
  SubjectPerformance,
  ReferralStats,
  PaymentInit,
} from "./domain/models";

export { authApi } from "./services/auth.service";
export { profileApi } from "./services/profile.service";
export { dashApi } from "./services/dashboard.service";
export { gameApi } from "./services/game.service";
export { quizApi } from "./services/quiz.service";
export { paymentApi } from "./services/payment.service";
export { performanceApi } from "./services/performance.service";
export type { Performance } from "./services/performance.service";
export { referralApi } from "./services/referral.service";
export { materialsApi } from "./services/materials.service";
export type { Material } from "./services/materials.service";
