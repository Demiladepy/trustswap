import { describe, it, expect } from 'vitest';
import { analyzeRiskWithAI } from '@/lib/claude';
import { generateTrustNetwork } from '@/lib/network';
import { calculateStakingRewards } from '@/lib/staking';

describe('Wow Factor Features', () => {
    describe('AI Risk Analyzer', () => {
        it('should call Claude API successfully', async () => {
            const analysis = await analyzeRiskWithAI({
                amount: 100,
                token: 'SOL',
                userScore: 450,
            });

            expect(analysis).toBeDefined();
            expect(analysis.riskLevel).toMatch(/low|medium|high/i);
            expect(analysis.explanation).toBeTruthy();
        });
    });

    describe('Trust Network Visualization', () => {
        it('should generate network graph data', () => {
            const network = generateTrustNetwork('userWallet123');

            expect(network.nodes).toBeDefined();
            expect(network.nodes.length).toBeGreaterThan(0);
            expect(network.edges).toBeDefined();
        });
    });

    describe('Reputation Staking', () => {
        it('should calculate staking rewards correctly', () => {
            const reward = calculateStakingRewards({
                stakedAmount: 100,
                duration: 30, // days
                tier: 'gold',
            });

            expect(reward.multiplier).toBe(2);
            expect(reward.feeDiscount).toBeGreaterThan(0);
        });
    });
});
