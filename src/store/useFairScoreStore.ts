import { create } from 'zustand';
import { FairScoreData, fetchFairScore, generateMockFairScore, getTierFromScore } from '@/api/fairscale';

interface FairScoreState {
    data: FairScoreData | null;
    isLoading: boolean;
    error: string | null;
    fetchScore: (wallet: string) => Promise<void>;
    setScore: (data: FairScoreData) => void;
    reset: () => void;
}

export const useFairScoreStore = create<FairScoreState>((set) => ({
    data: null,
    isLoading: false,
    error: null,

    fetchScore: async (wallet: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await fetchFairScore(wallet);
            set({ data, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: 'Failed to fetch score',
                data: generateMockFairScore(wallet) // Fallback to mock on error to keep UI working
            });
        }
    },

    setScore: (data) => set({ data }),
    reset: () => set({ data: null, error: null, isLoading: false })
}));
