// Core Types for TrustSwap

export type TierType = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface UserTier {
  type: TierType;
  minScore: number;
  maxScore: number;
  fee: number; // percentage
  dailyLimit: number; // in USDC
  features: string[];
  color: string;
  gradient: string;
}

export interface FairScoreData {
  wallet: string;
  score: number;
  tier: TierType;
  percentileRank: number;
  lastUpdated: number;
  trustNetwork: number; // number of trusted connections
  successfulTrades: number;
  flaggedTrades: number;
  averageTradeSize: number;
  accountAge: number; // in days
}

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: number;
  outputAmount: number;
  priceImpactPct: number;
  fee: number; // in output token
  route: any[];
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  priceUSD?: number;
  volume24h?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number; // points
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: 'trading' | 'social' | 'staking';
}

export interface TradeActivityItem {
  id: string;
  wallet: string;
  action: 'swap' | 'tier_upgrade' | 'staking' | 'quest_complete';
  fromToken?: string;
  toToken?: string;
  amount?: number;
  tier?: TierType;
  timestamp: number;
  txHash?: string;
}

export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  score: number;
  tier: TierType;
  totalVolume: number;
  successRate: number;
  trustConnections: number;
}

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  reasons: string[];
  recommendations: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export interface StakingPosition {
  id: string;
  stakedScore: number;
  startedAt: number;
  unlockedAt?: number;
  feeDiscount: number; // multiplier (e.g., 2x = 0.5x fee)
  riskOfLoss: boolean;
}
