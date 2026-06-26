// Centralised endpoint registry — mirrors the mobile app's api_endpoints.dart.
// Keeping every path in one place removes magic strings from feature code and
// makes backend contract changes a one-file edit.
export const Endpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    verifyEmail: "/auth/verify-email",
    resendOtp: "/auth/resend-otp",
    refresh: "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  user: {
    profile: "/api/user/profile",
    streak: "/api/user/streak",
    walletConvert: "/api/user/wallet/convert",
  },
  quiz: {
    questions: "/api/quiz/questions",
    submit: "/api/quiz/submit",
    credit: "/api/quiz/credit",
    history: "/api/quiz/history",
  },
  leaderboard: {
    list: "/api/leaderboard",
    myRank: "/api/leaderboard/my-rank",
  },
  performance: "/api/performance",
  materials: "/api/materials",
  users: {
    online: "/api/users/online",
    search: "/api/users/search",
  },
  challenge: {
    send: "/api/challenge/send",
    respond: "/api/challenge/respond",
  },
  friends: {
    list: "/api/friends",
    add: "/api/friends/add",
  },
  referral: {
    code: "/api/referral/my-code",
    stats: "/api/referral/stats",
  },
  payment: {
    initialize: "/api/payment/initialize",
    verify: "/api/payment/verify",
  },
  presenceWs: (userId: string) => `/ws/user/${userId}`,
} as const;
