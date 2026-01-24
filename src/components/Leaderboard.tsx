"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './design-system/Card';
import { getTheme, TierType } from '@/lib/theme';
import { Trophy, Crown, Medal, TrendingUp, User } from 'lucide-react';
import { useTier } from '@/context/TierContext';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const LeaderboardRow = ({
  rank,
  address,
  score,
  tier,
  isCurrentUser
}: {
  rank: number,
  address: string,
  score: number,
  tier: TierType,
  isCurrentUser?: boolean
}) => {
  const theme = getTheme(tier);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (rank % 10) * 0.05 }}
      whileHover={{ x: 4, scale: 1.01 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border backdrop-blur-md",
        isCurrentUser
          ? "bg-white/10 border-white/20 shadow-2xl z-10"
          : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
      )}
    >
      <div className="w-10 flex flex-col items-center">
        {rank === 1 && <Crown className="text-yellow-400 w-6 h-6 mb-1 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" fill="currentColor" />}
        {rank === 2 && <Medal className="text-gray-300 w-5 h-5 mb-1" />}
        {rank === 3 && <Medal className="text-orange-500 w-5 h-5 mb-1" />}
        <span className={cn(
          "font-heading font-black text-lg",
          rank <= 3 ? "text-white" : "text-gray-600"
        )}>
          {rank}
        </span>
      </div>

      <div className="flex-1 flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center p-2 shadow-inner bg-white/5",
          isCurrentUser && "bg-white/10"
        )}>
          {isCurrentUser ? <User className="text-white" size={20} /> : <TrendingUp size={20} className="text-gray-700" />}
        </div>
        <div>
          <div className="font-mono text-sm font-bold text-gray-200">
            {address}
          </div>
          {isCurrentUser && (
            <div className="text-[10px] font-black tracking-widest text-cyan-400 mt-0.5 uppercase">
              Your Position
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xl font-heading font-black text-white">{score}</span>
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 0 8px ${theme.primary}`
            }}
          />
        </div>
        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{tier}</div>
      </div>
    </motion.div>
  );
};

export const Leaderboard = () => {
  const { score, tier } = useTier();

  const dummyData = [
    { address: "8x...92A1", score: 982, tier: "diamond" as TierType },
    { address: "4k...3L9z", score: 945, tier: "diamond" as TierType },
    { address: "2p...M4nB", score: 890, tier: "diamond" as TierType },
    { address: "9z...K2j1", score: 780, tier: "gold" as TierType },
    { address: "5m...P8xR", score: 755, tier: "gold" as TierType },
    { address: "7v...H5c3", score: 620, tier: "gold" as TierType },
    { address: "3b...N9kL", score: 540, tier: "silver" as TierType },
  ];

  return (
    <Card variant="standard" className="h-full flex flex-col relative overflow-hidden group" id="leaderboard">
      {/* Background decoration */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
            <Trophy className="text-yellow-400/80" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black text-white">LEADERBOARD</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Global reputation rankings</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Prize</div>
          <div className="text-xl font-heading font-black text-yellow-400">10,000 USDC</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar relative z-10">
        {dummyData.map((user, index) => (
          <LeaderboardRow key={index} rank={index + 1} {...user} />
        ))}
        {/* Current User Row */}
        <div className="sticky bottom-0 mt-6 pt-4 border-t border-white/10 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent">
          <LeaderboardRow
            rank={4291}
            address="Your Connected Wallet"
            score={score}
            tier={tier as TierType}
            isCurrentUser
          />
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 text-xs font-black uppercase tracking-[0.25em] text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
        >
          Explore Global Ranking
        </motion.button>
      </div>
    </Card>
  );
};
