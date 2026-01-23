/**
 * Swap Interface Component - Main trading UI
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useSwap } from '@/hooks';
import { useAppStore } from '@/store';
import { Button, Card, ProgressBar, Skeleton } from './Common';
import { TIER_CONFIG, getTierConfig } from '@/lib/tier';
import { formatNumber, formatCurrency } from '@/utils';
import { FairScoreData } from '@/types';
import clsx from 'clsx';

interface SwapInterfaceProps {
  walletAddress: string | null;
  userScore: FairScoreData | null;
}

export const SwapInterface: React.FC<SwapInterfaceProps> = ({ walletAddress, userScore }) => {
  const { tokens, quote, isLoading, error, fetchQuote, executeSwapTx } = useSwap(walletAddress);
  const { addToDaily, dailyVolume } = useAppStore();

  const [inputToken, setInputToken] = useState<string>('');
  const [outputToken, setOutputToken] = useState<string>('');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slippage, setSlippage] = useState(0.5);

  // Calculate fees and limits
  const tierConfig = userScore ? getTierConfig(userScore.tier) : null;
  const effectiveFee = quote ? (quote.outputAmount * (tierConfig?.fee || 0.5)) / 100 : 0;
  const dailyRemaining = tierConfig ? tierConfig.dailyLimit - dailyVolume : 0;
  const canSwap = dailyRemaining > 0 && walletAddress;

  // Fee breakdown
  const feeBreakdown = useMemo(() => {
    if (!quote || !tierConfig) return null;

    const swapAmount = quote.inputAmount;
    const feeCost = swapAmount * (tierConfig.fee / 100);
    const bronzeCost = swapAmount * 0.005; // 0.5%
    const savings = bronzeCost - feeCost;

    return { feeCost, bronzeCost, savings, swapAmount };
  }, [quote, tierConfig]);

  const handleSwap = async () => {
    if (!quote || !canSwap) return;

    try {
      const result = await executeSwapTx(quote);
      if (result?.success) {
        addToDaily(quote.inputAmount);
        // Reset form
        setInputAmount('');
        alert('✓ Swap successful!');
      }
    } catch (err) {
      console.error('Swap failed:', err);
    }
  };

  const handleQuote = async () => {
    if (!inputToken || !outputToken || !inputAmount) return;

    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) return;

    await fetchQuote(inputToken, outputToken, amount);
  };

  return (
    <Card className="md:col-span-2">
      <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>

      {/* Token Pair Selection */}
      <div className="space-y-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Input Token */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">From</label>
            <select
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Select token...</option>
              {tokens.map((t) => (
                <option key={t.address} value={t.address}>
                  {t.symbol} - {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Output Token */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">To</label>
            <select
              value={outputToken}
              onChange={(e) => setOutputToken(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Select token...</option>
              {tokens.map((t) => (
                <option key={t.address} value={t.address}>
                  {t.symbol} - {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-slate-400">Amount</label>
            <span className="text-xs text-slate-500">
              Daily: ${formatNumber(dailyVolume, 0)} / ${formatNumber(tierConfig?.dailyLimit || 0, 0)}
            </span>
          </div>
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
          />
          <div className="mt-2">
            <ProgressBar
              value={dailyVolume}
              max={tierConfig?.dailyLimit || 1}
              showLabel={false}
              color={dailyRemaining > 0 ? 'cyan' : 'red'}
            />
          </div>
        </div>
      </div>

      {/* Get Quote Button */}
      <Button
        onClick={handleQuote}
        isLoading={isLoading}
        className="w-full mb-6"
        disabled={!inputToken || !outputToken || !inputAmount}
      >
        {isLoading ? 'Getting Quote...' : 'Get Quote'}
      </Button>

      {/* Quote Display */}
      {quote && !isLoading && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">You send</span>
            <span className="font-semibold">{formatNumber(quote.inputAmount, 4)} SOL</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">You receive</span>
            <span className="text-lg font-bold text-green-400">
              {formatNumber(quote.outputAmount, 4)} USDC
            </span>
          </div>

          <hr className="border-slate-600" />

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Price Impact</span>
            <span className={clsx(quote.priceImpactPct > 1 ? 'text-red-400' : 'text-green-400')}>
              {quote.priceImpactPct.toFixed(2)}%
            </span>
          </div>

          {feeBreakdown && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Your Fee</span>
                <span className="text-cyan-300">
                  {formatNumber(feeBreakdown.feeCost, 4)} SOL ({tierConfig?.fee}%)
                </span>
              </div>

              <div className="flex justify-between text-sm bg-green-900/30 p-2 rounded border border-green-700/50">
                <span className="text-green-300">Your Savings</span>
                <span className="text-green-400 font-bold">
                  {formatNumber(feeBreakdown.savings, 4)} SOL
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 mb-6 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Daily Limit Warning */}
      {tierConfig && dailyRemaining <= 0 && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 mb-6 text-yellow-200 text-sm">
          Daily limit reached. Come back tomorrow!
        </div>
      )}

      {/* Advanced Options */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-cyan-400 hover:underline"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Options
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-3 bg-slate-800/30 p-3 rounded-lg border border-slate-700">
            <div>
              <label className="text-sm text-slate-400 mb-2 flex justify-between">
                <span>Slippage Tolerance</span>
                <span className="text-cyan-400">{slippage}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {userScore?.tier === 'gold' || userScore?.tier === 'diamond' ? (
              <div className="p-2 bg-green-900/30 border border-green-600 rounded text-xs text-green-300">
                ✓ MEV Protection enabled for {userScore.tier} tier
              </div>
            ) : null}

            {userScore?.tier === 'diamond' ? (
              <div className="p-2 bg-cyan-900/30 border border-cyan-600 rounded text-xs text-cyan-300">
                ✓ Custom slippage limits enabled for Diamond tier
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Execute Swap */}
      <div className="space-y-2">
        <Button
          onClick={handleSwap}
          disabled={!quote || !canSwap || isLoading}
          isLoading={isLoading}
          className="w-full text-lg py-3"
        >
          {!walletAddress
            ? 'Connect Wallet'
            : !canSwap
            ? 'Limit Reached'
            : isLoading
            ? 'Swapping...'
            : 'Confirm Swap'}
        </Button>

        {!walletAddress && (
          <p className="text-xs text-slate-500 text-center">Connect wallet to start trading</p>
        )}

        {userScore && userScore.tier === 'bronze' && (
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-xs text-slate-400">
            💡 Upgrade to Silver tier to reduce fees to 0.3%
          </div>
        )}
      </div>
    </Card>
  );
};
