import { TierType, UserTier } from '@/types';

export const TIER_CONFIG: Record<TierType, UserTier> = {
  bronze: {
    type: 'bronze',
    minScore: 0,
    maxScore: 299,
    fee: 0.5,
    dailyLimit: 1000,
    features: ['basic_swap', 'standard_support'],
    color: '#B87333',
    gradient: 'from-orange-600 to-orange-400',
  },
  silver: {
    type: 'silver',
    minScore: 300,
    maxScore: 599,
    fee: 0.3,
    dailyLimit: 10000,
    features: ['basic_swap', 'priority_routing', 'priority_support'],
    color: '#C0C0C0',
    gradient: 'from-gray-400 to-gray-300',
  },
  gold: {
    type: 'gold',
    minScore: 600,
    maxScore: 799,
    fee: 0.1,
    dailyLimit: 50000,
    features: [
      'basic_swap',
      'priority_routing',
      'mev_protection',
      'exclusive_pools',
      'limit_orders',
      'analytics',
    ],
    color: '#FFD700',
    gradient: 'from-yellow-500 to-yellow-300',
  },
  diamond: {
    type: 'diamond',
    minScore: 800,
    maxScore: 10000,
    fee: 0,
    dailyLimit: 999999999,
    features: [
      'all_features',
      'priority_routing',
      'mev_protection',
      'exclusive_pools',
      'limit_orders',
      'advanced_analytics',
      'vip_treatment',
      'custom_slippage',
    ],
    color: '#00FFFF',
    gradient: 'from-cyan-400 to-blue-400',
  },
};

export const getTierFromScore = (score: number): TierType => {
  if (score >= 800) return 'diamond';
  if (score >= 600) return 'gold';
  if (score >= 300) return 'silver';
  return 'bronze';
};

export const getTierConfig = (tier: TierType): UserTier => TIER_CONFIG[tier];

export const getScoreTillNextTier = (
  currentScore: number
): { nextTier: TierType; scoreNeeded: number } => {
  const tier = getTierFromScore(currentScore);
  const tiers: TierType[] = ['bronze', 'silver', 'gold', 'diamond'];
  const tierIndex = tiers.indexOf(tier);

  if (tierIndex === tiers.length - 1) {
    // Already at diamond
    return { nextTier: 'diamond', scoreNeeded: 0 };
  }

  const nextTier = tiers[tierIndex + 1];
  const nextTierConfig = getTierConfig(nextTier);

  return {
    nextTier,
    scoreNeeded: Math.max(0, nextTierConfig.minScore - currentScore),
  };
};

export const calculateEffectiveFee = (baseFee: number, tierType: TierType): number => {
  return baseFee * ((100 - TIER_CONFIG[tierType].fee) / 100);
};
