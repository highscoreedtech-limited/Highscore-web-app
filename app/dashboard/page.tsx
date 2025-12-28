"use client";

import RankBadge from "@/components/RankBadge";
import {
  //   User,
  Trophy,
  Coins,
  Play,
  Users,
  Gift,
  Settings,
  Zap,
  Target,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function page() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // runs only in the browser
    const stored = localStorage.getItem("username");
    setUsername(stored);
  }, []);
  const getRankProgress = (rank: string, xp: number) => {
    const ranks = [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Master",
      "Grandmaster",
      "Legend",
    ];
    const currentIndex = ranks.indexOf(rank);
    const xpPerRank = 300;
    const currentRankXP = xp % xpPerRank;
    return (currentRankXP / xpPerRank) * 100;
  };

  const recentAchievements = [
    {
      title: "First Victory",
      description: "Win your first match",
      earned: true,
    },
    {
      title: "Math Wizard",
      description: "Score 100% in Mathematics",
      earned: true,
    },
    {
      title: "Quick Learner",
      description: "Complete 10 matches",
      earned: false,
    },
  ];

  const user = {
    id: "1",
    username,
    email: "player@example.com",
    displayName: username,
    rank: "Bronze",
    xp: 150,
    coins: 250,
    avatar: "🎮",
    totalMatches: 15,
    wins: 12,
    winRate: 80,
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-blue-700 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                {user.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user.displayName}!
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <RankBadge rank={user.rank} size="sm" />
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">
                      {user.coins.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              //   onClick={() => onNavigate('profile')}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* XP Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">
                Progress to next rank
              </span>
              <span className="text-sm text-gray-300">{user.xp} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${getRankProgress(user.rank, user.xp)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => router.push("/games")}
            className="bg-gradient-to-br from-indigo-600 to-blue-500  hover:from-indigo-700 hover:to-blue-600 shadow-md p-6 rounded-xl text-white transition-all duration-200 transform hover:scale-105 group hover:shadow-2xl"
          >
            <Play className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-bold text-lg mb-1">Quick Play</h3>
            <p className="text-sm opacity-90">Start a match now</p>
          </button>

          <button
            onClick={() => router.push("/leaderboard")}
            className="bg-gradient-to-br from-amber-400 to-orange-600 p-6 rounded-xl text-white hover:from-amber-500 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 group shadow-lg hover:shadow-2xl"
          >
            <Trophy className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-bold text-lg mb-1">Leaderboard</h3>
            <p className="text-sm opacity-90">View rankings</p>
          </button>

          <button
            // onClick={() => onNavigate('rewards')}
            className="bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-xl text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 group shadow-lg hover:shadow-2xl"
          >
            <Gift className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-bold text-lg mb-1">Rewards</h3>
            <p className="text-sm opacity-90">Claim prizes</p>
          </button>

          <button className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 group opacity-75 cursor-not-allowed shadow-lg">
            <Users className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-bold text-lg mb-1">Friends</h3>
            <p className="text-sm opacity-90">Chat With Friends</p>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white  backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Matches</p>
                <p className="text-slate-900 font-bold text-2xl ">
                  {user.totalMatches}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {user.winRate}%
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Best Subject</p>
                <p className="text-2xl font-bold text-slate-900">Math</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.earned
                    ? "bg-white border-amber-200 shadow-md text-white"
                    : "bg-white/70 border-slate-200 opacity-80 text-white"
                }`}
              >
                <h3 className="font-bold mb-1 text-slate-900">
                  {achievement.title}
                </h3>
                <p className="text-sm opacity-90 text-slate-500">
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-2 bg-amber-50 text-amber-700 border border-amber-100">
                    <span className="text-xs bg-yellow-500/30 px-2 py-1 rounded-full">
                      Earned!
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;