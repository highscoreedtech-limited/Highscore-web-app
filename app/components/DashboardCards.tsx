"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, CheckCircle2, ChevronRight } from "lucide-react";

// --- Streak Card ---
export const StreakCard = ({ streakCount = 5, progress = 50 }) => {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 relative overflow-hidden group hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          </div>
          <span className="font-bold text-gray-800 tracking-tight">DAY {streakCount} STREAK</span>
        </div>
        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
          On Fire!
        </span>
      </div>

      <div className="flex items-center justify-center gap-8">
        <div className="relative flex items-center justify-center w-32 h-32">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#F3F4F6"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#orangeGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
            />
            <defs>
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>
          </svg>
          <div className="text-center">
            <span className="text-3xl font-black text-gray-800">{progress}%</span>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Goal</p>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-gray-700">Keep it up!</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            20 questions left to reach today's goal.
          </p>
        </div>
      </div>

      <button className="mt-6 w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-[0.98]">
        Continue Learning
      </button>
    </motion.div>
  );
};

// --- Daily Challenge Card ---
export const DailyChallengeCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100 flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-xl">🔴</span> Daily Challenge
          </h2>
          <CheckCircle2 className="w-5 h-5 text-gray-300" />
        </div>
        
        <p className="text-sm text-gray-500 mb-6">Complete today's task to earn 50 Gems!</p>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-gray-700">English Grammar</span>
            <span className="text-xs font-bold text-blue-600">10/20 Questions</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "50%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            />
          </div>
        </div>
      </div>

      <button className="mt-8 flex items-center justify-center gap-2 group text-orange-600 font-bold text-sm">
        Start Challenge
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

// --- Category Card ---
export const CategoryCard = ({ title, img, link, onClick }: any) => {
  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-sm group border border-gray-100"
    >
      <img
        src={img}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-all" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-left">
        <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-md">{title}</h3>
        <p className="text-white/70 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Tap to explore
        </p>
      </div>
    </motion.button>
  );
};
