import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_FAIRSCALE_API_URL || 'https://swagger.api.fairscale.xyz';
const API_KEY = process.env.NEXT_PUBLIC_FAIRSCALE_API_KEY || '';

export interface FairScoreData {
    score: number;
    tier: string;
    rank?: number;
    percentile?: number;
    history?: { date: string; score: number }[];
}

export const getFairScore = async (walletAddress: string): Promise<FairScoreData | null> => {
    try {
        const response = await axios.get(`${API_URL}/score`, {
            headers: {
                'fairkey': API_KEY
            },
            params: {
                wallet: walletAddress
            }
        });

        if (response.data) {
            // Normalize data structure if needed depending on actual API response
            // Assuming response.data contains { score: 123, tier: 'silver', ... }
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching FairScore:', error);
        return null;
    }
};
