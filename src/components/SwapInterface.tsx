"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Settings, Info, ChevronDown, RotateCw, Wallet, Loader2, Sparkles } from 'lucide-react';
import { Card } from './design-system/Card';
import { Button } from './design-system/Button';
import { useTier } from '@/context/TierContext';
import { getTokenList, getSwapQuote, executeSwap, Token, SwapQuote } from '@/api/jupiter';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { RiskAnalyzer } from './RiskAnalyzer';
import { getTheme } from '@/lib/theme';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

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
  <div className="group relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
    <div className="relative bg-black/40 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
        <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 group/bal">
          <Wallet className="w-3 h-3" />
          Balance: <span className="text-gray-300 font-mono">{balance}</span>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.0"
            readOnly={readOnly}
            className="w-full bg-transparent text-4xl font-heading font-bold text-white placeholder-gray-800 focus:outline-none"
          />
          <div className="text-sm text-gray-600 mt-1 font-medium">
            ≈ ${token && value ? (parseFloat(value) * (token.priceUSD || 0)).toFixed(2) : '0.00'}
          </div>
        </div>
        <button
          onClick={onSelectToken}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 transition-all duration-300 group/btn"
        >
          {token ? (
            <>
              {token.logoURI ? (
                <img src={token.logoURI} alt={token.symbol} className="w-7 h-7 rounded-full shadow-lg" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-[10px] uppercase font-bold text-white">
                  {token.symbol[0]}
                </div>
              )}
              <span className="font-bold text-lg">{token.symbol}</span>
            </>
          ) : (
            <span className="font-bold">Select Token</span>
          )}
          <ChevronDown size={16} className="text-gray-500 group-hover/btn:text-white transition-colors" />
        </button>
      </div>
    </div>
  </div>
);

export const SwapInterface = () => {
  const { tier, score, refreshScore } = useTier();
  const theme = getTheme(tier);
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

  useEffect(() => {
    const loadTokens = async () => {
      const list = await getTokenList();
      setTokens(list);
      const sol = list.find(t => t.symbol === 'SOL');
      const usdc = list.find(t => t.symbol === 'USDC');
      if (sol) setPayToken(sol);
      if (usdc) setReceiveToken(usdc);
    };
    loadTokens();
  }, []);

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
    const toastId = toast.loading('Executing swap on Solana...');

    try {
      const result = await executeSwap(wallet, quote, connection);

      if (result.success) {
        toast.success('Swap Successful!', {
          id: toastId,
          description: `Transferred ${payAmount} ${payToken?.symbol} for tokens. Tx: ${result.txHash.slice(0, 8)}...`,
          icon: <Sparkles className="w-5 h-5 text-green-400" />
        });

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [theme.primary, theme.accent, '#ffffff']
        });

        refreshScore();
        setPayAmount('');
        setQuote(null);
      }
    } catch (e) {
      toast.error('Swap failed', { id: toastId });
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

  const getFeeDiscount = () => {
    switch (tier) {
      case 'diamond': return 100;
      case 'gold': return 80;
      case 'silver': return 40;
      default: return 0;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto relative group" id="swap">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-2xl rounded-[2.5rem] opacity-50 group-hover:opacity-100 transition-opacity" />

      <Card variant="elevated" className="relative z-10 p-2 overflow-visible rounded-[2rem] border-white/10" tier={tier}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-heading font-black text-white tracking-tight">SWAP</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Reputation-Powered Trading</p>
            </div>
            <button className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
              <Settings size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-3 relative">
            <TokenInput
              label="You Pay"
              value={payAmount}
              onChange={setPayAmount}
              token={payToken}
              balance={connected ? "12.45" : "0.00"}
              onSelectToken={() => { }}
            />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.button
                onClick={handleFlip}
                animate={{ rotate: rotation }}
                whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${theme.glow}` }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-[#1E1E2E] transition-all",
                  theme.gradient
                )}
              >
                <ArrowUpDown size={22} className="stroke-[3]" />
              </motion.button>
            </div>

            <TokenInput
              label="You Receive"
              value={quote ? (parseInt(quote.outAmount) / (10 ** (receiveToken?.decimals || 6))).toFixed(6) : ''}
              onChange={() => { }}
              token={receiveToken}
              balance={connected ? "450.00" : "0.00"}
              onSelectToken={() => { }}
              readOnly
            />
          </div>

          <AnimatePresence>
            {quote && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">Exchange Rate <Info size={14} /></span>
                  <span className="text-white font-mono font-bold">1 {payToken?.symbol} ≈ {(parseFloat(quote.outAmount) / parseFloat(quote.inAmount)).toFixed(4)} {receiveToken?.symbol}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3">
                  <span className="text-gray-500 font-medium">Reputation Benefit</span>
                  <div className="flex gap-2">
                    <span className="bg-green-500/20 text-green-400 text-[10px] font-black px-2 py-1 rounded-md tracking-tighter">-{getFeeDiscount()}% FEES</span>
                    <span className="bg-white/5 text-gray-300 text-[10px] font-black px-2 py-1 rounded-md tracking-tighter">DIAMOND TIER</span>
                  </div>
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

          <div className="mt-8">
            {!connected ? (
              <div className="group/wal">
                <WalletMultiButton className="!w-full !h-16 !rounded-2xl !bg-gradient-to-r !from-blue-600 !to-cyan-500 !text-white !font-black !text-lg !shadow-xl !border-none !flex !justify-center !items-center !transition-transform active:!scale-95" />
              </div>
            ) : (
              <Button
                tier={tier}
                fullWidth
                size="lg"
                className="h-16 rounded-2xl text-xl font-heading font-black tracking-widest shadow-2xl"
                onClick={handleSwap}
                isLoading={isSwapping || isQuoting}
                disabled={!payAmount || !quote}
              >
                {isSwapping ? 'EXECUTING...' : isQuoting ? 'GETTING RATE...' : 'SWAP NOW'}
              </Button>
            )}
          </div>

          <div className="mt-6 flex justify-center items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <Shield size={12} />
            Secured by Jupiter API & FairScale Protocol
          </div>
        </div>
      </Card>
    </div>
  );
};
