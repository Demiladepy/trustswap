'use client';

import React, { useEffect, useState } from 'react';
import { Card, Toast } from './Common';
import { formatCompactNumber, shortenWallet } from '@/utils';

export interface ActivityFeedItem {
  id: string;
  type: 'upgrade' | 'swap' | 'stake' | 'achieve';
  user: string;
  action: string;
  timestamp: number;
  metadata?: {
    tier?: string;
    amount?: number;
    tokenPair?: string;
    achievement?: string;
  };
}

const generateMockActivityFeed = (): ActivityFeedItem[] => {
  const actions = [
    { type: 'upgrade' as const, action: 'upgraded to Gold', tier: 'gold' },
    { type: 'swap' as const, action: 'swapped', tokenPair: 'SOL/USDC' },
    { type: 'achieve' as const, action: 'unlocked', achievement: 'First Swap Master' },
    { type: 'stake' as const, action: 'staked', amount: 1000 },
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    return {
      id: `activity-${i}`,
      type: action.type as any,
      user: shortenWallet(`So${Math.random().toString().slice(2, 42)}`),
      action: action.action,
      timestamp: Date.now() - (i + 1) * 60000,
      metadata: action as any,
    };
  });
};

export const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);

  useEffect(() => {
    setActivities(generateMockActivityFeed());

    // Simulate new activity every 5 seconds
    const interval = setInterval(() => {
      setActivities((prev) => {
        const newActivity = generateMockActivityFeed()[0];
        return [newActivity, ...prev.slice(0, 11)];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upgrade':
        return '📈';
      case 'swap':
        return '🔄';
      case 'achieve':
        return '🏆';
      case 'stake':
        return '💎';
      default:
        return '📌';
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-slate-100">Live Activity</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 hover:border-slate-700/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-cyan-400">{activity.user}</span>
                  {' '}
                  {activity.action}
                  {activity.metadata?.tier && ` to ${activity.metadata.tier}`}
                  {activity.metadata?.tokenPair && ` ${activity.metadata.tokenPair}`}
                </p>
                <p className="text-xs text-slate-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
