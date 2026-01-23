'use client';

import React, { useState } from 'react';
import { Card, Button } from './Common';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  // Bronze Tier
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first swap',
    icon: '👣',
    unlocked: true,
    unlockedAt: Date.now() - 86400000,
    tier: 'bronze',
    rarity: 'common',
  },
  {
    id: 'wallet_warrior',
    title: 'Wallet Warrior',
    description: 'Connect your Solana wallet',
    icon: '🪙',
    unlocked: true,
    unlockedAt: Date.now() - 172800000,
    tier: 'bronze',
    rarity: 'common',
  },
  {
    id: 'trader_trainee',
    title: 'Trader Trainee',
    description: 'Complete 5 swaps',
    icon: '📚',
    unlocked: true,
    unlockedAt: Date.now() - 259200000,
    tier: 'bronze',
    rarity: 'common',
  },
  {
    id: 'small_hodler',
    title: 'Small Hodler',
    description: 'Hold a position for 1 day',
    icon: '⏰',
    unlocked: false,
    tier: 'bronze',
    rarity: 'common',
  },

  // Silver Tier
  {
    id: 'silver_surfer',
    title: 'Silver Surfer',
    description: 'Reach Silver tier',
    icon: '🏄',
    unlocked: true,
    unlockedAt: Date.now() - 345600000,
    tier: 'silver',
    rarity: 'rare',
  },
  {
    id: 'volume_virtuoso',
    title: 'Volume Virtuoso',
    description: 'Trade 100k USDC',
    icon: '📈',
    unlocked: false,
    tier: 'silver',
    rarity: 'rare',
  },
  {
    id: 'community_curator',
    title: 'Community Curator',
    description: 'Refer 3 friends',
    icon: '👥',
    unlocked: false,
    tier: 'silver',
    rarity: 'rare',
  },

  // Gold Tier
  {
    id: 'gold_getter',
    title: 'Gold Getter',
    description: 'Reach Gold tier',
    icon: '🏆',
    unlocked: false,
    tier: 'gold',
    rarity: 'epic',
  },
  {
    id: 'mega_trader',
    title: 'Mega Trader',
    description: 'Complete 100 swaps',
    icon: '⚡',
    unlocked: false,
    tier: 'gold',
    rarity: 'epic',
  },

  // Diamond Tier
  {
    id: 'diamond_don',
    title: 'Diamond Don',
    description: 'Reach Diamond tier',
    icon: '💎',
    unlocked: false,
    tier: 'diamond',
    rarity: 'legendary',
  },
  {
    id: 'oracle',
    title: 'Oracle',
    description: 'Achieve 95%+ trade success rate',
    icon: '🔮',
    unlocked: false,
    tier: 'diamond',
    rarity: 'legendary',
  },
];

export const Achievements: React.FC = () => {
  const [selectedRarity, setSelectedRarity] = useState<Achievement['rarity'] | 'all'>('all');
  const [showNotification, setShowNotification] = useState(false);

  const rarityColors = {
    common: 'border-slate-600 bg-slate-900/50',
    rare: 'border-blue-600 bg-blue-900/20',
    epic: 'border-purple-600 bg-purple-900/20',
    legendary: 'border-yellow-600 bg-yellow-900/20',
  };

  const rarityLabels = {
    common: '⚪ Common',
    rare: '🔵 Rare',
    epic: '🟣 Epic',
    legendary: '🟡 Legendary',
  };

  const filteredAchievements =
    selectedRarity === 'all' ? ALL_ACHIEVEMENTS : ALL_ACHIEVEMENTS.filter((a) => a.rarity === selectedRarity);

  const unlockedCount = ALL_ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalCount = ALL_ACHIEVEMENTS.length;

  const handleAchievementClick = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-400">Achievements Unlocked</p>
            <p className="text-4xl font-bold text-cyan-400">
              {unlockedCount}/{totalCount}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Completion</p>
            <p className="text-3xl font-bold text-green-400">{Math.floor((unlockedCount / totalCount) * 100)}%</p>
          </div>
        </div>
        <div className="mt-4 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </Card>

      {/* Rarity Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'common', 'rare', 'epic', 'legendary'] as const).map((rarity) => (
          <Button
            key={rarity}
            onClick={() => setSelectedRarity(rarity)}
            className={`px-4 py-2 text-sm ${
              selectedRarity === rarity
                ? 'bg-cyan-600 border-cyan-500'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            }`}
          >
            {rarity === 'all' ? '🎯 All' : rarityLabels[rarity]}
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-4 cursor-pointer transition-all transform hover:scale-105 ${
              achievement.unlocked
                ? `${rarityColors[achievement.rarity]} border-2`
                : 'border-slate-700 bg-slate-900/30 opacity-60'
            }`}
            onClick={handleAchievementClick}
          >
            <div className="text-center">
              <div className={`text-5xl mb-3 filter ${achievement.unlocked ? '' : 'grayscale'}`}>
                {achievement.icon}
              </div>
              <h4 className="font-semibold text-slate-100 mb-1">{achievement.title}</h4>
              <p className="text-xs text-slate-400 mb-3">{achievement.description}</p>
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-slate-500">
                  ✓ {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
              {!achievement.unlocked && (
                <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs font-semibold mt-2">
                  <span>🔒</span>
                  <span>Locked</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-cyan-500/50 rounded-lg p-4 text-slate-100 z-50 animate-pulse">
          🎉 Achievement stats coming soon!
        </div>
      )}
    </div>
  );
};
