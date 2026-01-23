/**
 * Tier Badge Component - Shows user's reputation tier with visual styling
 */

import React from 'react';
import { TierType } from '@/types';
import { TIER_CONFIG } from '@/lib/tier';
import clsx from 'clsx';

interface TierBadgeProps {
  tier: TierType;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  score,
  size = 'md',
  showScore = true,
}) => {
  const config = TIER_CONFIG[tier];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const tierEmoji = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    diamond: '💎',
  };

  return (
    <div
      className={clsx(
        'rounded-lg font-semibold flex items-center gap-2 animate-slideIn',
        sizeClasses[size],
        'bg-gradient-to-r',
        config.gradient,
        'border border-opacity-30 border-white/20'
      )}
      style={{
        boxShadow: `0 0 20px ${config.color}40`,
      }}
    >
      <span>{tierEmoji[tier]}</span>
      <span className="capitalize font-bold">{tier}</span>
      {showScore && score !== undefined && (
        <span className="text-xs opacity-80">({score})</span>
      )}
    </div>
  );
};

/**
 * Button Component - Primary, secondary, and ghost variants
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold shadow-lg shadow-cyan-500/50',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600',
    ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-100 border border-slate-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={clsx(
        'rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95 hover:shadow-lg',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * Card Component - Reusable card container with glass effect
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        'glass rounded-xl p-6 border border-slate-700/50',
        'transition-all duration-200',
        hover && 'hover:border-slate-500/50 hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Loading Skeleton Component
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  circle = false,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        'skeleton bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700',
        'bg-[length:200%_100%]',
        circle && 'rounded-full',
        !circle && 'rounded-lg',
        className
      )}
      style={{
        width,
        height,
        ...(props.style as any),
      }}
    />
  );
};

/**
 * Toast Notification Component
 */

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  React.useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600',
  };

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div
      className={clsx(
        'fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white flex items-center gap-2 animate-slideIn',
        bgColor[type],
        'shadow-lg'
      )}
    >
      <span className="text-lg font-bold">{icon[type]}</span>
      <span>{message}</span>
    </div>
  );
};

/**
 * Progress Bar Component
 */

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'cyan' | 'green' | 'yellow' | 'red';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = true,
  color = 'cyan',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className="w-full">
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
        <div
          className={clsx(
            'h-full transition-all duration-300',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-400 mt-1">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
};
