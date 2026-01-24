import '@testing-library/jest-dom';
import { vi } from 'vitest';

process.env.NEXT_PUBLIC_FAIRSCALE_API_KEY = 'mock_key';
process.env.NEXT_PUBLIC_FAIRSCALE_API_URL = 'https://api.mock';

// Mock global fetch
global.fetch = vi.fn().mockImplementation((url: string) => {
    if (url.includes('jup.ag')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                outAmount: '1000000',
                inAmount: '1000000',
                priceImpactPct: 0.1,
                fee: 0.003
            }),
        });
    }
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ score: 500, percentile: 40 }),
    });
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock canvas confetti
vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
}));
