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
        standard: "bg-white/5 border-white/10 shadow-xl p-6",
        elevated: "bg-[#1E1E2E]/80 border-white/10 shadow-2xl p-8",
        compact: "bg-white/5 border-white/5 p-4",
        glass: "bg-white/5 border-white/10 shadow-2xl overflow-hidden",
    };

    return (
        <motion.div
            className={cn(
                "rounded-2xl backdrop-blur-xl border transition-all duration-300",
                variants[variant],
                theme && theme.shadow,
                className
            )}
            style={theme ? {
                boxShadow: `0 0 40px ${theme.glow}, 0 20px 25px -5px rgba(0, 0, 0, 0.3)`
            } : {}}
            whileHover={hover ? { y: -4, scale: 1.01 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
