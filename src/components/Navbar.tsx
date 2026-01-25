"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    ArrowUpDown,
    Trophy,
    Crown,
    BarChart3,
    Wallet,
    ChevronDown,
    Copy,
    ExternalLink,
    LogOut,
    Menu,
    X,
    Award
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTier } from '@/context/TierContext';
import { getTheme } from '@/lib/theme';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

const navLinks = [
    { name: 'Trade', href: '#swap', icon: ArrowUpDown },
    { name: 'Earn', href: '#quests', icon: Trophy },
    { name: 'Leaderboard', href: '#leaderboard', icon: Crown },
    { name: 'Analytics', href: '#analytics', icon: BarChart3 },
];

const NavLink = ({ name, href, icon: Icon, isActive }: any) => (
    <motion.a
        href={href}
        className={cn(
            "relative px-5 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2",
            isActive
                ? "text-white solana-gradient shadow-lg"
                : "text-gray-400 hover:text-white hover:solana-gradient hover:shadow-md"
        )}
        whileHover={{ y: -2, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
            borderRadius: '10px',
            boxShadow: isActive ? '0 0 20px var(--glow-purple)' : undefined,
        }}
    >
        <Icon className="w-4 h-4" />
        {name}
        {isActive && (
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 solana-gradient"
                layoutId="activeSection"
                style={{ borderRadius: '2px', boxShadow: '0 0 8px var(--solana-green)' }}
            />
        )}
    </motion.a>
);

export const Navbar = () => {
    const { connected, publicKey, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const { tier, score } = useTier();
    const theme = getTheme(tier);

    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('#swap');

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 50);
            if (currentScrollY > lastScrollY && currentScrollY > 100) setHidden(true);
            else setHidden(false);
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const walletAddress = publicKey?.toString();

    return (
        <motion.nav
            animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "h-16 bg-gray-900/90 backdrop-blur-xl border-b border-white/10 shadow-2xl" : "h-20 bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-3 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <motion.div
                            className={cn("w-10 h-10 rounded-xl bg-gradient-to-br p-2 shadow-lg", theme.gradient)}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image src="/laptop-logo.png" alt="TrustSwap Logo" width={40} height={40} className="w-full h-full object-contain rounded-lg" />
                        </motion.div>
                        <h1 className={cn(
                            "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
                            theme.gradient
                        )}>
                            TrustSwap
                        </h1>
                    </motion.div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                {...link}
                                isActive={activeSection === link.href}
                            />
                        ))}
                    </div>

                    {/* Right Area */}
                    <div className="flex items-center gap-4">
                        {connected && (
                            <motion.div
                                className={cn(
                                    "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-opacity-20",
                                    `bg-${tier === 'diamond' ? 'cyan' : tier === 'gold' ? 'yellow' : 'orange'}-500/10`,
                                    `border-${tier === 'diamond' ? 'cyan' : tier === 'gold' ? 'yellow' : 'orange'}-500/30`
                                )}
                                style={{
                                    backgroundColor: `${theme.primary}20`,
                                    borderColor: `${theme.primary}40`,
                                }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Award className="w-4 h-4" style={{ color: theme.primary }} />
                                </motion.div>
                                <span className="text-sm font-bold uppercase tracking-tight" style={{ color: theme.primary }}>
                                    {tier}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">{score}</span>
                            </motion.div>
                        )}

                        {!connected ? (
                            <motion.button
                                onClick={() => setVisible(true)}
                                className={cn(
                                    "px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r transition-all duration-300",
                                    theme.gradient
                                )}
                                whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${theme.glow}` }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="flex items-center gap-2 text-sm">
                                    <Wallet className="w-4 h-4" />
                                    Connect
                                </div>
                            </motion.button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="px-4 py-2 rounded-xl font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center gap-3"
                                >
                                    <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", theme.gradient)}>
                                        <Wallet className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-mono hidden sm:block">
                                        {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                                    </span>
                                    <ChevronDown className={cn("w-4 h-4 transition-transform", showDropdown && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-64 rounded-xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-white/10 bg-white/5">
                                                <p className="text-xs text-gray-400 mb-1">Current Balance</p>
                                                <p className="text-lg font-bold text-white">12.45 SOL</p>
                                            </div>
                                            <div className="p-2">
                                                <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 rounded-lg flex items-center gap-2">
                                                    <Copy className="w-4 h-4" /> Copy Address
                                                </button>
                                                <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 rounded-lg flex items-center gap-2">
                                                    <ExternalLink className="w-4 h-4" /> View Explorer
                                                </button>
                                                <button
                                                    onClick={() => disconnect()}
                                                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 mt-1"
                                                >
                                                    <LogOut className="w-4 h-4" /> Disconnect
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg">
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-white/10 z-50 md:hidden flex flex-col p-6"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold">Menu</h2>
                                <button onClick={() => setMobileMenuOpen(false)}><X /></button>
                            </div>
                            <div className="space-y-2">
                                {navLinks.map((link) => (
                                    <a key={link.name} href={link.href} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                        <link.icon className="w-5 h-5" />
                                        <span className="font-medium text-lg">{link.name}</span>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
