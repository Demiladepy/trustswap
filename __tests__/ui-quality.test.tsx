import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the context hooks
vi.mock('@/context/TierContext', () => ({
    useTier: () => ({
        tier: 'bronze',
        score: 100,
        nextTierScore: 300,
        progressToNextTier: 20,
        isLoading: false
    })
}));

vi.mock('@solana/wallet-adapter-react', () => ({
    useWallet: () => ({
        connected: false,
        publicKey: null,
        disconnect: vi.fn()
    }),
    useConnection: () => ({ connection: {} })
}));

// Components usually need React wrapped
import { TierBadge } from '@/components/design-system/TierBadge';

describe('UI/UX Quality', () => {
    describe('Animations', () => {
        it('should render the tier badge', () => {
            render(<TierBadge size="md" />);
            expect(screen.getByText(/bronze/i)).toBeTruthy();
        });
    });
});
