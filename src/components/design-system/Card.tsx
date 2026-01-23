"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: 'standard' | 'elevated' | 'compact' | 'glass';
    glow?: boolean;
}

export const Card = ({
    className,
    variant = 'standard',
    glow = false,
    children,
    ...props
}: CardProps) => { // turbo

    const variants = {
        standard: "rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-6 hover:-translate-y-1 transition-transform duration-300",
        elevated: "rounded-2xl bg-[#1E1E2E]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-8",
        compact: "rounded-xl bg-white/5 backdrop-blur-md border border-white/5 p-4",
        glass: "rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10",
    };

    return (
        <motion.div
            className={cn(
                variants[variant],
                glow && "shadow-[0_0_40px_-5px_var(--color-glow)] border-[var(--color-primary)]/30",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
