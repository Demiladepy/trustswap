import { analyzeSwapRisk } from '@/api/claude';

export const analyzeRiskWithAI = async ({ amount, token, userScore }: any) => {
    const result = await analyzeSwapRisk(amount, token, userScore);
    return result;
};
