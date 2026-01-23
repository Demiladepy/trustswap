/**
 * Leaderboard Component - Shows top traders by FairScore
 */

'use client';

import React, { useState, useMemo } from 'react';
import { LeaderboardEntry, TierType } from '@/types';
import { Card, TierBadge } from './Common';
import { formatNumber, shortenWallet } from '@/utils';
import { TIER_CONFIG } from '@/lib/tier';

interface LeaderboardProps {
  currentUserWallet?: string;
  currentUserScore?: number;
}

// Generate mock leaderboard data
const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = [];

  for (let i = 0; i < 50; i++) {
    const score = Math.floor(Math.random() * 1000);
    let tier: TierType = 'bronze';
    if (score >= 800) tier = 'diamond';
    else if (score >= 600) tier = 'gold';
    else if (score >= 300) tier = 'silver';

    entries.push({
      rank: i + 1,
      wallet: 'Trader' + Math.random().toString(36).substring(7).toUpperCase(),
      score,
      tier,
      totalVolume: Math.floor(Math.random() * 500000),
      successRate: 85 + Math.random() * 15,
      trustConnections: Math.floor(Math.random() * 100),
    });
  }

  // Sort by score descending
  return entries.sort((a, b) => b.score - a.score).slice(0, 10);
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserWallet, currentUserScore }) => {
  const [leaderboard] = useState(generateMockLeaderboard());

  // Find user's rank
  const userRank = useMemo(() => {
    if (!currentUserScore) return null;

    let rank = 1;
    for (const entry of leaderboard) {
      if (entry.score > currentUserScore) rank++;
    }
    return rank;
  }, [currentUserScore, leaderboard]);

  return (
    <Card className="md:col-span-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Top Traders</h2>
        <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
          Real-time
        </span>
      </div>

      {/* User's Rank */}
      {userRank && (
        <div className="mb-6 p-4 bg-cyan-900/20 border border-cyan-600/50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Your Rank</p>
              <p className="text-2xl font-bold text-cyan-400">#{userRank}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Your Score</p>
              <p className="text-xl font-bold">{currentUserScore}</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {leaderboard.map((entry, idx) => (
          <div
            key={entry.wallet}
            className="flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/60 rounded-lg border border-slate-700/50 transition-colors"
          >
            {/* Rank & Wallet */}
            <div className="flex-1 flex items-center gap-3">
              <div className="text-right w-8">
                <span className="font-bold text-lg">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${entry.rank}`}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{entry.wallet}</p>
                <p className="text-xs text-slate-500">
                  Vol: ${formatNumber(entry.totalVolume / 1000, 1)}K
                </p>
              </div>
            </div>

            {/* Tier Badge */}
            <div className="ml-2">
              <TierBadge tier={entry.tier} score={entry.score} size="sm" showScore={true} />
            </div>

            {/* Success Rate */}
            <div className="ml-4 text-right hidden md:block">
              <p className="text-xs text-slate-500">Success</p>
              <p className="text-sm font-semibold text-green-400">
                {entry.successRate.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">Avg Score</p>
          <p className="text-lg font-bold">
            {Math.round(leaderboard.reduce((a, b) => a + b.score, 0) / leaderboard.length)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Total Volume</p>
          <p className="text-lg font-bold">
            ${formatNumber(leaderboard.reduce((a, b) => a + b.totalVolume, 0) / 1e6, 1)}M
          </p>
        </div>
      </div>
    </Card>
  );
};
