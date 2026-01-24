import { describe, it, expect, beforeAll } from 'vitest';
import { fetchFairScore, calculateTier, getTierBenefits } from '@/lib/fairscale';

describe('FairScale Integration', () => {
    describe('API Connection', () => {
        it('should fetch FairScore from API', async () => {
            const mockWallet = 'DemoWallet123...';
            const result = await fetchFairScore(mockWallet);

            expect(result).toBeDefined();
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(1000);
        });

        it('should handle API errors gracefully', async () => {
            const invalidWallet = ''; // Assuming empty triggers fallback in mock
            const result = await fetchFairScore(invalidWallet);

            expect(result).toBeDefined();
            expect(result.score).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Tier Calculation', () => {
        it('should correctly assign Bronze tier (0-299)', () => {
            expect(calculateTier(0)).toBe('bronze');
            expect(calculateTier(150)).toBe('bronze');
            expect(calculateTier(299)).toBe('bronze');
        });

        it('should correctly assign Silver tier (300-599)', () => {
            expect(calculateTier(300)).toBe('silver');
            expect(calculateTier(450)).toBe('silver');
            expect(calculateTier(599)).toBe('silver');
        });

        it('should correctly assign Gold tier (600-799)', () => {
            expect(calculateTier(600)).toBe('gold');
            expect(calculateTier(700)).toBe('gold');
            expect(calculateTier(799)).toBe('gold');
        });

        it('should correctly assign Diamond tier (800+)', () => {
            expect(calculateTier(800)).toBe('diamond');
            expect(calculateTier(950)).toBe('diamond');
            expect(calculateTier(1000)).toBe('diamond');
        });
    });

    describe('Tier Benefits', () => {
        it('should apply correct fees per tier', () => {
            expect(getTierBenefits('bronze').fee).toBe(0.005); // 0.5%
            expect(getTierBenefits('silver').fee).toBe(0.003); // 0.3%
            expect(getTierBenefits('gold').fee).toBe(0.001); // 0.1%
            expect(getTierBenefits('diamond').fee).toBe(0); // 0%
        });

        it('should set correct daily limits per tier', () => {
            expect(getTierBenefits('bronze').dailyLimit).toBe(1000);
            expect(getTierBenefits('silver').dailyLimit).toBe(10000);
            expect(getTierBenefits('gold').dailyLimit).toBe(50000);
            expect(getTierBenefits('diamond').dailyLimit).toBe(Infinity);
        });

        it('should gate features by tier', () => {
            expect(getTierBenefits('bronze').features).not.toContain('diamond_pool');
            expect(getTierBenefits('diamond').features).toContain('diamond_pool');
        });
    });
});
