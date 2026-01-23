"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getFairScore } from '@/lib/fairscale';

export type Tier = 'bronze' | 'silver' | 'gold' | 'diamond';

interface TierContextType {
    score: number;
    tier: Tier;
    setScore: (score: number) => void;
    nextTierScore: number | null;
    progressToNextTier: number;
    isLoading: boolean;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export const TierProvider = ({ children }: { children: ReactNode }) => {
    const { publicKey, connected } = useWallet();
    const [score, setScore] = useState(0); // Default 0
    const [isLoading, setIsLoading] = useState(false);
    const [tier, setTier] = useState<Tier>('bronze');

    useEffect(() => {
        const fetchScore = async () => {
            if (connected && publicKey) {
                setIsLoading(true);
                const data = await getFairScore(publicKey.toString());
                if (data) {
                    setScore(data.score || 0);
                } else {
                    // Fallback or new user
                    setScore(0);
                }
                setIsLoading(false);
            } else {
                setScore(0); // Reset if not connected
            }
        };

        fetchScore();
    }, [connected, publicKey]);

    useEffect(() => {
        // Determine tier based on score
        let newTier: Tier = 'bronze';
        if (score >= 800) newTier = 'diamond';
        else if (score >= 600) newTier = 'gold';
        else if (score >= 300) newTier = 'silver';

        setTier(newTier);

        // Update body data-tier attribute for CSS theming
        document.body.setAttribute('data-tier', newTier);
    }, [score]);

    const getNextTierScore = (currentScore: number) => {
        if (currentScore >= 800) return null;
        if (currentScore >= 600) return 800;
        if (currentScore >= 300) return 600;
        return 300;
    };

    const nextTierScore = getNextTierScore(score);

    // Calculate progress to next tier
    const calculateProgress = () => {
        if (!nextTierScore) return 100;

        let floor = 0;
        if (score >= 600) floor = 600;
        else if (score >= 300) floor = 300;

        const totalRange = nextTierScore - floor;
        const progress = score - floor;

        return Math.min(100, Math.max(0, (progress / totalRange) * 100));
    };

    return (
        <TierContext.Provider value={{
            score,
            tier,
            setScore,
            nextTierScore,
            progressToNextTier: calculateProgress(),
            isLoading
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
