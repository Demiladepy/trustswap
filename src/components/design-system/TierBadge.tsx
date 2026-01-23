"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CircleDot, Star, Crown, Gem } from 'lucide-react';
import { useTier } from '@/context/TierContext';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface TierBadgeProps {
    size?: 'sm' | 'md' | 'lg' | 'hero';
    showLabel?: boolean;
}

export const TierBadge = ({ size = 'md', showLabel = true }: TierBadgeProps) => {
    const { tier } = useTier();

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-20 h-20",
        hero: "w-32 h-32",
    };

    const iconSizes = {
        sm: 16,
        md: 24,
        lg: 40,
        hero: 64,
    };

    const TierIcon = {
        bronze: CircleDot,
        silver: Star,
        gold: Crown,
        diamond: Gem,
    }[tier];

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
                {/* Glow Effect */}
                <motion.div
                    className={cn(
                        "absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-40 blur-xl",
                        size === 'hero' ? 'blur-3xl' : 'blur-xl'
                    )}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Badge Circle */}
                <motion.div
                    className={cn(
                        "relative flex items-center justify-center rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-surface)]/50 backdrop-blur-md shadow-[0_0_15px_var(--color-glow)]",
                        sizeClasses[size]
                    )}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                >
                    {/* Rotating Ring */}
                    <motion.div
                        className="absolute inset-[-2px] rounded-full border-t-2 border-[var(--color-primary)] opacity-80"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />

                    <TierIcon
                        size={iconSizes[size]}
                        className="text-[var(--color-primary)] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                </motion.div>
            </div>

            {showLabel && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <span className="block font-heading font-bold uppercase tracking-widest text-[var(--color-primary)] text-glow">
                        {tier} Tier
                    </span>
                </motion.div>
            )}
        </div>
    );
};
