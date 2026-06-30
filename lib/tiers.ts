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

// Emoji for the backend's rank-based badge (Diamond/Platinum/Gold/Silver/Bronze).
export function badgeEmoji(badge: string): string {
  return ({ Diamond: "💎", Platinum: "🏆", Gold: "🥇", Silver: "🥈", Bronze: "🥉" } as Record<string, string>)[badge] || "⚪";
}
