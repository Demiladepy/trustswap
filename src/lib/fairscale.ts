import { fetchFairScore as apiFetch, getTierFromScore } from '@/api/fairscale';

export const fetchFairScore = async (wallet: string) => {
    return await apiFetch(wallet);
};

export const calculateTier = (score: number) => {
    return getTierFromScore(score);
};

export const getTierBenefits = (tier: string) => {
    const benefits = {
        bronze: {
            fee: 0.005,
            dailyLimit: 1000,
            features: ['basic_swaps']
        },
        silver: {
            fee: 0.003,
            dailyLimit: 10000,
            features: ['basic_swaps', 'priority_support']
        },
        gold: {
            fee: 0.001,
            dailyLimit: 50000,
            features: ['basic_swaps', 'priority_support', 'limit_orders']
        },
        diamond: {
            fee: 0,
            dailyLimit: Infinity,
            features: ['basic_swaps', 'priority_support', 'limit_orders', 'diamond_pool', 'zero_slippage']
        }
    };
    return benefits[tier as keyof typeof benefits] || benefits.bronze;
};
