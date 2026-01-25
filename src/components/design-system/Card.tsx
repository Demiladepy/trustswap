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
        standard: "bg-gradient-to-br from-[#181C2A] to-[#232946] border-[#2E3650]/40 shadow-2xl p-8",
        elevated: "bg-gradient-to-br from-[#232946] to-[#181C2A] border-[#3B4261]/60 shadow-3xl p-10",
        compact: "bg-gradient-to-br from-[#232946] to-[#181C2A] border-[#232946]/30 p-5",
        glass: "bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl overflow-hidden",
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
