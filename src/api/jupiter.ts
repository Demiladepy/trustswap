
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  priceUSD?: number;
  volume24h?: number;
}

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  priceImpactPct: number;
  fee: number;
  route: any[];
  outAmount: string; // Jupiter API uses outAmount
  inAmount: string; // Jupiter API uses inAmount
}

const JUPITER_API = 'https://quote-api.jup.ag/v6';
const TOKEN_LIST_API = 'https://token.jup.ag/strict'; // Strict list is better for safety

export const getTokenList = async (): Promise<Token[]> => {
  try {
    const response = await fetch(TOKEN_LIST_API);
    if (!response.ok) throw new Error('Failed to fetch tokens');
    const tokens = await response.json();

    // Add some common tokens if missing or ensure specific ones are top
    // For now just return the list, maybe sliced to top 100 for performance
    return tokens.slice(0, 100);
  } catch (error) {
    console.warn('Failed to fetch token list', error);
    // Fallback static list
    return [
      { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', decimals: 9, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', priceUSD: 140 },
      { address: 'EPjFWaKS3NiZkE6VA6U6eVJfUo5x2c9J6mNoeGAnjru', symbol: 'USDC', name: 'USD Coin', decimals: 6, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWaKS3NiZkE6VA6U6eVJfUo5x2c9J6mNoeGAnjru/logo.png', priceUSD: 1 },
    ];
  }
};

export const getSwapQuote = async (
  inputMint: string,
  outputMint: string,
  amount: number, // raw amount (not lamports)
  decimals: number,
  slippageBps: number = 50 // 0.5%
): Promise<SwapQuote | null> => {
  try {
    const amountInLamports = Math.floor(amount * (10 ** decimals));
    const url = `${JUPITER_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInLamports}&slippageBps=${slippageBps}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Quote failed');
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Jupiter quote error:', error);
    return null;
  }
};

export const executeSwap = async (wallet: any, quote: SwapQuote, connection: any) => {
  // This requires the complex setup of deserializing the transaction
  // For this prototype, we will return a success signal
  // In production:
  // 1. POST to /swap with quote
  // 2. Deserialize swapTransaction
  // 3. wallet.signTransaction
  // 4. connection.sendRawTransaction

  console.log('Executing swap with quote:', quote);

  // Simulating delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    txHash: '5KT...mock...hash',
    success: true
  };
};
