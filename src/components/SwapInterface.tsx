"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Settings, Info, ChevronDown, RotateCw, Wallet } from 'lucide-react';
import { Card } from './design-system/Card';
import { Button } from './design-system/Button';
import { useTier } from '@/context/TierContext';
import { getTokenList, getSwapQuote, executeSwap, Token, SwapQuote } from '@/api/jupiter';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { RiskAnalyzer } from './RiskAnalyzer';

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  token: Token | null;
  balance: string;
  onSelectToken: () => void;
  readOnly?: boolean;
}

const TokenInput = ({
  label,
  value,
  onChange,
  token,
  balance,
  onSelectToken,
  readOnly
}: TokenInputProps) => (
  <div className="bg-[#0D0221]/40 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
    <div className="flex justify-between mb-2">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <span className="text-xs text-gray-500">Balance: {balance}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.0"
          readOnly={readOnly}
          className="w-full bg-transparent text-3xl font-heading font-medium text-white placeholder-gray-600 focus:outline-none"
        />
        <div className="text-sm text-gray-500 mt-1">
          ≈ ${token && value ? (parseFloat(value) * (token.priceUSD || 0)).toFixed(2) : '0.00'}
        </div>
      </div>
      <button
        onClick={onSelectToken}
        className="flex items-center gap-2 bg-[#1E1E2E] hover:bg-[#252535] px-3 py-2 rounded-full border border-white/10 transition-colors"
      >
        {token ? (
          <>
            {token.logoURI && <img src={token.logoURI} alt={token.symbol} className="w-6 h-6 rounded-full" />}
            <span className="font-semibold">{token.symbol}</span>
          </>
        ) : (
          <span>Select</span>
        )}
        <ChevronDown size={14} className="text-gray-400" />
      </button>
    </div>
  </div>
);

export const SwapInterface = () => {
  const { tier, score, refreshScore } = useTier();
  const { publicKey, connected, wallet } = useWallet();
  const { connection } = useConnection();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [payToken, setPayToken] = useState<Token | null>(null);
  const [receiveToken, setReceiveToken] = useState<Token | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Load tokens on mount
  useEffect(() => {
    const loadTokens = async () => {
      const list = await getTokenList();
      setTokens(list);
      // Defaults
      const sol = list.find(t => t.symbol === 'SOL');
      const usdc = list.find(t => t.symbol === 'USDC');
      if (sol) setPayToken(sol);
      if (usdc) setReceiveToken(usdc);
    };
    loadTokens();
  }, []);

  // Fetch Quote Debounced
  useEffect(() => {
    const fetchQuote = async () => {
      if (!payToken || !receiveToken || !payAmount || parseFloat(payAmount) <= 0) {
        setQuote(null);
        return;
      }

      setIsQuoting(true);
      try {
        const q = await getSwapQuote(
          payToken.address,
          receiveToken.address,
          parseFloat(payAmount),
          payToken.decimals
        );
        setQuote(q);
      } catch (e) {
        console.error(e);
      } finally {
        setIsQuoting(false);
      }
    };

    const timeout = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timeout);
  }, [payAmount, payToken, receiveToken]);


  const handleSwap = async () => {
    if (!quote || !publicKey) return;

    setIsSwapping(true);
    try {
      // Mock execution for now as per plan, but structured realistically
      const result = await executeSwap(wallet, quote, connection);

      if (result.success) {
        // Success animation or toast would go here
        alert(`Swap Successful! Tx: ${result.txHash.slice(0, 8)}...`);
        // Refresh score as swap might affect stats
        refreshScore();
        setPayAmount('');
      }
    } catch (e) {
      alert('Swap failed');
    } finally {
      setIsSwapping(false);
    }
  };

  const handleFlip = () => {
    setRotation(prev => prev + 180);
    const tempToken = payToken;
    setPayToken(receiveToken);
    setReceiveToken(tempToken);
    setPayAmount('');
    setQuote(null);
  };

  // Calculate Fee Discount logic for display
  const getFeeDiscount = () => {
    switch (tier) {
      case 'diamond': return 100; // 0% fees
      case 'gold': return 80;
      case 'silver': return 40;
      default: return 0; // Bronze
    }
  };

  const feeSaved = quote ? (quote.fee * (getFeeDiscount() / 100)).toFixed(4) : '0';

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
            token={payToken}
            balance={connected ? "12.45" : "-"} // Would fetch real balance in full implementation
            onSelectToken={() => { }}
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
            value={quote ? (parseInt(quote.outAmount) / (10 ** (receiveToken?.decimals || 6))).toFixed(6) : ''}
            onChange={() => { }}
            token={receiveToken}
            balance={connected ? "450.00" : "-"}
            onSelectToken={() => { }}
            readOnly
          />
        </div>

        {/* Info Section */}
        <AnimatePresence>
          {quote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 text-sm space-y-2"
            >
              <div className="flex justify-between items-center text-gray-400">
                <span className="flex items-center gap-1">Rate <Info size={12} /></span>
                <span className="text-white">1 {payToken?.symbol} ≈ {(parseFloat(quote.outAmount) / parseFloat(quote.inAmount)).toFixed(4)} {receiveToken?.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-primary)] font-medium text-xs flex items-center gap-1">
                  <StarFilled tier={tier} /> {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
                </span>
                <span className="text-green-400 font-bold text-xs">-{getFeeDiscount()}% Fees</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <RiskAnalyzer
          amount={payAmount}
          tokenSymbol={payToken?.symbol || ''}
          userScore={score}
          isVisible={!!payAmount && !!payToken && parseFloat(payAmount) > 0}
        />

        <div className="mt-6">
          {!connected ? (
            <WalletMultiButton style={{ width: '100%', justifyContent: 'center' }} />
          ) : (
            <Button
              variant="primary"
              fullWidth
              size="lg"
              className="rounded-xl shadow-xl shadow-[var(--color-primary)]/20 text-lg"
              onClick={handleSwap}
              isLoading={isSwapping || isQuoting}
              disabled={!payAmount || !quote}
            >
              {isSwapping ? 'Swapping...' : isQuoting ? 'Fetching Rate...' : 'Swap Tokens'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

const StarFilled = ({ tier }: { tier: string }) => {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline-block relative -top-px">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
};
