# 🔌 TrustSwap API Integration Guide

## Overview

TrustSwap integrates with three main API services:
1. **FairScale** - User reputation scoring
2. **Jupiter** - Token swap aggregation
3. **Anthropic Claude** - AI risk analysis (coming Phase 7)

---

## 1️⃣ FairScale API Integration

### Location
`src/api/fairscale.ts`

### Purpose
Fetches and caches user reputation scores (FairScore).

### Key Functions

#### `fetchFairScore(wallet: string): Promise<FairScoreData>`
Fetches score for a wallet, with local caching.

```typescript
import { fetchFairScore } from '@/api/fairscale';

const score = await fetchFairScore('walletAddress');
// Returns: { wallet, score, tier, percentileRank, ... }
```

**Behavior**:
- Checks cache first (5-minute TTL)
- Tries real API if available
- Falls back to mock data
- Transforms API response to internal format

#### `generateMockFairScore(wallet: string): FairScoreData`
Creates deterministic mock score from wallet address.

```typescript
const mockScore = generateMockFairScore('So1ana...');
// Same wallet = same score (useful for testing)
```

#### `refreshFairScore(wallet: string): Promise<FairScoreData>`
Forces cache invalidation and fetches fresh score.

```typescript
await refreshFairScore(walletAddress);
// Used after swaps to get updated score
```

#### `fetchScoresBatch(wallets: string[]): Promise<FairScoreData[]>`
Fetches scores for multiple wallets in parallel.

```typescript
const scores = await fetchScoresBatch(['wallet1', 'wallet2', ...]);
```

#### `clearScoreCache(): void`
Clears entire cache.

```typescript
clearScoreCache(); // Use if cache gets out of sync
```

### Environment Variables
```env
NEXT_PUBLIC_FAIRSCALE_API_URL=https://api.fairscale.io
NEXT_PUBLIC_FAIRSCALE_API_KEY=your_api_key_here
```

### Data Structure
```typescript
interface FairScoreData {
  wallet: string;
  score: number;                  // 0-1000
  tier: TierType;                // 'bronze' | 'silver' | 'gold' | 'diamond'
  percentileRank: number;         // 0-100
  lastUpdated: number;            // timestamp
  trustNetwork: number;           // number of trusted wallets
  successfulTrades: number;
  flaggedTrades: number;
  averageTradeSize: number;
  accountAge: number;             // in days
}
```

### Caching Strategy
- **TTL**: 5 minutes
- **Cache key**: wallet address
- **In-memory**: `scoreCache` Map
- **Clear**: On disconnect or manual refresh

### Demo Mode
- Generates scores based on wallet address seed
- Provides 50 mock wallets for leaderboard
- Consistent across refreshes

---

## 2️⃣ Jupiter API Integration

### Location
`src/api/jupiter.ts`

### Purpose
Handles token swaps via Jupiter Aggregator.

### Key Functions

#### `getTokenList(): Promise<Token[]>`
Fetches available tokens for swapping.

```typescript
import { getTokenList } from '@/api/jupiter';

const tokens = await getTokenList();
// Returns: [
//   { address, symbol, name, decimals, logoURI, priceUSD, volume24h },
//   ...
// ]
```

**Included Tokens (Hard-coded)**:
- SOL (Solana)
- USDC (USD Coin)
- USDT (Tether USD)
- MANGO (Mango Protocol)
- RLB (Rollbit)

#### `getSwapQuote(inputMint, outputMint, amount, slippage?): Promise<SwapQuote>`
Gets price quote for a token swap.

```typescript
const quote = await getSwapQuote(
  'So11111111111111111111111111111111111111112', // SOL
  'EPjFWaKS3NiZkE6VA6U6eVJfUo5x2c9J6mNoeGAnjru', // USDC
  1.5,
  0.5  // 0.5% slippage
);
// Returns: { inputAmount, outputAmount, priceImpactPct, fee, route }
```

#### `executeSwap(walletAddress, quote): Promise<{ txHash, success }>`
Executes the swap transaction.

```typescript
const result = await executeSwap(wallet, quote);
if (result.success) {
  console.log('Tx hash:', result.txHash);
}
```

**Current State**: Returns mock tx hash. In production, would:
1. Get swap instruction from Jupiter
2. Sign with wallet adapter
3. Send to Solana network
4. Wait for confirmation

#### `generateMockQuote(inputMint, outputMint, amount): SwapQuote`
Creates mock quote for demo mode.

#### `getTokenPrice(mintAddress): Promise<number>`
Fetches current USD price via Coingecko.

#### `getTokenHistory(mintAddress, days?): Promise<Array<{timestamp, price}>>`
Gets historical price data for charts (Phase 7).

### Data Structures

#### Token
```typescript
interface Token {
  address: string;           // Mint address
  symbol: string;            // e.g., 'SOL'
  name: string;              // e.g., 'Solana'
  decimals: number;
  logoURI?: string;
  priceUSD?: number;
  volume24h?: number;
}
```

#### SwapQuote
```typescript
interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: number;
  outputAmount: number;
  priceImpactPct: number;     // 0-100
  fee: number;                // in output token amount
  route: any[];               // Jupiter route details
}
```

### Environment Variables
```env
# Already hard-coded, but can be customized:
NEXT_PUBLIC_JUPITER_API=https://quote-api.jup.ag/v6
```

### Demo Mode
- Generates realistic quotes with slight variance
- 95-100% of input amount output
- 0.1% mock fee
- 0-2% price impact
- Same inputs = same output (deterministic)

