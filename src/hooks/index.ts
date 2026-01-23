/**
 * Custom hook for wallet operations
 */

import { useState, useCallback, useEffect } from 'react';
import { FairScoreData } from '@/types';
import { fetchFairScore, refreshFairScore } from '@/api/fairscale';
import { useAppStore } from '@/store';

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { userScore, setUserScore } = useAppStore();

  // Simulate wallet connection
  const connectWallet = useCallback(async (address?: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // In production: use wallet adapter
      // For demo: use provided address or generate mock one
      const addy = address || 'So1anaSample' + Math.random().toString(36).substring(2, 15);
      setWalletAddress(addy);

      // Fetch FairScore
      const score = await fetchFairScore(addy);
      setUserScore(score);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [setUserScore]);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setError(null);
  }, []);

  const updateScore = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const updatedScore = await refreshFairScore(walletAddress);
      setUserScore(updatedScore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh score');
    }
  }, [walletAddress, setUserScore]);

  return {
    walletAddress,
    isConnecting,
    error,
    userScore,
    connectWallet,
    disconnectWallet,
    updateScore,
    isConnected: !!walletAddress,
  };
};

/**
 * Custom hook for swap operations
 */
import { SwapQuote, Token } from '@/types';
import { getSwapQuote, executeSwap, getTokenList } from '@/api/jupiter';

export const useSwap = (walletAddress: string | null) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tokens on mount
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokenList = await getTokenList();
        setTokens(tokenList);
      } catch (err) {
        console.error('Failed to load tokens:', err);
      }
    };

    loadTokens();
  }, []);

  const fetchQuote = useCallback(
    async (inputMint: string, outputMint: string, amount: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const q = await getSwapQuote(inputMint, outputMint, amount);
        setQuote(q);
        return q;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch quote';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const executeSwapTx = useCallback(
    async (q: SwapQuote) => {
      if (!walletAddress) {
        setError('Wallet not connected');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await executeSwap(walletAddress, q);
        if (!result.success) {
          throw new Error('Swap execution failed');
        }
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Swap failed';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [walletAddress]
  );

  return {
    tokens,
    quote,
    isLoading,
    error,
    fetchQuote,
    executeSwapTx,
  };
};
