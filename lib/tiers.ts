// Rank tiers (shared with the leaderboard level strip). `icon` points to the
// rank artwork in /public/ranks — mirrors the mobile tiers.dart ladder.
export interface Tier { name: string; emoji: string; icon: string; color: string; minPts: number; }

export const TIERS: Tier[] = [
  { name: "Neophyte", emoji: "🐣", icon: "/ranks/neophyte.png", color: "#65A30D", minPts: 0 },
  { name: "Wood", emoji: "🪵", icon: "/ranks/wood.png", color: "#92400E", minPts: 300 },
  { name: "Bronze", emoji: "🥉", icon: "/ranks/bronze.png", color: "#B45309", minPts: 800 },
  { name: "Silver", emoji: "🥈", icon: "/ranks/silver.png", color: "#6B7280", minPts: 1800 },
  { name: "Gold", emoji: "🥇", icon: "/ranks/gold.png", color: "#D97706", minPts: 3500 },
  { name: "Diamond", emoji: "💎", icon: "/ranks/diamond.png", color: "#0EA5E9", minPts: 6000 },
  { name: "Scholar", emoji: "📚", icon: "/ranks/scholar.png", color: "#2563EB", minPts: 9000 },
  { name: "Sage", emoji: "🧠", icon: "/ranks/sage.png", color: "#7C3AED", minPts: 13000 },
  { name: "Expert", emoji: "🎖️", icon: "/ranks/expert.png", color: "#0891B2", minPts: 18000 },
  { name: "Master", emoji: "👑", icon: "/ranks/master.png", color: "#B45309", minPts: 25000 },
];

export function tierFor(points: number): Tier {
  let cur = TIERS[0];
  for (const t of TIERS) if (points >= t.minPts) cur = t;
  return cur;
}

/// The tier after the current one, or null at max level.
export function nextTier(points: number): Tier | null {
  const cur = tierFor(points);
  const i = TIERS.indexOf(cur);
  return i + 1 < TIERS.length ? TIERS[i + 1] : null;
}

/// 0..1 progress through the current tier toward the next.
export function tierProgress(points: number): number {
  const cur = tierFor(points);
  const nxt = nextTier(points);
  if (!nxt) return 1;
  return Math.min(1, Math.max(0, (points - cur.minPts) / (nxt.minPts - cur.minPts)));
}

// Emoji for the backend's rank-based badge (Diamond/Platinum/Gold/Silver/Bronze).
export function badgeEmoji(badge: string): string {
  return ({ Diamond: "💎", Platinum: "🏆", Gold: "🥇", Silver: "🥈", Bronze: "🥉" } as Record<string, string>)[badge] || "⚪";
}
