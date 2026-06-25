"use client";
import React, { useState } from 'react';
import { ArrowLeft, Coins, Gift, Star, Zap, ShoppingBag, Trophy, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface User {
  authid: string;
  id: string;
  username: string;
  email: string;
  displayName: string;
  rank: string;
  xp: number;
  coins: number;
  avatar: string;
  totalMatches: number;
  wins: number;
  winRate: number;
}


interface RewardCenterProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

const RewardCenter: React.FC<RewardCenterProps> = ({ user, onBack, onUpdateUser }) => {
  const router = useRouter();
  const [animatingCoins, setAnimatingCoins] = useState<number[]>([]);
  const [dailyRewardsState, setDailyRewardsState] = useState([
    { id: 1, type: 'coins', amount: 50, claimed: true, day: 1, available: true },
    { id: 2, type: 'coins', amount: 75, claimed: true, day: 2, available: true },
    { id: 3, type: 'xp', amount: 100, claimed: true, day: 3, available: true },
    { id: 4, type: 'coins', amount: 100, claimed: false, day: 4, available: true },
    { id: 5, type: 'xp', amount: 150, claimed: false, day: 5, available: false },
    { id: 6, type: 'coins', amount: 200, claimed: false, day: 6, available: false },
    { id: 7, type: 'special', amount: 500, claimed: false, day: 7, available: false, special: true }
  ]);

  const [shopItemsState, setShopItemsState] = useState([
    { id: 1, name: 'Avatar Pack - Animals', description: 'Unlock 10 animal avatars', cost: 500, icon: '🐺', category: 'avatars', available: true },
    { id: 2, name: 'Avatar Pack - Space', description: 'Unlock 8 space-themed avatars', cost: 750, icon: '🚀', category: 'avatars', available: true },
    { id: 3, name: 'Double XP Boost', description: '2x XP for next 5 games', cost: 300, icon: '⚡', category: 'boosts', available: true },
    { id: 4, name: 'Hint Master', description: '3 hints for difficult questions', cost: 200, icon: '💡', category: 'boosts', available: true },
    { id: 5, name: 'Premium Badge', description: 'Exclusive golden badge', cost: 1000, icon: '👑', category: 'badges', available: true },
    { id: 6, name: 'Time Freeze', description: 'Pause timer for 10 seconds', cost: 150, icon: '⏰', category: 'boosts', available: true }
  ]);

  const [achievementsState, setAchievementsState] = useState([
    { id: 1, title: 'First Victory', description: 'Win your first match', reward: 100, type: 'coins', completed: true, claimed: true },
    { id: 2, title: 'Perfect Score', description: 'Score 100% in any quiz', reward: 150, type: 'coins', completed: true, claimed: false },
    { id: 3, title: 'Speed Demon', description: 'Answer 10 questions in under 5 seconds each', reward: 200, type: 'xp', completed: false, claimed: false }
  ]);

  const animateCoinReward = (amount: number) => {
    if (amount === 0) return;
    const count = Math.min(Math.abs(amount) / 25, 8);
    const newAnimations = Array.from({ length: count }, (_, i) => Date.now() + i);
    setAnimatingCoins(newAnimations);

    setTimeout(() => setAnimatingCoins([]), 1000);
  };

  const claimDailyReward = (reward: any) => {
    if (!reward.available || reward.claimed) return;

    const newUser = { ...user };
    if (reward.type === 'coins' || reward.type === 'special') {
      newUser.coins += reward.amount;
      animateCoinReward(reward.amount);
    } else if (reward.type === 'xp') {
      newUser.xp += reward.amount;
    }

    setDailyRewardsState(prev => prev.map(r => r.id === reward.id ? { ...r, claimed: true } : r));
    onUpdateUser(newUser);
  };

  const purchaseItem = (item: any) => {
    if (!item.available || user.coins < item.cost) return;

    const newUser = { ...user, coins: user.coins - item.cost };
    onUpdateUser(newUser);

    // Optionally mark the item as purchased
    setShopItemsState(prev => prev.map(i => i.id === item.id ? { ...i, available: false } : i));

    // Animate spending coins
    animateCoinReward(-item.cost);
  };

  const claimAchievement = (achievement: any) => {
    if (!achievement.completed || achievement.claimed) return;

    const newUser = { ...user };
    if (achievement.type === 'coins') {
      newUser.coins += achievement.reward;
      animateCoinReward(achievement.reward);
    } else if (achievement.type === 'xp') {
      newUser.xp += achievement.reward;
    }

    setAchievementsState(prev => prev.map(a => a.id === achievement.id ? { ...a, claimed: true } : a));
    onUpdateUser(newUser);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 relative overflow-hidden">
      {/* Animated Coins */}
      {animatingCoins.map((id) => (
        <div
          key={id}
          className="absolute animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: '2s',
            zIndex: 50
          }}
        >
          <Coins className="w-8 h-8 text-yellow-400" />
        </div>
      ))}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button

            onClick={() => router.push("/lms")}
            className="flex items-center space-x-2 text-black hover:text-purple-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" /><span className="hidden sm:inline font-medium">
  Back to Dashboard
</span>

          </button>
          <h1 className="text-3xl font-bold text-black">Reward Center</h1>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
            <Coins className="w-6 h-6 text-yellow-400" />
            {user ? (user.coins ?? 0).toLocaleString() : '0'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Rewards */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-[#FCD34D]">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center">
                <Gift className="w-6 h-6 mr-3 text-purple-400" />
                Daily Rewards
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">

                {dailyRewardsState.map((reward) => {
                  const isClaimable = reward.available && !reward.claimed;
                  const isClaimed = reward.claimed;

                  return (
                    <div
                      key={reward.id}
                      onClick={() => isClaimable && claimDailyReward(reward)}
                      className={`
    relative
    h-24 sm:h-28
    flex flex-col items-center justify-center
    rounded-xl border-2
    transition-all duration-200
    text-center
    select-none
    ${isClaimed
                          ? "border-green-400 bg-green-100"
                          : isClaimable
                            ? "border-yellow-400 bg-yellow-100 cursor-pointer hover:scale-105"
                            : "border-gray-300 bg-gray-100 opacity-60"
                        }
  `}
                    >
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Day {reward.day}
                      </p>

                      <div className="text-2xl mb-1">
                        {reward.type === "coins" ? "🪙" : reward.type === "xp" ? "⚡" : "🎁"}
                      </div>

                      <p className="text-sm font-bold text-black">
                        {reward.amount}
                      </p>

                      {reward.special && (
                        <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                      )}
                      {isClaimed && (
                        <div className="absolute inset-0 bg-black/10 rounded-xl flex items-center justify-center">
                          <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            ✓
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shop */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[#FCD34D]">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center">
                <ShoppingBag className="w-6 h-6 mr-3 text-blue-400" />
                Coin Shop
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shopItemsState.map((item) => (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-black mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-700 mb-2">{item.description}</p>
                      <div className="flex items-center space-x-2">
                        <Coins className="w-4 h-4 text-yellow-400" />

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Rewards */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[#FCD34D]">
              <h2 className="text-lg font-bold text-black mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-orange-400" />
                Achievement Rewards
              </h2>
              <div className="space-y-3">
                {achievementsState.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border transition-all duration-200 ${achievement.completed && !achievement.claimed
                      ? 'border-green-400/50 bg-green-500/20 cursor-pointer hover:scale-105'
                      : achievement.claimed
                        ? 'border-gray-500/50 bg-gray-500/20 opacity-50'
                        : 'border-blue-400/50 bg-blue-500/10'
                      }`}
                    onClick={() => achievement.completed && !achievement.claimed && claimAchievement(achievement)}
                  >
                    <h3 className="font-bold text-black text-sm mb-1">{achievement.title}</h3>
                    <p className="text-xs text-gray-700 mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {achievement.type === 'coins' ? (
                          <Coins className="w-3 h-3 text-yellow-400" />
                        ) : (
                          <Zap className="w-3 h-3 text-purple-400" />
                        )}
                        <span className="text-xs font-bold text-yellow-400">+{achievement.reward}</span>
                      </div>
                      {achievement.claimed && <span className="text-xs text-green-400">Claimed</span>}
                      {achievement.completed && !achievement.claimed && (
                        <span className="text-xs text-green-400 animate-pulse">Claim!</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[#FCD34D]">
              <h2 className="text-lg font-bold text-black mb-4">Your Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Earned:</span>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">2,450</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">This Week:</span>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">350</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Streak:</span>
                  <span className="text-green-400 font-bold">7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCenter;
