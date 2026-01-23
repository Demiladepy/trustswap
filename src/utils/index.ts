/**
 * Utility functions for TrustSwap
 */

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toFixed(2);
};

export const shortenWallet = (wallet: string, chars: number = 4): string => {
  return `${wallet.slice(0, chars)}...${wallet.slice(-chars)}`;
};

export const generateMockWallets = (count: number): string[] => {
  const wallets: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomBytes = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 256)
    );
    // This is a simplified base58 encoding for demo purposes
    wallets.push(
      'So1anaSample' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2)
    );
  }
  return wallets;
};

export const generateMockScore = (seed: number): number => {
  // Use seed to generate consistent scores for wallet addresses
  return Math.floor((Math.sin(seed) + 1) * 500) % 1000;
};

export const calculatePercentileRank = (score: number, allScores: number[]): number => {
  const betterScores = allScores.filter((s) => s >= score).length;
  return Math.round((betterScores / allScores.length) * 100);
};

export const calculateDaysUntilNextTier = (
  currentScore: number,
  scoreGrowthPerDay: number
): number => {
  if (scoreGrowthPerDay <= 0) return Infinity;

  // Tier thresholds: 300, 600, 800
  let targetScore = 300;
  if (currentScore >= 300) targetScore = 600;
  if (currentScore >= 600) targetScore = 800;
  if (currentScore >= 800) return 0;

  return Math.ceil((targetScore - currentScore) / scoreGrowthPerDay);
};

export const getContrastColor = (hexColor: string): 'white' | 'black' => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const validateWalletAddress = (address: string): boolean => {
  // Basic Solana wallet validation (44 chars, base58)
  return /^[1-9A-HJ-NP-Z]{44}$/.test(address);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateGradient = (color: string): string => {
  const tiers: Record<string, string> = {
    bronze: 'from-orange-600 via-orange-500 to-orange-400',
    silver: 'from-gray-400 via-gray-300 to-gray-200',
    gold: 'from-yellow-500 via-yellow-400 to-yellow-300',
    diamond: 'from-cyan-400 via-blue-400 to-purple-400',
  };
  return tiers[color] || 'from-gray-600 to-gray-400';
};
