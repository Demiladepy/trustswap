"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useFairScoreStore } from '@/store/useFairScoreStore';
import { FairScoreData } from '@/api/fairscale';

export type Tier = 'bronze' | 'silver' | 'gold' | 'diamond';

interface TierContextType {
    score: number;
    tier: Tier;
    data: FairScoreData | null;
    nextTierScore: number | null;
    progressToNextTier: number;
    isLoading: boolean;
    refreshScore: () => void;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export const TierProvider = ({ children }: { children: ReactNode }) => {
    const { publicKey, connected } = useWallet();
    const { data, isLoading, fetchScore } = useFairScoreStore();

    // Derived state
    const score = data?.score || 0;
    const tier = (data?.tier as Tier) || 'bronze';

    // Fetch score on connect
    useEffect(() => {
        if (connected && publicKey) {
            fetchScore(publicKey.toString());
        } else {
            // Maybe reset store or keep last?
            // For now, if disconnected, we might want to reset the store manually if needed, 
            // but keeping it until new connect is fine usually. 
            // But to be safe let's re-fetch if publicKey changes.
        }
    }, [connected, publicKey, fetchScore]);

    useEffect(() => {
        // Update body data-tier for global theming
        document.body.setAttribute('data-tier', tier);
    }, [tier]);

    const getNextTierScore = (currentScore: number) => {
        if (currentScore >= 800) return null;
        if (currentScore >= 600) return 800;
        if (currentScore >= 300) return 600;
        return 300;
    };

    const nextTierScore = getNextTierScore(score);

    const calculateProgress = () => {
        if (!nextTierScore) return 100;
        let floor = 0;
        if (score >= 600) floor = 600;
        else if (score >= 300) floor = 300;

        const totalRange = nextTierScore - floor;
        const progress = score - floor;
        return Math.min(100, Math.max(0, (progress / totalRange) * 100));
    };

    const refreshScore = () => {
        if (publicKey) fetchScore(publicKey.toString());
    };

    return (
        <TierContext.Provider value={{
            score,
            tier,
            data,
            nextTierScore,
            progressToNextTier: calculateProgress(),
            isLoading,
            refreshScore
        }}>
            {children}
        </TierContext.Provider>
    );
};

export const useTier = () => {
    const context = useContext(TierContext);
    if (context === undefined) {
        throw new Error('useTier must be used within a TierProvider');
    }
    return context;
};
