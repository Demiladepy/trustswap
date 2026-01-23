/**
 * FairScale API Integration
 * Handles FairScore fetching and caching
 */

import { FairScoreData } from '@/types';
import { getTierFromScore } from '@/lib/tier';
import { generateMockScore } from '@/utils';

const FAIRSCALE_API_BASE = process.env.NEXT_PUBLIC_FAIRSCALE_API_URL || 'https://api.fairscale.io';
const FAIRSCALE_API_KEY = process.env.NEXT_PUBLIC_FAIRSCALE_API_KEY;

// In-memory cache for scores
const scoreCache = new Map<string, { data: FairScoreData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch FairScore for a wallet from FairScale API or mock data
 */
export const fetchFairScore = async (wallet: string): Promise<FairScoreData> => {
  // Check cache first
  const cached = scoreCache.get(wallet);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Try real API first
    if (FAIRSCALE_API_KEY) {
      const response = await fetch(`${FAIRSCALE_API_BASE}/api/v1/score/${wallet}`, {
        headers: {
          'Authorization': `Bearer ${FAIRSCALE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const scoreData = transformFairScaleResponse(data, wallet);
        scoreCache.set(wallet, { data: scoreData, timestamp: Date.now() });
        return scoreData;
      }
    }

    // Fallback to mock data
    return generateMockFairScore(wallet);
  } catch (error) {
    console.warn('Failed to fetch FairScore, using mock data:', error);
    return generateMockFairScore(wallet);
  }
};

/**
 * Transform FairScale API response to our format
 */
const transformFairScaleResponse = (apiData: any, wallet: string): FairScoreData => {
  const score = apiData.score || 500;
  return {
    wallet,
    score,
    tier: getTierFromScore(score),
    percentileRank: apiData.percentile || 50,
    lastUpdated: apiData.last_updated || Date.now(),
    trustNetwork: apiData.trust_network || 0,
    successfulTrades: apiData.successful_trades || 0,
    flaggedTrades: apiData.flagged_trades || 0,
    averageTradeSize: apiData.average_trade_size || 0,
    accountAge: Math.floor((Date.now() - (apiData.account_created || Date.now())) / (1000 * 60 * 60 * 24)),
  };
};

/**
 * Generate mock FairScore data for demo
 */
export const generateMockFairScore = (wallet: string): FairScoreData => {
  // Use wallet address as seed for consistent mock data
  const seed = wallet.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const score = generateMockScore(seed);

  return {
    wallet,
    score,
    tier: getTierFromScore(score),
    percentileRank: Math.floor(Math.random() * 100),
    lastUpdated: Date.now(),
    trustNetwork: Math.floor(Math.random() * 50),
    successfulTrades: Math.floor(Math.random() * 500),
    flaggedTrades: Math.floor(Math.random() * 10),
    averageTradeSize: Math.floor(Math.random() * 50000) + 100,
    accountAge: Math.floor(Math.random() * 730), // ~2 years max
  };
};

/**
 * Refresh score (usually after a transaction)
 */
export const refreshFairScore = async (wallet: string): Promise<FairScoreData> => {
  scoreCache.delete(wallet);
  return fetchFairScore(wallet);
};

/**
 * Clear all cache
 */
export const clearScoreCache = (): void => {
  scoreCache.clear();
};

/**
 * Batch fetch scores for multiple wallets
 */
export const fetchScoresBatch = async (wallets: string[]): Promise<FairScoreData[]> => {
  return Promise.all(wallets.map((w) => fetchFairScore(w)));
};

/**
 * Simulate score increase (for demo)
 */
export const simulateScoreIncrease = (
  currentScore: FairScoreData,
  increase: number
): FairScoreData => {
  const newScore = currentScore.score + increase;
  return {
    ...currentScore,
    score: newScore,
    tier: getTierFromScore(newScore),
    lastUpdated: Date.now(),
  };
};
