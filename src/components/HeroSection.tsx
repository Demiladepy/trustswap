"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTier } from '@/context/TierContext';
import { TierBadge } from './design-system/TierBadge';
import { ParticleBackground } from './ParticleBackground';
import { Button } from './design-system/Button';
import { getTheme } from '@/lib/theme';
import { TrendingUp, Award, Activity } from 'lucide-react';
import CountUp from 'react-countup';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

const Stat = ({ icon: Icon, label, value }: any) => (
    <div className="flex flex-col items-center gap-1 group">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </div>
        <span className="text-2xl font-bold text-white mt-2">{value}</span>
        <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">{label}</span>
    </div>
);

export const HeroSection = () => {
    const { score, tier, nextTierScore, progressToNextTier, isLoading, setScore } = useTier();
    const theme = getTheme(tier);

    const nextTierName = tier === 'bronze' ? 'silver' : tier === 'silver' ? 'gold' : tier === 'gold' ? 'diamond' : 'MAX';

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20" id="hero">
            {/* Animated particle background */}
            <ParticleBackground tier={tier as any} />

            {/* Gradient overlay system */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0221]/50 to-[#0D0221] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: `radial-gradient(circle, ${theme.primary}, transparent)` }} />

            <div className="relative z-10 container max-w-5xl mx-auto text-center px-4">

                {/* Animated Tier Badge */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, duration: 1 }}
                    className="flex justify-center mb-12"
                >
                    <TierBadge size="hero" />
                </motion.div>

                {/* Score display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-sm uppercase tracking-[0.4em] text-gray-500 font-bold mb-4">
                        FairScale Reputation Score
                    </h2>
                    <div className="relative inline-block">
                        <CountUp
                            end={score}
                            duration={2.5}
                            separator=","
                            className={cn(
                                "text-8xl md:text-[10rem] font-heading font-black bg-clip-text text-transparent bg-gradient-to-b",
                                theme.gradient
                            )}
                            style={{
                                filter: `drop-shadow(0 0 20px ${theme.glow})`
                            }}
                        />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-3xl">
                                <Activity className="w-12 h-12 animate-spin text-white" />
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Progress to next tier */}
                {nextTierScore && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 max-w-xl mx-auto"
                    >
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">
                            <span>{tier}</span>
                            <span style={{ color: theme.primary }}>{nextTierScore - score} XP TO {nextTierName}</span>
                        </div>

                        <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 backdrop-blur-md p-1">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNextTier}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                                className={cn("h-full rounded-full relative", theme.gradient)}
                            >
                                {/* Shimmer */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_white] blur-[2px]" />
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Main Actions */}
                <motion.div
                    className="flex flex-wrap justify-center gap-6 mt-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <Button tier={tier} size="lg" className="min-w-[200px] shadow-2xl" onClick={() => document.getElementById('swap')?.scrollIntoView({ behavior: 'smooth' })}>
                        Start Trading
                    </Button>
                    <Button variant="secondary" tier={tier} size="lg" className="min-w-[200px]" onClick={() => setScore(Math.min(1000, score + 50))}>
                        Simulate Trade (+50 XP)
                    </Button>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-20 flex flex-wrap justify-center gap-12 md:gap-24"
                >
                    <Stat icon={TrendingUp} label="Global Rank" value="#4,291" />
                    <Stat icon={Award} label="Percentile" value="Top 12%" />
                    <Stat icon={Activity} label="Trust Vol" value="1.2M" />
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to Explore</span>
                <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" />
            </motion.div>
        </section>
    );
};
