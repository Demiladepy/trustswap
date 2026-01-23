"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Settings, Info, ChevronDown } from 'lucide-react';
import { Card } from './design-system/Card';
import { Button } from './design-system/Button';
import { useTier } from '@/context/TierContext';

interface Token {
  symbol: string;
  price: number;
}

const TokenInput = ({
  label,
  value,
  onChange,
  token,
  balance
}: {
  label: string,
  value: string,
  onChange: (v: string) => void,
  token: Token,
  balance: string
}) => (
  <div className="bg-[#0D0221]/40 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
    <div className="flex justify-between mb-2">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <span className="text-xs text-gray-500">Balance: {balance}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.0"
          className="w-full bg-transparent text-3xl font-heading font-medium text-white placeholder-gray-600 focus:outline-none"
        />
        <div className="text-sm text-gray-500 mt-1">≈ ${value ? (parseFloat(value) * token.price).toFixed(2) : '0.00'}</div>
      </div>
      <button className="flex items-center gap-2 bg-[#1E1E2E] hover:bg-[#252535] px-3 py-2 rounded-full border border-white/10 transition-colors">
        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
          {token.symbol[0]}
        </div>
        <span className="font-semibold">{token.symbol}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
    </div>
  </div>
);

export const SwapInterface = () => {
  const { tier } = useTier();
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setPayAmount('');
      setReceiveAmount('');
    }, 2000);
  };

  const handleFlip = () => {
    setRotation(prev => prev + 180);
    const temp = payAmount;
    setPayAmount(receiveAmount);
    setReceiveAmount(temp);
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="absolute -inset-4 bg-[var(--color-primary)] opacity-20 blur-2xl rounded-full" />

      <Card variant="elevated" className="relative z-10 transition-colors duration-500 border-t border-[var(--color-primary)]/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-heading font-semibold text-white">Swap</h2>
          <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-full">
            <Settings size={20} />
          </Button>
        </div>

        <div className="space-y-2 relative">
          <TokenInput
            label="You Pay"
            value={payAmount}
            onChange={setPayAmount}
            token={{ symbol: 'SOL', price: 140.50 }}
            balance="12.45"
          />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.button
              onClick={handleFlip}
              animate={{ rotate: rotation }}
              className="w-10 h-10 rounded-xl bg-[#1E1E2E] border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-lg hover:scale-110 active:scale-95 transition-transform"
            >
              <ArrowUpDown size={20} />
            </motion.button>
          </div>

          <TokenInput
            label="You Receive"
            value={receiveAmount}
            onChange={setReceiveAmount}
            token={{ symbol: 'USDC', price: 1.00 }}
            balance="450.00"
          />
        </div>

        {/* Info Section */}
        <div className="mt-4 p-3 rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 text-sm space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="flex items-center gap-1">Rate <Info size={12} /></span>
            <span className="text-white">1 SOL ≈ 140.50 USDC</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--color-primary)] font-medium text-xs flex items-center gap-1">
              <StarFilled tier={tier} /> {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier Discounts
            </span>
            <span className="text-green-400 font-bold text-xs">-20% Fees</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            className="rounded-xl shadow-xl shadow-[var(--color-primary)]/20 text-lg"
            onClick={handleSwap}
            isLoading={isSwapping}
            disabled={!payAmount}
          >
            {isSwapping ? 'Swapping...' : 'Swap Tokens'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const StarFilled = ({ tier }: { tier: string }) => {
  // Simple tiered star visual
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline-block relative -top-px">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
};
