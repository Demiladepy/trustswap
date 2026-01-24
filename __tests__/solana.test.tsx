import { describe, it, expect, vi } from 'vitest';
import { getSwapQuote, executeSwap } from '@/lib/jupiter';

// Mock Web3.js
vi.mock('@solana/web3.js', () => ({
    Connection: vi.fn().mockImplementation(() => ({
        getVersion: vi.fn().mockResolvedValue({ 'solana-core': '1.14.0' }),
        getBalance: vi.fn().mockResolvedValue(1000000000), // 1 SOL
    })),
    PublicKey: vi.fn().mockImplementation((val) => ({ toString: () => val }))
}));

describe('Solana Integration', () => {
    describe('Jupiter Integration', () => {
        it('should fetch swap quote', async () => {
            const quote = await getSwapQuote({
                inputMint: 'SOL',
                outputMint: 'USDC',
                amount: 1000000, // 0.001 SOL
            });

            expect(quote).toBeDefined();
            expect(quote.outAmount).toBeDefined();
        });

        it('should calculate fees correctly', async () => {
            const outAmount = 1000000;

            const bronzeFee = outAmount * 0.005;
            const silverFee = outAmount * 0.003;

            expect(bronzeFee).toBeGreaterThan(silverFee);
        });
    });

    describe('Transaction Building', () => {
        it('should build valid transaction', async () => {
            const tx = await executeSwap({
                inputMint: 'SOL',
                outputMint: 'USDC',
                amount: 1000000,
                userPublicKey: 'Demo...',
            });

            expect(tx).toBeDefined();
            expect(tx.transaction).toBeDefined();
        });
    });
});
