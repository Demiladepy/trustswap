export const calculateStakingRewards = ({ stakedAmount, duration, userScore, tier }: any) => {
    if (userScore && stakedAmount > userScore) {
        return { allowed: false, maxStake: userScore };
    }

    return {
        allowed: true,
        multiplier: 2,
        feeDiscount: 0.5
    };
};
