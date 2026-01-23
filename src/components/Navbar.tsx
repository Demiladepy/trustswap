"use client";

import React from 'react';
import { Button } from './design-system/Button';
import { TierBadge } from './design-system/TierBadge';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0221]/80 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center font-heading font-bold text-xl text-black">
                        TS
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight hidden md:block">TrustSwap</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {['Trade', 'Earn', 'Leaderboard', 'Analytics'].map((item) => (
                        <a key={item} href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                {/* Right Area */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <TierBadge size="sm" showLabel={false} />
                    </div>
                    {/* Using Custom Styled Wallet Button wrapper over the adapter's button */}
                    <div className="hidden md:block rounded-xl overflow-hidden shadow-lg shadow-[var(--color-primary)]/20 border border-[var(--color-primary)]/20">
                        <WalletMultiButton style={{
                            backgroundColor: 'transparent',
                            height: '40px',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }} />
                    </div>
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 bg-[#0D0221]"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {['Trade', 'Earn', 'Leaderboard', 'Analytics'].map((item) => (
                                <a key={item} href="#" className="text-lg font-medium text-gray-400 hover:text-white py-2">
                                    {item}
                                </a>
                            ))}
                            <div className="w-full">
                                <WalletMultiButton style={{ width: '100%' }} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
