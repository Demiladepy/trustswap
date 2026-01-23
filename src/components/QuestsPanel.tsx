'use client';

import React, { useEffect, useState } from 'react';
import { Card, ProgressBar } from './Common';
import { useAppStore } from '@/store';

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

const QUESTS: Quest[] = [
  {
    id: 'first_swap',
    title: 'First Swap',
    description: 'Complete your first swap',
    icon: '🔄',
    progress: 0,
    target: 1,
    reward: 10,
    completed: false,
  },
  {
    id: 'five_swaps',
    title: 'Swap Master',
    description: 'Complete 5 swaps in 24 hours',
    icon: '⚡',
    progress: 0,
    target: 5,
    reward: 30,
    completed: false,
  },
  {
    id: 'hold_seven',
    title: 'Hodler',
    description: 'Hold a position for 7 days',
    icon: '💎',
    progress: 0,
    target: 7,
    reward: 50,
    completed: false,
  },
  {
    id: 'refer_friend',
    title: 'Community Builder',
    description: 'Refer a friend to TrustSwap',
    icon: '👥',
    progress: 0,
    target: 1,
    reward: 100,
    completed: false,
  },
];

export const QuestsPanel: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(QUESTS);
  const [xp, setXp] = useState(0);
  const userScore = useAppStore((state) => state.userScore);

  useEffect(() => {
    // Simulate quest progress
    const interval = setInterval(() => {
      setQuests((prev) =>
        prev.map((quest) => {
          if (quest.completed) return quest;
          const newProgress = Math.min(quest.target, quest.progress + Math.random() * 0.5);
          const isCompleted = newProgress >= quest.target;
          if (isCompleted && !quest.completed) {
            setXp((x) => x + quest.reward);
          }
          return { ...quest, progress: newProgress, completed: isCompleted };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalXp = xp + (userScore?.score || 0);
  const level = Math.floor(totalXp / 100) + 1;
  const levelProgress = (totalXp % 100) / 100;

  return (
    <div className="space-y-6">
      {/* Level Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm text-slate-400">Level</h3>
            <p className="text-4xl font-bold text-purple-400">{level}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm text-slate-400">Total XP</h3>
            <p className="text-2xl font-bold text-pink-400">{Math.floor(totalXp)}</p>
          </div>
        </div>
        <ProgressBar value={levelProgress * 100} showLabel={true} />
        <p className="text-xs text-slate-400 mt-2">{Math.floor(levelProgress * 100)}% to Level {level + 1}</p>
      </Card>

      {/* Quests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Daily Quests</h3>
        {quests.map((quest) => (
          <Card
            key={quest.id}
            className={`p-4 transition-all ${
              quest.completed ? 'border-green-700/50 bg-green-900/10' : 'border-slate-700/50'
            }`}
          >
            <div className="flex gap-4">
              <span className="text-3xl">{quest.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-100">{quest.title}</h4>
                    <p className="text-sm text-slate-400">{quest.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-yellow-400">+{quest.reward} XP</p>
                    {quest.completed && <p className="text-xs text-green-400">✓ Completed</p>}
                  </div>
                </div>
                <ProgressBar
                  value={(quest.progress / quest.target) * 100}
                  showLabel={true}
                />
                <p className="text-xs text-slate-400 mt-1">{Math.floor(quest.progress)}/{quest.target}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Streak Counter */}
      <Card className="p-4 bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Daily Streak</p>
            <p className="text-3xl font-bold text-orange-400">7 🔥</p>
          </div>
          <p className="text-sm text-slate-300">Keep trading daily to maintain!</p>
        </div>
      </Card>
    </div>
  );
};
