"use client";

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTier } from '@/context/TierContext';
import { TierBadge } from './design-system/TierBadge';
import { ParticleBackground } from './ParticleBackground';
import { Button } from './design-system/Button';
import { Wallet } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const HeroSection = () => {
    const { score, tier, nextTierScore, progressToNextTier, setScore, isLoading } = useTier();

    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = score;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

            setDisplayScore(Math.floor(start + (end - start) * easeOutQuart(progress)));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    return (
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20 z-10">
            {/* Background Ambience */}
            <ParticleBackground tier={tier} />
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary)] opacity-10 blur-[100px] rounded-full animate-pulse-slow" />
            </div>

            <div className="relative z-10 container max-w-4xl mx-auto text-center space-y-12">

                {/* Animated Badge & Score */}
                <div className="flex flex-col items-center gap-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <TierBadge size="hero" />
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-7xl md:text-9xl font-heading font-bold gradient-text text-transparent bg-clip-text bg-gradient-to-b from-white to-[var(--color-primary)] drop-shadow-2xl">
                            {isLoading ? '...' : displayScore}
                        </h1>
                        <p className="text-xl text-gray-400 font-medium tracking-wide mt-2">FAIRSCALE REPUTATION SCORE</p>
                    </motion.div>
                </div>

                {/* Progress Bar */}
                {nextTierScore && (
                    <motion.div
                        className="w-full max-w-lg mx-auto space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex justify-between text-sm font-medium text-gray-400">
                            <span>{tier.toUpperCase()}</span>
                            <span className="text-[var(--color-primary)]">{nextTierScore - score} points to next tier</span>
                        </div>

                        <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] relative"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNextTier}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_white]" />
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-wrap justify-center gap-4 relative z-20"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <div className="rounded-full shadow-2xl shadow-[var(--color-primary)]/20 overflow-hidden">
                        <WalletMultiButton style={{
                            backgroundColor: 'var(--color-primary)',
                            height: '56px',
                            borderRadius: '9999px',
                            paddingLeft: '32px',
                            paddingRight: '32px',
                            fontWeight: 600,
                            fontSize: '1.125rem'
                        }} />
                    </div>

                    <Button variant="secondary" size="lg" className="rounded-full" onClick={() => setScore(Math.min(1000, score + 50))}>
                        Simulate Trade (+50 XP)
                    </Button>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                >
                    {[
                        { label: "Rank", value: "#4,291" },
                        { label: "Top", value: "12%" },
                        { label: "Trades", value: "1,204" },
                        { label: "Trust", value: "Verified" },
                    ].map((stat, i) => (
                        <div key={i} className="space-y-1">
                            <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                            <div className="text-xs uppercase tracking-wider text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
