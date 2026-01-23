/**
 * Jupiter Aggregator API Integration
 * Handles token swaps and price quotes
 */

import { SwapQuote, Token } from '@/types';

const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';

// Popular tokens on Solana
const COMMON_TOKENS: Token[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  {
    address: 'EPjFWaKS3NiZkE6VA6U6eVJfUo5x2c9J6mNoeGAanjru',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWaKS3NiZkE6VA6U6eVJfUo5x2c9J6mNoeGAanjru/logo.png',
  },
  {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenErt',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenErt/logo.png',
  },
  {
    address: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
    symbol: 'MANGO',
    name: 'Mango',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac/logo.png',
  },
  {
    address: 'RLBxxFkseAZ4RgJH3Sqn8jXARVxMJzR1G5H5e8Qvv9',
    symbol: 'RLB',
    name: 'Rollbit',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/RLBxxFkseAZ4RgJH3Sqn8jXARVxMJzR1G5H5e8Qvv9/logo.png',
  },
];

/**
 * Get list of popular tokens
 */
export const getTokenList = async (): Promise<Token[]> => {
  try {
    // In production, fetch from Jupiter token list
    // const response = await fetch('https://token.jup.ag/all');
    // const tokens = await response.json();
    // return tokens;
    
    return COMMON_TOKENS;
  } catch (error) {
    console.warn('Failed to fetch token list:', error);
    return COMMON_TOKENS;
  }
};

/**
 * Get price quote from Jupiter
 */
export const getSwapQuote = async (
  inputMint: string,
  outputMint: string,
  amount: number,
  slippage: number = 0.5
): Promise<SwapQuote | null> => {
  try {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippageBps: (slippage * 100).toString(),
    });

    const response = await fetch(`${JUPITER_API_BASE}/quote?${params}`);
    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`);
    }

    const data = await response.json();
    return transformJupiterQuote(data, inputMint, outputMint);
  } catch (error) {
    console.warn('Failed to get swap quote:', error);
    // Return mock quote for demo
    return generateMockQuote(inputMint, outputMint, amount);
  }
};

/**
 * Transform Jupiter API response to our format
 */
const transformJupiterQuote = (apiData: any, inputMint: string, outputMint: string): SwapQuote => {
  return {
    inputMint,
    outputMint,
    inputAmount: parseInt(apiData.inAmount) / 10 ** 9, // Simplified decimals
    outputAmount: parseInt(apiData.outAmount) / 10 ** 6,
    priceImpactPct: apiData.priceImpactPct || 0.1,
    fee: 0,
    route: apiData.routePlan || [],
  };
};

/**
 * Generate mock quote for demo
 */
export const generateMockQuote = (
  inputMint: string,
  outputMint: string,
  amount: number
): SwapQuote => {
  const outputAmount = amount * (0.95 + Math.random() * 0.05); // 95-100% of input
  const priceImpact = Math.random() * 2;

  return {
    inputMint,
    outputMint,
    inputAmount: amount,
    outputAmount,
    priceImpactPct: priceImpact,
    fee: amount * 0.001, // 0.1% mock fee
    route: [],
  };
};

/**
 * Execute swap (in production this would use web3.js to send transaction)
 */
export const executeSwap = async (
  walletAddress: string,
  quote: SwapQuote
): Promise<{ txHash: string; success: boolean }> => {
  try {
    // In production:
    // 1. Get swap instruction from Jupiter
    // 2. Sign with wallet adapter
    // 3. Send to Solana network
    // 4. Wait for confirmation

    // For demo, simulate successful swap
    const txHash = 'mock_' + Math.random().toString(36).substring(7);
    
    return {
      txHash,
      success: true,
    };
  } catch (error) {
    console.error('Swap execution failed:', error);
    return {
      txHash: '',
      success: false,
    };
  }
};

/**
 * Get token price in USD
 */
export const getTokenPrice = async (mintAddress: string): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${mintAddress}&vs_currencies=usd`
    );
    const data = await response.json();
    return data[mintAddress]?.usd || 0;
  } catch (error) {
    console.warn('Failed to fetch token price:', error);
    return 0;
  }
};

/**
 * Get historical prices for a token
 */
export const getTokenHistory = async (
  mintAddress: string,
  days: number = 30
): Promise<Array<{ timestamp: number; price: number }>> => {
  try {
    // Mock data for demo
    const data = [];
    const basePrice = Math.random() * 100 + 10;
    
    for (let i = days; i >= 0; i--) {
      const timestamp = Date.now() - i * 24 * 60 * 60 * 1000;
      const price = basePrice * (1 + (Math.random() - 0.5) * 0.2);
      data.push({ timestamp, price });
    }

    return data;
  } catch (error) {
    console.warn('Failed to fetch token history:', error);
    return [];
  }
};
