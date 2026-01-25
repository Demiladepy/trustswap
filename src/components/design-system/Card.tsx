"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { getTheme, TierType } from '@/lib/theme';

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: 'standard' | 'elevated' | 'compact' | 'glass';
    tier?: TierType | string;
    hover?: boolean;
}

export const Card = ({
    className,
    variant = 'standard',
    tier,
    hover = true,
    children,
    ...props
}: CardProps) => {
    const theme = tier ? getTheme(tier) : null;

    const variants = {
        standard: "bg-[#0A0A0A] solana-gradient border border-white/10 shadow-2xl p-8",
        elevated: "bg-[#0A0A0A] solana-gradient border border-white/20 shadow-3xl p-10 glass-panel-heavy",
        compact: "bg-[#0A0A0A] solana-gradient border border-white/10 p-5",
        glass: "bg-white/10 solana-gradient backdrop-blur-2xl border-white/20 shadow-2xl overflow-hidden glass-panel",
    };

    return (
        <motion.div
            className={cn(
                "rounded-2xl border transition-all duration-300 glass-panel solana-gradient",
                variants[variant],
                theme && theme.shadow,
                className
            )}
            style={theme ? {
                boxShadow: `0 0 40px var(--glow-purple), 0 20px 25px -5px rgba(0, 0, 0, 0.3)`
            } : {}}
            whileHover={hover ? { y: -4, scale: 1.02, boxShadow: '0 0 60px var(--glow-green)' } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
