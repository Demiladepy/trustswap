"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CircleDot, Star, Crown, Gem } from 'lucide-react';
import { useTier } from '@/context/TierContext';
import { clsx, type ClassValue } from 'clsx';

import { getTheme, TierType } from '@/lib/theme';

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface TierBadgeProps {
    size?: 'sm' | 'md' | 'lg' | 'hero';
    showLabel?: boolean;
}

export const TierBadge = ({ size = 'md', showLabel = true }: TierBadgeProps) => {
    const { tier, score } = useTier();
    const theme = getTheme(tier);

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-20 h-20",
        hero: "w-32 h-32",
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 32,
        hero: 64,
    };

    const icons = {
        bronze: CircleDot,
        silver: Star,
        gold: Crown,
        diamond: Gem,
    };

    const TierIcon = icons[tier as keyof typeof icons] || icons.bronze;

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
                {/* Rotating outer glow */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 scale-110 pointer-events-none"
                >
                    <div
                        className={cn(
                            "rounded-full blur-2xl opacity-60",
                            size === 'hero' ? 'w-32 h-32 blur-3xl' : 'w-12 h-12 blur-xl'
                        )}
                        style={{ background: theme.glow }}
                    />
                </motion.div>

                {/* Badge Circle */}
                <motion.div
                    className={cn(
                        "relative flex items-center justify-center rounded-full border-2 bg-gray-900/80 backdrop-blur-md",
                        sizeClasses[size]
                    )}
                    style={{ borderColor: theme.primary }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    {/* Gradient border */}
                    <div className={cn(
                        "absolute inset-0 rounded-full bg-gradient-to-br p-[2px]",
                        theme.gradient
                    )}>
                        <div className="w-full h-full rounded-full bg-gray-900" />
                    </div>

                    {/* Pulse effect */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 pointer-events-none"
                        style={{ borderColor: theme.primary }}
                    />

                    <TierIcon
                        size={iconSizes[size]}
                        className="relative z-10"
                        style={{ color: theme.primary }}
                    />
                </motion.div>
            </div>

            {showLabel && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <span className={cn(
                        "block font-heading font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r",
                        theme.gradient,
                        size === 'hero' ? 'text-2xl' : 'text-xs'
                    )}>
                        {tier} Tier
                    </span>
                </motion.div>
            )}
        </div>
    );
};
