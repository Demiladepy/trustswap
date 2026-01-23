import { create } from 'zustand';
import { FairScoreData, Quest, StakingPosition, Achievement } from '@/types';

interface AppState {
  // User data
  userScore: FairScoreData | null;
  setUserScore: (score: FairScoreData) => void;

  // Quests
  quests: Quest[];
  updateQuest: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;

  // Staking
  stakingPositions: StakingPosition[];
  addStakingPosition: (position: StakingPosition) => void;
  removeStakingPosition: (positionId: string) => void;

  // Achievements
  achievements: Achievement[];
  unlockAchievement: (achievementId: string) => void;

  // UI State
  isWalletConnected: boolean;
  setWalletConnected: (connected: boolean) => void;

  // Demo mode
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;

  // Daily stats
  dailyVolume: number;
  addToDaily: (amount: number) => void;
  resetDaily: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  userScore: null,
  setUserScore: (score) => set({ userScore: score }),

  quests: [
    {
      id: 'first_swap',
      title: 'Complete First Swap',
      description: 'Make your first token swap',
      reward: 10,
      progress: 0,
      maxProgress: 1,
      completed: false,
      category: 'trading',
    },
    {
      id: 'five_swaps',
      title: '5 Swaps in 24h',
      description: 'Complete 5 swaps within 24 hours',
      reward: 30,
      progress: 0,
      maxProgress: 5,
      completed: false,
      category: 'trading',
    },
    {
      id: 'hold_seven',
      title: 'Hold Position 7 Days',
      description: 'Hold a swap position for 7 days',
      reward: 50,
      progress: 0,
      maxProgress: 7,
      completed: false,
      category: 'trading',
    },
    {
      id: 'refer_friend',
      title: 'Refer a Friend',
      description: 'Successfully refer a new user',
      reward: 100,
      progress: 0,
      maxProgress: 1,
      completed: false,
      category: 'social',
    },
  ],

  updateQuest: (questId, progress) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId ? { ...q, progress: Math.min(progress, q.maxProgress) } : q
      ),
    })),

  completeQuest: (questId) =>
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId
          ? { ...q, completed: true, progress: q.maxProgress }
          : q
      ),
    })),

  stakingPositions: [],
  addStakingPosition: (position) =>
    set((state) => ({
      stakingPositions: [...state.stakingPositions, position],
    })),
  removeStakingPosition: (positionId) =>
    set((state) => ({
      stakingPositions: state.stakingPositions.filter((p) => p.id !== positionId),
    })),

  achievements: [
    {
      id: 'first_swap_badge',
      title: 'First Trade',
      description: 'Complete your first swap',
      icon: '🚀',
      tier: 'bronze',
    },
    {
      id: 'silver_milestone',
      title: 'Rising Star',
      description: 'Reach Silver tier',
      icon: '⭐',
      tier: 'silver',
    },
    {
      id: 'gold_trader',
      title: 'Gold Standard',
      description: 'Reach Gold tier',
      icon: '💛',
      tier: 'gold',
    },
    {
      id: 'diamond_elite',
      title: 'Diamond Elite',
      description: 'Reach Diamond tier',
      icon: '💎',
      tier: 'diamond',
    },
  ],

  unlockAchievement: (achievementId) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === achievementId ? { ...a, unlockedAt: Date.now() } : a
      ),
    })),

  isWalletConnected: false,
  setWalletConnected: (connected) => set({ isWalletConnected: connected }),

  isDemoMode: true,
  setDemoMode: (enabled) => set({ isDemoMode: enabled }),

  dailyVolume: 0,
  addToDaily: (amount) =>
    set((state) => ({
      dailyVolume: state.dailyVolume + amount,
    })),
  resetDaily: () => set({ dailyVolume: 0 }),
}));
