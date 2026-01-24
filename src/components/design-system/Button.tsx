"use client";

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';

import { getTheme, TierType } from '@/lib/theme';

// Utility for merging classes
function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

const buttonVariants = cva(
    "relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden",
    {
        variants: {
            variant: {
                primary: "text-white shadow-lg",
                secondary: "bg-white/5 border-2 hover:bg-white/10",
                ghost: "bg-transparent hover:bg-white/5",
                icon: "p-0 aspect-square bg-white/5 text-white hover:bg-white/10",
            },
            size: {
                default: "h-12 px-8 text-base",
                lg: "h-14 px-10 text-lg",
                sm: "h-10 px-4 text-sm",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
            fullWidth: false,
        },
    }
);

export interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    tier?: TierType | string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, isLoading, leftIcon, rightIcon, tier, children, ...props }, ref) => {
        const theme = tier ? getTheme(tier) : getTheme('bronze');

        const getTierStyles = () => {
            if (variant === 'primary') {
                return `bg-gradient-to-r ${theme.gradient} ${theme.shadow}`;
            }
            if (variant === 'secondary') {
                return `border-[${theme.primary}] text-[${theme.primary}]`;
            }
            return '';
        };

        // Manual style for colors that tailwind might not pick up dynamically
        const customStyle: React.CSSProperties = {};
        if (tier) {
            if (variant === 'secondary') customStyle.borderColor = theme.primary;
            if (variant === 'secondary' || variant === 'ghost') customStyle.color = theme.primary;
        }

        return (
            <motion.button
                className={cn(buttonVariants({ variant, size, fullWidth }), getTierStyles(), className)}
                ref={ref}
                style={customStyle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                {...props}
            >
                <div className="relative flex items-center justify-center">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            {leftIcon && <span className="mr-2">{leftIcon}</span>}
                            {children}
                            {rightIcon && <span className="ml-2">{rightIcon}</span>}
                        </>
                    )}

                    {/* Shimmer effect on hover */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                    />
                </div>
            </motion.button>
        );
    }
);

Button.displayName = "Button";
