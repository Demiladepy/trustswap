import { getTierBenefits } from './fairscale';

export const checkFeatureAccess = (tier: string, feature: string) => {
    const benefits = getTierBenefits(tier);
    return benefits.features.includes(feature);
};

export const applyTierRewards = (tier: string, volume: number) => {
    const benefits = getTierBenefits(tier);
    const bronzeBenefits = getTierBenefits('bronze');

    const fee = volume * benefits.fee;
    const bronzeFee = volume * bronzeBenefits.fee;

    return {
        fee,
        savingsVsBronze: bronzeFee - fee,
        xpMultiplier: tier === 'diamond' ? 4 : tier === 'gold' ? 2 : 1
    };
};

export const assessRisk = (tier: string, amount: number, context: any = {}) => {
    const benefits = getTierBenefits(tier);

    if (amount > benefits.dailyLimit) {
        return { allowed: false, reason: 'Exceeds daily limit for your tier' };
    }

    if (tier === 'bronze' && amount > 500) {
        return { allowed: true, warning: 'High volume trade for Bronze tier. Extra verification suggested.' };
    }

    if (context.isNew && amount > 100) {
        return { allowed: true, flagged: true, reason: 'New account high value trade' };
    }

    return { allowed: true };
};
