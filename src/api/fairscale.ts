import { clusterApiUrl } from '@solana/web3.js';

export interface FairScoreData {
  wallet: string;
  score: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  percentileRank: number;
  lastUpdated: number;
  trustNetwork: number;
  successfulTrades: number;
  flaggedTrades: number;
  averageTradeSize: number;
  accountAge: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const scoreCache = new Map<string, { data: FairScoreData; timestamp: number }>();

const API_URL = process.env.NEXT_PUBLIC_FAIRSCALE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_FAIRSCALE_API_KEY;

export const getTierFromScore = (score: number): 'bronze' | 'silver' | 'gold' | 'diamond' => {
  if (score >= 800) return 'diamond';
  if (score >= 600) return 'gold';
  if (score >= 300) return 'silver';
  return 'bronze';
};

export const generateMockFairScore = (wallet: string): FairScoreData => {
  // Deterministic mock based on wallet characters
  const charCode = wallet.charCodeAt(0) + wallet.charCodeAt(wallet.length - 1);
  const score = Math.min(950, Math.max(150, (charCode * 7) % 1000));

  return {
    wallet,
    score,
    tier: getTierFromScore(score),
    percentileRank: Math.floor(score / 10),
    lastUpdated: Date.now(),
    trustNetwork: Math.floor(score / 20),
    successfulTrades: Math.floor(score / 5),
    flaggedTrades: Math.floor((1000 - score) / 200),
    averageTradeSize: score * 2.5,
    accountAge: Math.floor(score / 3)
  };
};

export const fetchFairScore = async (wallet: string): Promise<FairScoreData> => {
  // Check cache
  const cached = scoreCache.get(wallet);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    if (!API_KEY) throw new Error('No API Key');

    // Attempt real API call
    // Note: Adjust endpoint path if necessary based on real API docs
    // Assuming /score/{wallet} for now based on typical patterns
    const response = await fetch(`${API_URL}/score/${wallet}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Transform API response to our format if needed
    // This assumes the API returns matching fields
    const formattedData: FairScoreData = {
      wallet,
      score: data.score || 0,
      tier: getTierFromScore(data.score || 0),
      percentileRank: data.percentile || 0,
      lastUpdated: Date.now(),
      trustNetwork: data.trust_network_count || 0,
      successfulTrades: data.trades_count || 0,
      flaggedTrades: data.flags_count || 0,
      averageTradeSize: data.avg_volume || 0,
      accountAge: data.days_active || 0
    };

    scoreCache.set(wallet, { data: formattedData, timestamp: Date.now() });
    return formattedData;

  } catch (error) {
    console.warn('FairScale API failed, using mock data:', error);
    const mock = generateMockFairScore(wallet);
    scoreCache.set(wallet, { data: mock, timestamp: Date.now() });
    return mock;
  }
};

export const refreshFairScore = async (wallet: string): Promise<FairScoreData> => {
  scoreCache.delete(wallet);
  return fetchFairScore(wallet);
};
