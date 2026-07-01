// Rank tiers (shared with the leaderboard level strip).
export interface Tier { name: string; emoji: string; color: string; minPts: number; }

export const TIERS: Tier[] = [
  { name: "Wood", emoji: "🪵", color: "#92400E", minPts: 0 },
  { name: "Bronze", emoji: "🥉", color: "#B45309", minPts: 500 },
  { name: "Silver", emoji: "🥈", color: "#6B7280", minPts: 1500 },
  { name: "Gold", emoji: "🥇", color: "#D97706", minPts: 3000 },
  { name: "Diamond", emoji: "💎", color: "#0EA5E9", minPts: 6000 },
  { name: "Legend", emoji: "👑", color: "#7C3AED", minPts: 12000 },
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
