"use client";

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';

// Utility for merging classes (simple version since we might not have tailwind-merge)
function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

const buttonVariants = cva(
    "relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E2E] focus:ring-[var(--color-primary)] active:scale-95",
    {
        variants: {
            variant: {
                primary: "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-[#1E1E2E] shadow-lg shadow-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/60 hover:scale-[1.02]",
                secondary: "bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
                ghost: "bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5",
                icon: "p-0 aspect-square bg-[var(--color-surface)] text-white hover:bg-[var(--color-surface-hover)]",
            },
            size: {
                default: "h-12 px-8 text-base",
                lg: "h-14 px-10 text-lg", // 56px for hero actions
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
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
        return (
            <motion.button
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <>
                        {leftIcon && <span className="mr-2">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="ml-2">{rightIcon}</span>}
                    </>
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
