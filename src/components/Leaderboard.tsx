"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './design-system/Card';
import { TierBadge } from './design-system/TierBadge';
import { Trophy, Crown, Medal } from 'lucide-react';
import { useTier } from '@/context/TierContext';

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
  tier: 'bronze' | 'silver' | 'gold' | 'diamond',
  isCurrentUser?: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: rank * 0.05 }}
      className={`
        flex items-center gap-4 p-4 rounded-xl transition-all duration-300
        ${isCurrentUser
          ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)] shadow-[0_0_20px_var(--color-glow)]'
          : 'bg-white/5 border border-transparent hover:bg-white/10'
        }
      `}
    >
      <div className="w-8 font-heading font-bold text-xl text-center text-gray-500">
        {rank <= 3 ? (
          rank === 1 ? <Crown className="text-[var(--color-gold)] w-6 h-6 mx-auto" fill="currentColor" /> :
            rank === 2 ? <Medal className="text-[var(--color-silver)] w-6 h-6 mx-auto" /> :
              <Medal className="text-[var(--color-bronze)] w-6 h-6 mx-auto" />
        ) : rank}
      </div>

      <div className="flex-1">
        <div className="font-mono text-sm tracking-wide text-gray-300">
          {address}
          {isCurrentUser && <span className="ml-2 text-xs bg-[var(--color-primary)] text-black px-2 py-0.5 rounded-full font-bold">YOU</span>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="scale-75 origin-right">
          {/* Simple badge approximation or use real component but small */}
          <div className={`w-3 h-3 rounded-full ${tier === 'diamond' ? 'bg-cyan-400' :
              tier === 'gold' ? 'bg-yellow-400' :
                tier === 'silver' ? 'bg-gray-300' : 'bg-orange-600'
            } shadow-[0_0_10px_currentColor]`} />
        </div>
        <div className="font-heading font-bold text-lg text-white w-16 text-right">
          {score}
        </div>
      </div>
    </motion.div>
  );
};

export const Leaderboard = () => {
  const { score, tier } = useTier(); // Use context for current user

  const dummyData = [
    { address: "8x...92A1", score: 982, tier: "diamond" as const },
    { address: "4k...3L9z", score: 945, tier: "diamond" as const },
    { address: "2p...M4nB", score: 890, tier: "diamond" as const },
    { address: "9z...K2j1", score: 780, tier: "gold" as const },
    { address: "5m...P8xR", score: 755, tier: "gold" as const },
    { address: "7v...H5c3", score: 620, tier: "gold" as const },
    { address: "3b...N9kL", score: 540, tier: "silver" as const },
  ];

  return (
    <Card variant="standard" className="h-full max-h-[600px] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[var(--color-surface)] rounded-xl border border-white/10">
          <Trophy className="text-[var(--color-primary)]" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-heading font-bold">Top Traders</h2>
          <p className="text-sm text-gray-400">Competing for 10,000 USDC</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {dummyData.map((user, index) => (
          <LeaderboardRow key={index} rank={index + 1} {...user} />
        ))}
        {/* Current User Row always visible if not in top list (simulated) */}
        <div className="sticky bottom-0 mt-4 pt-4 border-t border-white/10 bg-gradient-to-t from-[var(--color-surface)] to-transparent p-2">
          <LeaderboardRow
            rank={4291}
            address="You...Wallet"
            score={score}
            tier={tier}
            isCurrentUser
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        className="w-full mt-4 py-3 text-sm font-medium text-[var(--color-primary)] border border-[var(--color-primary)]/30 rounded-xl hover:bg-[var(--color-primary)]/10 transition-colors"
      >
        View Full Leaderboard
      </motion.button>
    </Card>
  );
};