### Usage in Components
```typescript
import { useSwap } from '@/hooks';

const { tokens, quote, fetchQuote, executeSwapTx } = useSwap(walletAddress);

// Get available tokens
const tokens = await getTokenList();

// Fetch quote
const quote = await fetchQuote(inputMint, outputMint, amount);

// Execute swap
const result = await executeSwapTx(quote);
```

---

## 3️⃣ Anthropic Claude API (Coming Phase 7)

### Location
`src/api/claude.ts` (to be created)

### Purpose
AI-powered risk analysis for swaps.

### Planned Integration

```typescript
import { analyzeSwapRisk } from '@/api/claude';

const analysis = await analyzeSwapRisk({
  walletScore: 650,
  swapSize: 10000,
  tokenPair: 'SOL/USDC',
  historyOfWallet: transactions,
});

// Returns: {
//   riskLevel: 'low' | 'medium' | 'high',
//   riskScore: 0-100,
//   reasons: ['Token volatility high', ...],
//   recommendations: ['Consider smaller amount', ...],
//   explanation: 'Natural language explanation',
// }
```

### Environment Variables
```env
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_claude_api_key
```

### Features
- Analyzes trade patterns
- Considers FairScore reputation
- Detects unusual behavior
- Provides natural language explanations
- Recommends safe amounts

---

## 🔄 API Flow Diagram

```
User Connects Wallet
    ↓
useWallet Hook
    ↓
fetchFairScore(walletAddress)
    ├→ Check cache
    ├→ Try FairScale API
    └→ Return mock if needed
    ↓
Display Score & Tier
    ↓
User Selects Tokens
    ↓
getTokenList()
    ├→ Try Jupiter API
    └→ Return hard-coded tokens
    ↓
User Enters Amount
    ↓
getSwapQuote(input, output, amount)
    ├→ Try Jupiter API
    ├→ Calculate fees from tier
    └→ Return quote
    ↓
User Confirms Swap
    ↓
executeSwap(walletAddress, quote)
    ├→ Get instruction from Jupiter
    ├→ Sign with wallet
    ├→ Send to blockchain
    └→ Return tx hash
    ↓
refreshFairScore(walletAddress)
    └→ Update score after transaction
```

---

## ⚠️ Error Handling

All API functions include:

```typescript
try {
  // API call
} catch (error) {
  console.warn('API failed, using mock data:', error);
  return generateMockData(); // Fallback
}
```

This ensures the app works even if:
- API is down
- Network is disconnected
- API keys are invalid
- Rate limits are hit

---

## 🧪 Testing APIs

### Test FairScore
```typescript
import { fetchFairScore, generateMockFairScore } from '@/api/fairscale';

const score = await fetchFairScore('So1ana...');
console.log(score);

const mock = generateMockFairScore('So1ana...');
console.log(mock);
```

### Test Jupiter
```typescript
import { getTokenList, getSwapQuote } from '@/api/jupiter';

const tokens = await getTokenList();
console.log(tokens);

const quote = await getSwapQuote(
  tokens[0].address,
  tokens[1].address,
  1.5
);
console.log(quote);
```

### Test Error Handling
```typescript
// Manually break API:
process.env.NEXT_PUBLIC_FAIRSCALE_API_KEY = 'invalid';

// Should fall back to mock
const score = await fetchFairScore('So1ana...');
console.log(score); // Mock data
```

---

## 📊 API Rate Limits (Production)

- **FairScale**: Check docs
- **Jupiter**: 50 requests/second
- **Claude**: Check docs

### Implemented Protection
- ✅ Response caching (FairScale)
- ✅ Debounced API calls
- ✅ Local state validation
- ✅ Batch operations where possible

---

## 🔐 API Security

### Current Implementation
```env
NEXT_PUBLIC_*  # These are exposed to client
```

### Production Considerations
- Move `FAIRSCALE_API_KEY` to backend
- Use API route handlers instead
- Validate requests server-side
- Implement rate limiting
- Use JWT for user sessions

### Example Backend Route (Future)
```typescript
// app/api/fairscale/score/route.ts
export async function POST(req: Request) {
  const { wallet } = await req.json();
  
  // Verify user is authenticated
  const apiKey = process.env.FAIRSCALE_API_KEY;
  
  // Make request on backend
  const score = await fetch('https://api.fairscale.io...', {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  
  return Response.json(score);
}
```

---

## 📞 API Status Endpoints

To monitor API health:

```typescript
// Add to phase 4/5
async function checkAPIStatus() {
  const status = {
    fairscale: false,
    jupiter: false,
    claude: false,
  };
  
  try {
    await fetch('https://api.fairscale.io/health');
    status.fairscale = true;
  } catch {}
  
  try {
    await fetch('https://quote-api.jup.ag/');
    status.jupiter = true;
  } catch {}
  
  return status;
}
```

---

## 🚀 Next Phase APIs

### Phase 7 Additions
- Claude AI integration
- Advanced analytics APIs
- On-chain transaction history
- Portfolio tracking APIs

### Phase 8
- Real blockchain interaction
- Wallet signing
- Transaction confirmation
- Event monitoring

---

## 📚 API References

- **FairScale**: https://fairscale.io/docs
- **Jupiter**: https://docs.jup.ag/
- **Solana**: https://docs.solana.com/
- **Anthropic Claude**: https://docs.anthropic.com/

---

*API Integration Guide*  
*TrustSwap Project*  
*Last Updated: January 23, 2026*
